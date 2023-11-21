// Key string to store the auth keypair under with the StreamElements API
export const SE_STORE_KEY_PREFIX = import.meta.env.VITE_SE_STORE_AUTH_KEY || 'poketeamstream';

export const MAX_LIFE = parseInt(import.meta.env.MAX_LIFE) || 1000 * 60 * 60 * 24; // 24 hours

// WebSocket signal server address
// Only config which is explicitly required in env var/dotenv
export const SIGNAL_SERVER = import.meta.env.VITE_SIGNAL_SERVER;

// ICE server list for WebRTC connection lookup
export const ICE_SERVERS = import.meta.env.VITE_ICE_SERVERS
  ? (import.meta.env.VITE_ICE_SERVERS as string).split(',')
  : ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'];
