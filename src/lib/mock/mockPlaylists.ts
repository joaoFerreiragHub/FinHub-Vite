import { Playlist } from "../types/playlist";

export const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Playlist de Mindset",
    topic: "Mentalidade",
    videos: [
      { id: "a", url: "https://www.youtube.com/watch?v=vM3DktHfhXM&ab_channel=JokeWRLD", order: 1 },
      { id: "b", url: "https://www.youtube.com/watch?v=hmJiI9fJfKE&ab_channel=SatoshiStackerPortugu%C3%AAs", order: 2 },
    ],
    isPublic: true,
    isMain: true,
  },
]
