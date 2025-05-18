
// … restantes componentes

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import ArticlesStats from "./ArticlesStats";
import CoursesStats from "./CoursesStats";
import FilesStats from "./FilesStats";
import GlobalContentOverview from "./GlobalContentOverview";
import LivesStats from "./LivesStats";
import PlaylistsStats from "./PlaylistsStats";
import PodcastsStats from "./PodcastsStats";
import ReelsStats from "./ReelsStats";
import VideosStats from "./VideosStats";

export default function ContentStatsDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estatísticas dos Conteúdos</h1>

      <GlobalContentOverview />

      <Tabs defaultValue="reels">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="reels">Reels</TabsTrigger>
          <TabsTrigger value="articles">Artigos</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
          <TabsTrigger value="lives">Lives</TabsTrigger>
          <TabsTrigger value="files">Ficheiros</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>

        <TabsContent value="reels"><ReelsStats /></TabsContent>
        <TabsContent value="articles"><ArticlesStats /></TabsContent>
        <TabsContent value="courses"><CoursesStats /></TabsContent>
        <TabsContent value="podcasts"><PodcastsStats /></TabsContent>
        <TabsContent value="videos"><VideosStats /></TabsContent>
        <TabsContent value="lives"><LivesStats /></TabsContent>
        <TabsContent value="files"><FilesStats /></TabsContent>
        <TabsContent value="playlists"><PlaylistsStats /></TabsContent>
      </Tabs>
    </div>
  )
}
