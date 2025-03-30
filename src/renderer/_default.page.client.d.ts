type PageContext = {
  Page: React.FC
  pageProps?: Record<string, unknown>
}
export { render }
declare function render(pageContext: PageContext): Promise<void>
