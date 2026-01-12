import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"

export default function Logo({ size = "md", showText = true }) {
  const iconSize = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }[size]

  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size]

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-lg">
        <BookOpen className={`${iconSize} text-white`} />
      </div>

      {showText && (
        <span
          className={`${textSize} font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text`}
        >
          LearnStack
        </span>
      )}
    </Link>
  )
}
