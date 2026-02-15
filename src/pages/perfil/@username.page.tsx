import { UserProfilePage } from '@/features/social/pages'

export function Page({ username }: { username: string }) {
  return <UserProfilePage username={username} />
}
