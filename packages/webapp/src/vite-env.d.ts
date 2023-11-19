/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ICE_SERVER: string;
  readonly VITE_SIGNAL_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
