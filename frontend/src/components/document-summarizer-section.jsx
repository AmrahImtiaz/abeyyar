
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function DocumentSummarizerSection() {
  const steps = [
    {
      number: "1",
      title: "User uploads a PDF or PPT file",
      description: "Simply drag and drop your document",
    },
    {
      number: "2",
      title: "The system service to extract text from the document",
      description: "Our AI analyzes the content and structure",
    },
    {
      number: "3",
      title: "The text is sent to an AI model for summarization",
      description: "Advanced processing extracts key information",
    },
    {
      number: "4",
      title: "The summary is returned to either a JSON or automatically based on user",
      description: "Get your summary in your preferred format",
    },
    {
      number: "5",
      title: "The user sees the output instantly in the browser - no downloads or delays",
      description: "Instant results displayed on screen",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10 flex items-center justify-center">
                <img
                  src="https://i.pinimg.com/736x/8a/83/b5/8a83b57890e35499b8724843f1c8eea2.jpg?height=300&width=300"
                  alt="Document Summarizer Illustration"
                  className="w-full max-w-sm"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Document Summarizer - To Help Cram
              <span className="block text-purple-600">for That Exam You Have Tomorrow</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Upload any PDF or PPT and get a custom AI-generated summary instantly. Whether it's lecture notes,
              textbooks, or study materials, we'll break down the complex into simple, digestible points.
            </p>

            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-gray-900">How It Works:</h3>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                    {step.number}
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm leading-relaxed">{step.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
