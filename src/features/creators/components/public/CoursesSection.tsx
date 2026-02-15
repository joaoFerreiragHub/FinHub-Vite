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
      <h2 className="courses-title">Cursos e Formações</h2>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card" onClick={() => onCourseClick(course)}>
            <img src={course.bannerImage} alt={course.title} className="course-image" />
            <div className="course-details">
              <h3 className="course-name">{course.title}</h3>
              <div className="course-ratings">
                <RatingDisplay rating={userRatings[course.id] || 0} />
                {/* <p className="course-average">Média: {userRatings[course.id]?.toFixed(1)}/5</p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoursesSection
