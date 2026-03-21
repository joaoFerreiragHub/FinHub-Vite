import React, { useEffect, useState } from 'react'
import { CourseWithRatings } from '@/features/creators/types/content'
import { RatingDisplay } from '@/features/hub/components/ratings/RatingDisplay'

interface CoursesSectionProps {
  courses: CourseWithRatings[]
  onCourseClick: (course: CourseWithRatings) => void
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onCourseClick }) => {
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchAverageRatings = async () => {
      if (!courses || courses.length === 0) return

      const ratings: Record<string, number> = {}

      await Promise.all(
        courses.map(async (course) => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}ratings/course/${course.id}/average-rating`,
            )
            const data = await response.json()
            ratings[course.id] = data.averageRating ?? 0
          } catch (error) {
            console.error(`Erro ao buscar rating do curso ${course.id}:`, error)
          }
        }),
      )

      setUserRatings(ratings)
    }

    fetchAverageRatings()
  }, [courses])

  return (
    <div className="courses-section">
      <h2 className="courses-title">Cursos e Formacoes</h2>
      <div className="courses-grid">
        {courses.map((course) => (
          <a
            key={course.id}
            href={`/hub/courses/${encodeURIComponent(course.id)}`}
            onClick={() => onCourseClick(course)}
            className="course-card block"
          >
            <img src={course.bannerImage} alt={course.title} className="course-image" />
            <div className="course-details">
              <h3 className="course-name">{course.title}</h3>
              <div className="course-ratings">
                <RatingDisplay rating={userRatings[course.id] || 0} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default CoursesSection
