interface ImportMetaEnv {
  readonly VITE_APP_SERVER_URL: string
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_LS_STORAGE_TOKEN_NAME: string
  readonly VITE_APP_LS_STORAGE_REFRESH_TOKEN_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
