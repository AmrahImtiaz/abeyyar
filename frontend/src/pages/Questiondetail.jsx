import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, MessageSquare, Share, Clock, Eye, User as UserIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getData } from "@/context/userContext";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = getData(); 

  // FETCH DATA
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/questions/${id}`);
        const data = await res.json();
        if (res.ok) {
          setQuestion(data.question || data);
        } else {
          console.error("Question not found");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  // VOTE ON QUESTION
  const handleVote = async (direction) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Please login to vote");

      // Frontend Check: Self Voting
      if (user && question.author && (user._id === question.author._id || user._id === question.author)) {
        return alert("You cannot vote on your own question.");
      }

      const res = await fetch(`http://localhost:8000/api/questions/${id}/vote`, {
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
            votes: data.votes,
            upvotes: data.upvotes,
            downvotes: data.downvotes
        }));
      } else {
        alert(data.message || "Vote failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // VOTE ON ANSWER
  const handleAnswerVote = async (answerId, answerAuthorId, direction) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Please login to vote");

      // Frontend Check: Self Voting
      if (user && answerAuthorId && user._id === answerAuthorId) {
         return alert("You cannot vote on your own answer.");
      }

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
              answers: prev.answers.map(ans => {
                 if (ans._id === answerId) {
                   return { ...ans, votes: data.votes };
                 }
                 return ans;
              })
          }));
      } else {
          alert(data.message || "Vote failed");
      }
    } catch (err) {
        console.error(err);
    }
  };

  // SUBMIT ANSWER
  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return alert("Answer cannot be empty");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return alert("Please login to answer");

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
        }));
        setNewAnswer("");
      } else {
        alert(data.message || "Failed to post answer");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const sortedAnswers = question?.answers 
      ? [...question.answers].sort((a, b) => (b.votes || 0) - (a.votes || 0)) 
      : [];

  if (loading) return <div className="text-center mt-20">Loading question...</div>;
  if (!question) return <div className="text-center mt-20">Question not found.</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
          {/* QUESTION SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{question.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Asked {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : "-"}</div>
                      <div className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {question.views} views</div>
                      <div className="flex items-center"><MessageSquare className="w-4 h-4 mr-1" /> {question.answers?.length || 0} answers</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.difficulty && <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>}
                      {question.subject && <Badge variant="outline">{question.subject}</Badge>}
                      {question.tags && question.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </div>
                  
                  {/* QUESTION VOTE BUTTONS */}
                  <div className="flex flex-col items-center ml-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleVote("up")}
                        className={question.upvotes?.includes(user?._id) ? "text-green-600 bg-green-100" : ""}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </Button>
                    
                    <span className="font-semibold text-lg my-1">{question.votes || 0}</span>
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleVote("down")}
                        className={question.downvotes?.includes(user?._id) ? "text-red-600 bg-red-100" : ""}
                    >
                        <ArrowDown className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap mb-6">{question.content}</p>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm"><Share className="w-4 h-4 mr-2" /> Share</Button>
                  </div>
                  
                  {/* QUESTION AUTHOR PROFILE */}
                  <div className="flex items-center space-x-3 bg-muted/50 p-2 rounded-lg">
                    <div className="text-right text-xs text-muted-foreground mr-1">asked by</div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={question.author?.avatar} />
                      <AvatarFallback>{question.author?.name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      {/* Uses Virtual 'name' (username) from Backend */}
                      <div className="font-medium text-sm">{question.author?.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{question.author?.reputation || 0} reputation</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ANSWERS LIST SECTION */}
          <h2 className="text-xl font-bold mb-4">{sortedAnswers.length} Answers</h2>
            
          <div className="space-y-6 mb-10">
            {sortedAnswers.map((ans) => (
                <motion.div key={ans._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                {/* ANSWER VOTE BUTTONS */}
                                <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-8 w-8 hover:bg-green-100 ${ans.upvotes?.includes(user?._id) ? "text-green-600" : ""}`}
                                        onClick={() => handleAnswerVote(ans._id, ans.author?._id || ans.author, "up")}
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </Button>
                                    
                                    <span className="font-bold text-gray-700">{ans.votes || 0}</span>
                                    
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-8 w-8 hover:bg-red-100 ${ans.downvotes?.includes(user?._id) ? "text-red-600" : ""}`}
                                        onClick={() => handleAnswerVote(ans._id, ans.author?._id || ans.author, "down")}
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex-1">
                                    <p className="whitespace-pre-wrap mb-4 text-gray-800 dark:text-gray-200">{ans.content}</p>
                                      
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Answered {ans.createdAt ? new Date(ans.createdAt).toLocaleDateString() : "-"}
                                        </span>
                                        
                                        {/* ANSWER AUTHOR PROFILE */}
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarImage src={ans.author?.avatar} />
                                                <AvatarFallback>{ans.author?.name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{ans.author?.name || "User"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle>Your Answer</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="Write your solution here..." className="min-h-[150px] mb-4" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
              <Button onClick={handleSubmitAnswer} disabled={submitting}>
                {submitting ? "Posting..." : "Post Answer"}
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
}