import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FeaturesAccordion } from "@/components/features-accordion"
import { AIAssistanceSection } from "@/components/ai-assistance-section"
import { DocumentSummarizerSection } from "@/components/document-summarizer-section"
import { GamifiedLearningSection } from "@/components/gamified-learning-section"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

const About = () => {
  const avatars = [
    "https://i.pinimg.com/736x/e8/af/25/e8af25bd13e80f7bfbac46b6ba58cf84.jpg",
    "https://i.pinimg.com/736x/0b/c7/1c/0bc71c0eac294c23433840fde51a4e90.jpg",
    "https://i.pinimg.com/736x/8e/a6/ae/8ea6aeb398960ae3ad87968d39f10779.jpg",
    "https://i.pinimg.com/736x/4d/92/d9/4d92d9661af1080fc42a2c935a1c49ca.jpg",
    "https://i.pinimg.com/736x/98/c5/d2/98c5d215750ca9e8182e68e30efb4e27.jpg",
  ]

  return (
    <>
    <Navbar />
      <main className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">

          {/* Avatars */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex -space-x-4">
              {avatars.map((avatar, index) => (
                <motion.img
                  key={index}
                  src={avatar}
                  alt={`User ${index + 1}`}
                  className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Everyday <span className="text-blue-600">Study</span>
            <br />
            Companion
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            LearnStack helps you grasp tough topics, connect with peers, and stay motivated — no matter what you're learning.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg">
              Get Started for Free
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Sections */}
      <FeaturesAccordion />
      <AIAssistanceSection />
      <DocumentSummarizerSection />
      <GamifiedLearningSection />
      <Footer></Footer>
    </>
  )
}

export default About
