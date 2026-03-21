import CreatorProfilePage from '@/features/creators/pages/CreatorProfilePage'

export const passToClient = ['routeParams', 'pageProps', 'user']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Page(props: any) {
  const username =
    props.pageContext?.routeParams?.username ?? props.routeParams?.username ?? props.username

  return <CreatorProfilePage username={username} />
}
