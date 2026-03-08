import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import router from './router'
import { AnalyticsProvider, ThemeProvider } from '@/shared/providers'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AnalyticsProvider />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
