
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TrendingUp, DollarSign, Calculator, Users, Award, Bot } from "lucide-react"

export function FeaturesAccordion() {
  const features = [
    {
      id: "confidence",
      icon: TrendingUp,
      title: "Improved Academic Confidence",
      description:
        "Studies show that students who engage in peer-to-peer learning experience a significant boost in academic confidence.",
    },
    {
      id: "cost",
      icon: DollarSign,
      title: "Zero Cost, Zero Barrier",
      description:
        "All of our learning resources are completely free and open to all students, regardless of their financial background or location.",
    },
    {
      id: "solver",
      icon: Calculator,
      title: "Maths Solver",
      description:
        "Get instant solutions to complex mathematical problems with step-by-step explanations and visual representations.",
    },
    {
      id: "community",
      icon: Users,
      title: "Community Q&A Platform",
      description:
        "Join a vibrant community of learners where you can ask questions, share knowledge, and collaborate on challenging problems.",
    },
    {
      id: "reputation",
      icon: Award,
      title: "Reputation & Judging System",
      description:
        "Earn points and badges by helping others and contributing quality content to build your academic reputation.",
    },
    {
      id: "ai",
      icon: Bot,
      title: "AI Assistance",
      description:
        "Get instant answers to your questions from our advanced AI tutor that provides personalized learning experiences.",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features & Benefits</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
