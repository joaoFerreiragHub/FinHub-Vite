import React from 'react'
import AnnouncementsSection from './AnnouncementsSection'
import PlaylistsSection from './PlaylistsSection'
import CoursesSection from './CoursesSection'
import ArticlesSection from './ArticlesSection'
import DocumentsSection from './DocumentsSection'
import EventsSection from './EventsSection'
import MainPlaylistSection from './MainPlaylistSection'
import { CreatorFull } from '../../../types/creator'
import { Article, CourseWithRatings, resolveArticles, resolvePlaylists } from '@/features/hub/utils/content.legacy'


type Props = {
  creatorData: CreatorFull
  contentVisibility: CreatorFull['contentVisibility']
  handleCourseClick: (course: CourseWithRatings) => void
  handleArticleClick: (article: Article) => void
  handleEventClick: (event: NonNullable<CreatorFull['eventsResolved']>[number]) => void
  getEmbedUrl: (url: string) => string
  coursesWithRatings: CourseWithRatings[]
  articlesWithRatings: Article[]
}

const ContentSections: React.FC<Props> = ({
  creatorData,
  contentVisibility,
  handleCourseClick,
  handleArticleClick,
  handleEventClick,
  getEmbedUrl,
  articlesWithRatings,
}) => {
  return (
    <>
      {contentVisibility?.playlists?.regular && creatorData.mainPlaylist && (
        <MainPlaylistSection
          playlists={[creatorData.mainPlaylist]}
          getEmbedUrl={getEmbedUrl}
        />
      )}

      {contentVisibility?.announcements && (
        <AnnouncementsSection announcements={creatorData.announcementsResolved ?? []} />
      )}

      {contentVisibility?.playlists && (
            <PlaylistsSection
              contentVisibility={contentVisibility}
              playlists={resolvePlaylists(creatorData.fullPlaylists ?? [], creatorData)}
              getEmbedUrl={getEmbedUrl}
              creatorData={creatorData}
            />

      )}

      {contentVisibility?.courses && (
          <CoursesSection
            courses={creatorData.coursesResolved?.filter((course) => course) ?? []}
            onCourseClick={handleCourseClick}
          />
      )}

      {contentVisibility?.articles && (
      <ArticlesSection
        onArticleClick={handleArticleClick}
        articles={creatorData.articlesResolved ?? []}
        articlesWithRatings={resolveArticles(articlesWithRatings)}
      />
      )}

      {contentVisibility?.files && (
        <DocumentsSection files={creatorData.documentsResolved ?? []} />
      )}

      {contentVisibility?.events && (
        <EventsSection
          events={creatorData.eventsResolved ?? []}
          onEventClick={handleEventClick}
        />
      )}
    </>
  )
}

export default ContentSections
