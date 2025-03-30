type Theme = 'light' | 'dark'
interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
}
export declare const useThemeStore: import('zustand').UseBoundStore<
  Omit<import('zustand').StoreApi<ThemeStore>, 'persist'> & {
    persist: {
      setOptions: (
        options: Partial<import('zustand/middleware').PersistOptions<ThemeStore, ThemeStore>>,
      ) => void
      clearStorage: () => void
      rehydrate: () => Promise<void> | void
      hasHydrated: () => boolean
      onHydrate: (fn: (state: ThemeStore) => void) => () => void
      onFinishHydration: (fn: (state: ThemeStore) => void) => () => void
      getOptions: () => Partial<import('zustand/middleware').PersistOptions<ThemeStore, ThemeStore>>
    }
  }
>
export {}
