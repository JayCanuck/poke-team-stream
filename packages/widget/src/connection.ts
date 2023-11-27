import { SE_STORE_KEY_PREFIX } from './config';
import { JsonWebKeyPair, loadKeys, sign, verify } from './jwt';
import { getActiveTeam } from './team';
import { RTCStartOptions, start as startRTC } from './webrtc';

const STORE_AUTH_KEY = `${SE_STORE_KEY_PREFIX}-auth`;

export interface ConnectionOptions extends Omit<RTCStartOptions, 'onInitRTC'> {
  password: string;
}

enum AuthErrorCodes {
  BadRequest = 1,
  Invalid = 2,
  IncorrectPassword = 3
}

let authJWK: JsonWebKeyPair;
let authenticated: boolean;

const ensureJWKLoaded = async () => {
  if (!authJWK) {
    authJWK = await SE_API.store.get<JsonWebKeyPair>(STORE_AUTH_KEY);
    authJWK = await loadKeys(authJWK);
    await SE_API.store.set(STORE_AUTH_KEY, authJWK);
  }
};

const generateToken = async (data: Record<string, unknown>) => {
  try {
    return await sign(data);
  } catch (err) {
    console.error('Token generate error', err);
  }
};

export const start = async ({ key, password, onMessage, ...options }: ConnectionOptions) => {
  const authData = { key, password };
  await ensureJWKLoaded();
  return await startRTC({
    ...options,
    key,
    onInitRTC: () => {
      authenticated = false;
    },
    onMessage: (msg, channel) => {
      if (authenticated) {
        onMessage(msg, channel);
      } else if (msg.type === 'auth-pwd') {
        // attempting to auth via password
        if (typeof msg.password === 'string') {
          if (password === msg.password) {
            // send successful auth response
            authenticated = true;
            channel.send(JSON.stringify({ type: 'auth-success' }));
            channel.send(JSON.stringify({ type: 'team', state: getActiveTeam() }));
            // asynchronously send a token for future passwordless usage
            generateToken(authData).then(token => {
              if (token) channel.send(JSON.stringify({ type: 'auth-new-token', name: key, token }));
            });
          } else {
            channel.send(
              JSON.stringify({
                type: 'auth-failure',
                code: AuthErrorCodes.IncorrectPassword,
                message: 'Incorrect password'
              })
            );
          }
        } else {
          channel.send(
            JSON.stringify({ type: 'auth-failure', code: AuthErrorCodes.BadRequest, message: 'Bad request' })
          );
        }
      } else if (msg.type === 'auth-token') {
        // attempting to auth via JWT
        if (typeof msg.token === 'string') {
          verify(msg.token as string).then(async isValid => {
            if (isValid) {
              // send successful auth response
              authenticated = true;
              channel.send(JSON.stringify({ type: 'auth-success' }));
              channel.send(JSON.stringify({ type: 'team', state: getActiveTeam() }));
              // asynchronously send a refreshed token
              const refreshed = await generateToken(authData);
              if (refreshed) channel.send(JSON.stringify({ type: 'auth-new-token', name: key, token: refreshed }));
            } else {
              channel.send(
                JSON.stringify({ type: 'auth-failure', code: AuthErrorCodes.Invalid, message: 'Token not valid' })
              );
            }
          });
        } else {
          channel.send(
            JSON.stringify({ type: 'auth-failure', code: AuthErrorCodes.BadRequest, message: 'Bad request' })
          );
        }
      }
    }
  });
};
