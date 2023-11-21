/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ICE_SERVER: string;
  readonly VITE_SIGNAL_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface StreamElementsStore {
  readonly set: (key: string, value: unknown) => Promise<void>;
  readonly get: <T>(key: string) => Promise<T>;
}

interface StreamElementsAPI {
  readonly store: StreamElementsStore;
}

declare const SE_API: StreamElementsAPI;
