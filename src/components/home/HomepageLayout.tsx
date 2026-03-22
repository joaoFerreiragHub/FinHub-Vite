interface HomepageLayoutProps {
  children: React.ReactNode
}

/**
 * @deprecated P8.7 moved shell chrome (header/footer) to renderer/PageShell.tsx.
 * Keep this wrapper temporarily to avoid breaking legacy imports during migration.
 */
export function HomepageLayout({ children }: HomepageLayoutProps) {
  return <>{children}</>
}
