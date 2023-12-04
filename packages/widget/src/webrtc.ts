import { ICE_SERVERS, SIGNAL_SERVER } from './config';

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

// WebRTC start connection types

export interface RTCStartOptions {
  key: string;
  onInitRTC: () => void;
  onMessage: (message: Record<string, unknown>, channel: RTCDataChannel) => void;
}

type InitPeerConnectionOptions = Pick<RTCStartOptions, 'key' | 'onMessage' | 'onInitRTC'>;

// WebRTC connecttion

let signalSocket: WebSocket;
let connection: RTCPeerConnection;

// Creates the RTC peer connection, handling ICE candidate exchange and errors
// Received payloads are sent to onMessage callback
const initPeerConnection = ({ key, onInitRTC, onMessage }: InitPeerConnectionOptions) => {
  if (connection && ['closed', 'disconnected', 'failed'].includes(connection.connectionState)) {
    connection.close();
  }
  onInitRTC();
  connection = new RTCPeerConnection({ iceServers: [{ urls: ICE_SERVERS }] });
  connection.onicecandidateerror = ev => {
    // 701 lookup error is often non-fatal and does not indicate connection failure
    if ((ev as RTCPeerConnectionIceErrorEvent).errorCode !== 701) {
      console.log('ICE candidate error', ev);
    }
  };
  connection.onconnectionstatechange = () => {
    console.log('Connection state change', connection?.connectionState);
    if (connection?.connectionState === 'failed') {
      connection?.close();
    }
  };
  connection.addEventListener('datachannel', ev => {
    console.log('datachannel', ev);
    ev.channel.onopen = () => {
      console.log('Data channel opened');
    };
    ev.channel.onmessage = event => {
      onMessage(JSON.parse(event.data), ev.channel);
    };
    ev.channel.onerror = ev => {
      console.log('Data channel error', (ev as RTCErrorEvent).error);
      connection?.close();
    };
    ev.channel.onclose = () => {
      console.log('Data channel closed');
      if (['connected', 'connecting'].includes(connection.connectionState)) {
        connection?.close();
      }
      // re-initialize with signal server
      initPeerConnection({ key, onInitRTC, onMessage });
      signalSocket?.send(JSON.stringify({ key, type: 'init' }));
    };
  });
  connection.onicecandidate = ev => {
    if (signalSocket && signalSocket.readyState === WebSocket.OPEN && ev.candidate) {
      console.log('sending candidate');
      signalSocket.send(JSON.stringify({ key, type: 'candidate', value: ev.candidate }));
    }
  };
};

// Returns promise that resolves after signal server is connected and waiting for client
// Will automatically handle incoming peers and relay received WebRTC messages
export const start = ({ key, onInitRTC, onMessage }: RTCStartOptions) => {
  return new Promise<void>(resolve => {
    signalSocket = new WebSocket(SIGNAL_SERVER);
    signalSocket.addEventListener('open', () => {
      initPeerConnection({ key, onInitRTC, onMessage });
      signalSocket.send(JSON.stringify({ key, type: 'init' }));
      resolve();
    });
    signalSocket.addEventListener('error', ev => {
      console.log('Signal server websocket error:', ev);
    });
    signalSocket.addEventListener('message', (ev: MessageEvent<string>) => {
      const payload = JSON.parse(ev.data) as SignalSocketPayload;
      console.log('socket payload', payload);
      if (payload.type === 'offer') {
        connection.setRemoteDescription(payload.value).then(async () => {
          const answer = await connection.createAnswer();
          await connection.setLocalDescription(answer);
          console.log('sending answer', answer);
          signalSocket.send(JSON.stringify({ key, type: 'answer', value: answer }));
        });
      } else if (payload.type === 'candidate') {
        connection.addIceCandidate(payload.value);
      }
    });
  });
};
