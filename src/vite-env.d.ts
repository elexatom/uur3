/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_PASSWORD: string;
  readonly VITE_OSRM_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
