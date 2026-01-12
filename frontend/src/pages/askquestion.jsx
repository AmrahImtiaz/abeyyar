import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { motion } from "framer-motion"
import { Upload, X, Plus, HelpCircle, FileText, ImageIcon, Video } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

export default function AskQuestionPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState("")
  const [subject, setSubject] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag) => setTags(tags.filter((t) => t !== tag))
  const handleRemoveFile = (index) => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const validFiles = []

    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`)
        continue
      }
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        alert(`${file.name} is not a PNG or JPEG`)
        continue
      }
      validFiles.push(file)
    }
    setUploadedFiles((prev) => [...prev, ...validFiles])
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-blue-500" />
    if (file.type.startsWith("video/")) return <Video className="w-4 h-4 text-purple-500" />
    return <FileText className="w-4 h-4 text-gray-500" />
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return alert("Title and content are required")
    try {
      // FIXED: Changed "authToken" to "accessToken" to match your login system
      const token = localStorage.getItem("accessToken")
      
      if (!token) return alert("Please log in to post a question.")

      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("subject", subject)
      formData.append("difficulty", difficulty)
      formData.append("tags", tags.join(","))
      uploadedFiles.forEach((file) => formData.append("files", file))

      const res = await fetch("http://localhost:8000/api/questions", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      navigate("/browsequestions")
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cover bg-center bg-blue-200 py-12 " >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold mb-2 text-gray-800">Ask a Question</h1>
            <p className="text-gray-600 mb-10">Get help from the community by sharing your question clearly.</p>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-lg border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold">Question Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Title */}
                    <div>
                      <Label className="mb-1">Title</Label>
                      <Input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Enter your question title" 
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <Label className="mb-1">Question Content</Label>
                      <Textarea 
                        className="min-h-[200px] border-gray-300 focus:ring-2 focus:ring-blue-500" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="Provide detailed information about your question" 
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <Label className="mb-1">Media & Files (optional)</Label>
                      <input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                      <label 
                        htmlFor="file-upload" 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                      >
                        <Upload className="w-6 h-6 mb-2 text-gray-500" />
                        <span className="text-gray-500 text-sm">Click to upload files (PNG/JPEG, max 5MB)</span>
                      </label>
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file)} 
                              <span className="text-gray-700 truncate max-w-xs">{file.name}</span>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => handleRemoveFile(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <Label className="mb-1">Tags (optional)</Label>
                      <div className="flex gap-2 mb-2">
                        <Input 
                          placeholder="Enter tag" 
                          value={newTag} 
                          onChange={(e) => setNewTag(e.target.value)} 
                          onKeyDown={(e) => e.key === "Enter" && handleAddTag()} 
                        />
                        <Button variant="outline" onClick={handleAddTag}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <Badge key={tag} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800">
                            {tag} 
                            <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Subject & Difficulty */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                      disabled={!title || !content} 
                      onClick={handleSubmit}
                    >
                      Post Question
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Tips Card */}
              <Card className="shadow-lg border border-gray-200 bg-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <HelpCircle className="w-5 h-5 text-blue-600" /> Tips for Asking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                    </span>
                    <p className="text-gray-700 text-sm">Be specific about your problem – clearly state what you need help with.</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                    </span>
                    <p className="text-gray-700 text-sm">Show what you tried – share your approach so helpers understand your context.</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                    </span>
                    <p className="text-gray-700 text-sm">Add context or links – provide screenshots, references, or any extra info to help others assist you faster.</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}