// src/features/creators/components/modals/CreatorCourses.tsx

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
    <div>
      <h4 className="font-semibold text-base mb-2">Cursos</h4>

      <div className="flex gap-4 overflow-x-auto">
        {courses.map((course) => (
          <a
            key={course.coursesId}
            href={course.purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-32 sm:w-36 md:w-40 shrink-0"
          >
            <div className="aspect-w-3 aspect-h-2 bg-muted rounded-lg overflow-hidden mb-1">
              <img
                src={course.bannerImage || '/placeholder-course.jpg'}
                alt={`Imagem de ${course.courseName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs text-center line-clamp-2 font-medium">{course.courseName}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
