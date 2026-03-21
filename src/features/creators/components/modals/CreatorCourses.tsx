// src/features/creators/components/modals/CreatorCourses.tsx

import { BookOpen } from 'lucide-react'

interface CreatorCoursesProps {
  courses?: {
    coursesId: string
    courseName: string
    bannerImage: string
    purchaseLink: string
    timestamp: string
  }[]
}

export function CreatorCourses({ courses }: CreatorCoursesProps) {
  if (!courses || courses.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <a
          key={course.coursesId}
          href={course.purchaseLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:border-border hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            {course.bannerImage ? (
              <img
                src={course.bannerImage}
                alt={course.courseName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BookOpen size={32} className="text-muted-foreground/40" />
              </div>
            )}
          </div>
          <div className="p-3">
            <h5 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {course.courseName}
            </h5>
            {course.timestamp ? (
              <p className="mt-1 text-xs text-muted-foreground">{course.timestamp}</p>
            ) : null}
          </div>
        </a>
      ))}
    </div>
  )
}
