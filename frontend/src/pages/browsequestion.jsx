import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Footer from "../components/Footer"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Search, ArrowUp, ArrowDown, MessageSquare, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function BrowseQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:8000/api/questions")
        const json = await res.json()
        const data = json.data || json
        setQuestions(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to load questions", err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800"
      case "Intermediate": return "bg-yellow-100 text-yellow-800"
      case "Advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = filterBy === "all" || q.subject.toLowerCase() === filterBy.toLowerCase()
    return matchesSearch && matchesFilter
  })
  
const sortedQuestions = [...filteredQuestions].sort((a, b) => {
  switch (sortBy) {
    case "newest":
      return new Date(b.createdAt) - new Date(a.createdAt);

    case "oldest":
      return new Date(a.createdAt) - new Date(b.createdAt);

    case "most-votes":
      return (b.votes || 0) - (a.votes || 0);

    case "most-answers":
      return (b.answersCount || b.answers || 0) - (a.answersCount || a.answers || 0);

    case "most-views":
      return (b.views || 0) - (a.views || 0);

    default:
      return 0;
  }
});


  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black ">Browse Questions</h1>
              <p className="text-gray-500">Explore questions from our learning community</p>
            </div>
            <Link to="/askquestion">
              <Button className="mt-4 md:mt-0">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </Link>
          </div>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 border-black" />
              <Input
                placeholder="Search questions, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-black bg-blue-100"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 border-2 border-black">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most-votes">Most Votes</SelectItem>
                <SelectItem value="most-answers">Most Answers</SelectItem>
                <SelectItem value="most-views">Most Views</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48 border-black">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent className="border-black">
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="computer science">Computer Science</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Questions List */}
        <div className="space-y-4">
          {sortedQuestions.map((question, index) => {
            const id = question._id || question.id
            const author = question.author || { name: question.author?.username || "Unknown", avatar: "/placeholder.svg", reputation: 0 }
            const created = new Date(question.createdAt)
            const answers = question.answersCount || question.answers || 0
            return (
              <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <Card className="hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Votes */}
                      <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowUp className="w-4 h-4" /></Button>
                        <span className="font-semibold text-lg">{question.votes || 0}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowDown className="w-4 h-4" /></Button>
                        <div className="text-xs text-gray-400 text-center">votes</div>
                      </div>

                      {/* Answers & Views */}
                      <div className="flex flex-col items-center space-y-2 min-w-[60px]">
                        <div className="text-lg font-semibold">{answers}</div>
                        <div className="text-xs text-gray-400 text-center">answers</div>
                        <div className="text-sm text-gray-400">{question.views || 0}</div>
                        <div className="text-xs text-gray-400 text-center">views</div>
                      </div>

                      {/* Question Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <Link to={`/questions/${id}`}>
                            <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer">{question.title}</h3>
                          </Link>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                            <Badge variant="outline">{question.subject}</Badge>
                          </div>
                        </div>

                        <p className="text-gray-500 mb-3 line-clamp-2">{question.content}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {(question.tags || []).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                              <AvatarFallback>{(author.name || "").split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <span className="font-medium">{author.name || author.username || "Unknown"}</span>
                              <span className="text-gray-400 ml-1">({author.reputation || 0} rep)</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {isNaN(created) ? "" : created.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* No questions found */}
        {filteredQuestions.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-gray-400 mb-4">No questions found matching your criteria.</div>
            <Link to="/askquestion">
              <Button>Ask the First Question</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
    <Footer />
    </>)
}
