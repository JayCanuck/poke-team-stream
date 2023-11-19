// Cache time for PokeAPI queries stored in IndexDB
// 5 minutes in dev builds, 24 hours in production
export const CACHETIME = import.meta.env.DEV ? 1000 * 60 * 5 : 1000 * 60 * 60 * 24;

// IndexDB storage key for PokeAPI query data caching
export const IDB_STORAGE_KEY = import.meta.env.VITE_IDB_STORAGE_KEY || 'pokeapi-query';

// WebSocket signal server address
// Only config which is explicitly required in env var/dotenv
export const SIGNAL_SERVER = import.meta.env.VITE_SIGNAL_SERVER;

// ICE server list for WebRTC connection lookup
export const ICE_SERVERS = import.meta.env.VITE_ICE_SERVERS
  ? (import.meta.env.VITE_ICE_SERVERS as string).split(',')
  : ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'];

// Timeout for establishing WebRTC connection,including signal server exchange (default 45s)
// 45 second connection time default
// May seem long, but some free webservice hosting (for signal server), spin-down inactive servers
export const CONNECTION_TIMEOUT = parseInt(import.meta.env.VITE_CONNECTION_TIMEOUT) || 45_000;

// Timeout for PokeAPI usage (default 10)
export const POKEAPI_TIMEOUT = parseInt(import.meta.env.VITE_POKEAPI_TIMEOUT) || 10_000;

// Language for PokeAPI queries (default 'en')
export const POKEAPI_LANGUAGE = import.meta.env.VITE_POKEAPI_LANGUAGE || 'en';
