/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from 'react';
import { CONNECTION_TIMEOUT, ICE_SERVERS, SIGNAL_SERVER } from '../config';

// Signal socket interfaces

interface SignalPayloadBase {
  key: string;
  // additionally properties can be included and will be forwarded to connected clients
  [K: string]: unknown;
}

interface InitSignalPayload extends SignalPayloadBase {
  type: 'init';
}

interface DescriptionSignalPayload extends SignalPayloadBase {
  type: 'offer' | 'answer';
  value: RTCSessionDescriptionInit;
}

interface CandidateSignalPayload extends SignalPayloadBase {
  type: 'candidate';
  value: RTCIceCandidate;
}

type SignalSocketPayload = InitSignalPayload | DescriptionSignalPayload | CandidateSignalPayload;

// useWebRTC interfaces

export enum ReadyState {
  Connecting = 'connecting',
  Connected = 'connected',
  Closing = 'closing',
  Closed = 'closed'
}

export interface WebRTCState {
  lastMessage: Record<string, any> | null;
  readyState: ReadyState;
  error: Error | null;
}

export interface WebRTCActions {
  connect: (key: string) => void;
  sendMessage: (message: Record<string, any>) => void;
  disconnect: () => void;
}

export const useWebRTC = (): [WebRTCState, WebRTCActions] => {
  const signalSocket = useRef<WebSocket | null>(null);
  const connection = useRef<RTCPeerConnection | null>(null);
  const channel = useRef<RTCDataChannel | null>(null);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastMessage, setLastMessage] = useState<Record<string, any> | null>(null);
  const [readyState, setReadyState] = useState(ReadyState.Closed);
  const [error, setError] = useState<Error | null>(null);

  const clearRefs = () => {
    signalSocket.current = null;
    connection.current = null;
    channel.current = null;
  };

  const disconnect = useCallback(() => {
    setReadyState(connection.current ? ReadyState.Closing : ReadyState.Closed);
    if (channel.current && channel.current.readyState !== 'closed') channel.current.close();
    if (signalSocket.current && signalSocket.current.readyState !== WebSocket.CLOSED) signalSocket.current.close();
    if (connection.current && ['disconnected', 'closed', 'failed'].includes(connection.current!.connectionState)) {
      // already closed, just update readyState and clear refs
      setReadyState(ReadyState.Closed);
      clearRefs();
    } else {
      connection.current?.close();
    }
  }, [setReadyState]);

  const connect = useCallback(
    (key: string) => {
      setError(null);
      setReadyState(ReadyState.Connecting);
      // Connect timeout handling (10 seconds)
      if (!timeoutId.current) {
        timeoutId.current = setTimeout(() => {
          setError(new Error('Connection attempt timed out'));
          disconnect();
        }, CONNECTION_TIMEOUT);
      }

      // Create local RTCPeerConnection
      if (!connection.current) {
        connection.current = new RTCPeerConnection({ iceServers: [{ urls: ICE_SERVERS }] });

        // Set up the connection event handlers
        connection.current.onconnectionstatechange = () => {
          console.log('Connection state change', connection.current?.connectionState);
          if (['disconnected', 'closed'].includes(connection.current!.connectionState)) {
            setReadyState(ReadyState.Closed);
            clearRefs();
          } else if (connection.current?.connectionState === 'failed') {
            setError(state => {
              // error may have surfaced elsewhere, no need to overwrite
              if (!state) return new Error('Peer connection failed');
              return state;
            });
            clearRefs();
            disconnect();
          }
        };
        connection.current.onicecandidateerror = ev => {
          // 701 lookup error is often non-fatal and does not indicate connection failure
          if ((ev as RTCPeerConnectionIceErrorEvent).errorCode !== 701) {
            console.log('ICE candidate error', ev);
            setError(new Error((ev as RTCPeerConnectionIceErrorEvent).errorText));
          }
        };

        // Create a data channel
        channel.current = connection.current.createDataChannel(key);

        // Set up the data channel event handlers
        channel.current.onopen = () => {
          if (timeoutId.current) {
            clearTimeout(timeoutId.current);
            timeoutId.current = null;
          }
          setReadyState(ReadyState.Connected);
        };
        channel.current.onmessage = ev => {
          console.log('Data channel message', ev.data);
          setLastMessage(JSON.parse(ev.data));
        };
        channel.current.onerror = ev => {
          console.log('Data channel error', (ev as RTCErrorEvent).error);
          setError((ev as RTCErrorEvent).error);
          setReadyState(ReadyState.Closing);
          disconnect();
        };
        channel.current.onclose = () => {
          if (['disconnected', 'closed', 'failed'].includes(connection.current!.connectionState)) {
            // overall connection closed, update readyState
            setReadyState(ReadyState.Closed);
            clearRefs();
          }
        };

        // Connect to signal server
        signalSocket.current = new WebSocket(SIGNAL_SERVER);
        signalSocket.current.onopen = () => {
          // Handle candidates
          connection.current!.onicecandidate = ev => {
            if (signalSocket.current?.readyState === WebSocket.OPEN && ev.candidate) {
              signalSocket.current?.send(JSON.stringify({ key, type: 'candidate', value: ev.candidate }));
            }
          };
          connection.current?.createOffer().then(async offer => {
            await connection.current?.setLocalDescription(offer);
            signalSocket.current?.send(JSON.stringify({ key, type: 'offer', value: offer }));
          });
        };
        signalSocket.current.onmessage = (ev: MessageEvent<string>) => {
          const payload = JSON.parse(ev.data) as SignalSocketPayload;
          if (payload.type === 'answer') {
            connection.current?.setRemoteDescription(payload.value);
            signalSocket.current?.close();
          } else if (payload.type === 'candidate') {
            connection.current?.addIceCandidate(payload.value);
          }
        };
      }
    },
    [setLastMessage, setReadyState, setError, disconnect]
  );

  const sendMessage = useCallback(
    (message: Record<string, unknown>) => {
      if (channel.current && readyState === ReadyState.Connected) {
        channel.current.send(JSON.stringify(message));
      }
    },
    [readyState]
  );

  return [
    {
      lastMessage,
      readyState,
      error
    },
    {
      connect,
      sendMessage,
      disconnect
    }
  ];
};
