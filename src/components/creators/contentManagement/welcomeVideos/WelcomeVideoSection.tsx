// src/components/creators/welcomeVideos/WelcomeVideoSection.tsx

import WelcomeVideoCard from "./WelcomeVideoCard";
import WelcomeVideoPage from "./WelcomeVideoPage";

export default function WelcomeVideoSection() {
  return (
<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
  <WelcomeVideoCard />
  <WelcomeVideoPage />
</div>

  )
}
