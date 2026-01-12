import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, MessageSquare, Share, Clock, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [userVote, setUserVote] = useState(null);

  // 1. FETCH QUESTION
  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/questions/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch");
        
        setQuestion(data.question || data);
        setUserVote(data.userVote || null); 
      } catch (err) {
        console.error(err);
        setError("Failed to load question");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuestion();
  }, [id]);

  // 2. VOTE ON QUESTION
  const handleVote = async (direction) => {
    try {
      // FIXED: Now using "accessToken" to match your AuthSuccess file
      const token = localStorage.getItem("accessToken"); 
      if (!token) {
        alert("Please log in to vote.");
        return;
      }

      const res = await fetch(`http://localhost:8000/api/questions/${id}/vote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: direction }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setQuestion((prev) => ({ ...prev, votes: data.votes }));
        setUserVote(data.userVote);
      } else {
        alert(data.message || "Vote failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // 3. VOTE ON ANSWER
  const handleAnswerVote = async (answerId, direction) => {
    try {
      // FIXED: Now using "accessToken"
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Please log in to vote.");

      const res = await fetch(`http://localhost:8000/api/questions/${id}/answers/${answerId}/vote`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ type: direction })
      });

      const data = await res.json();
      if (res.ok) {
          setQuestion(prev => ({
              ...prev,
              answers: prev.answers.map(ans => 
                  ans._id === answerId ? { ...ans, votes: data.votes } : ans
              )
          }));
      } else {
          alert(data.message);
      }
    } catch (err) {
        console.error(err);
    }
  };

  // 4. SUBMIT ANSWER
  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return alert("Answer cannot be empty");

    // FIXED: Now using "accessToken"
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("Please log in to post an answer.");

    try {
      const res = await fetch(`http://localhost:8000/api/questions/${id}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newAnswer }),
      });

      const data = await res.json();
      
      if (res.ok) {
        const savedAnswer = data.answer || data; 
        setQuestion((prev) => ({
          ...prev,
          answers: [...(prev.answers || []), savedAnswer],
          answersCount: (prev.answersCount || 0) + 1,
        }));
        setNewAnswer("");
      } else {
        alert(data.message || "Failed to submit answer");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // Helper functions
  const getDifficultyColor = (level) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  // 5. SORT ANSWERS (Highest votes first)
  const sortedAnswers = question?.answers 
      ? [...question.answers].sort((a, b) => (b.votes || 0) - (a.votes || 0)) 
      : [];

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !question) return <p className="text-center mt-10">Question not found</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Question Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">{question.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : "-"}</div>
                      <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {question.views} views</div>
                      <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {question.answers?.length || 0} answers</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                      <Badge variant="outline">{question.subject}</Badge>
                      {question.tags && question.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </div>

                  {/* Question Voting Buttons */}
                  <div className="flex flex-col items-center ml-4">
                    <Button variant="ghost" size="icon" onClick={() => handleVote("up")} className={userVote === "up" ? "text-green-600" : ""}><ArrowUp /></Button>
                    <span className="my-1 font-semibold">{question.votes}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleVote("down")} className={userVote === "down" ? "text-red-600" : ""}><ArrowDown /></Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="whitespace-pre-wrap mb-6">{question.content}</p>
                {/* User Info Footer */}
                <div className="flex items-center justify-end mt-6 pt-6 border-t">
                  <div className="flex items-center space-x-3 bg-muted/50 p-2 rounded-lg">
                    <div className="text-right text-xs text-muted-foreground mr-1">asked by</div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={question.author?.avatar} />
                      <AvatarFallback>{question.author?.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{question.author?.name || "Unknown"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Answers Section */}
          <Card className="mb-8">
            <CardHeader><CardTitle>{sortedAnswers.length} Answers</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {sortedAnswers.length > 0 ? sortedAnswers.map((a, i) => (
                <div key={i} className="border-b pb-4">
                  <div className="flex gap-4">
                    {/* Answer Voting Buttons */}
                    <div className="flex flex-col items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAnswerVote(a._id, "up")}>
                            <ArrowUp className="w-4 h-4"/>
                        </Button>
                        <span className="text-sm font-bold">{a.votes || 0}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAnswerVote(a._id, "down")}>
                            <ArrowDown className="w-4 h-4"/>
                        </Button>
                    </div>
                    
                    <div className="flex-1">
                      <p className="mb-2">{a.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={a.author?.avatar} />
                            <AvatarFallback>{a.author?.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <span>{a.author?.name || "Unknown"}</span>
                        <Clock className="w-3 h-3 ml-2"/>
                        <span>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : <p>No answers yet. Be the first to answer!</p>}
            </CardContent>
          </Card>

          {/* Add Answer */}
          <Card>
            <CardHeader><CardTitle>Your Answer</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="Write your answer here..." value={newAnswer} onChange={e => setNewAnswer(e.target.value)} className="mb-4"/>
              <Button onClick={handleSubmitAnswer}>Post Your Answer</Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
}