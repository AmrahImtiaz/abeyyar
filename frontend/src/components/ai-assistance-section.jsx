import { Button } from "./ui/button"
import { motion } from "framer-motion"

export function AIAssistanceSection() {
  const steps = [
    {
      number: "1",
      title: "Type a Question",
      description: "Ask anything related to your subject",
    },
    {
      number: "2",
      title: "Get Instant Answer",
      description: "Receive AI-powered explanations and solutions",
    },
    {
      number: "3",
      title: "Use in Any Language",
      description: "Ask questions and find answers in your preferred language",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your Personal Educational AI Assistance:
              <span className="block text-blue-600">
                Solve Problems Instantly
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Smart study companion that can understand and answer questions,
              summarize notes, and help you learn better.
            </p>

            <div className="space-y-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900">
                How It Works:
              </h3>

              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {step.title}
                    </h4>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button>Try It Now</Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-full translate-y-12 -translate-x-12" />

              <img src="https://i.pinimg.com/736x/96/5a/b2/965ab2793c2a5a3b68e6672694449cbf.jpg"
                alt="AI Assistant Illustration"
                className="w-full max-w-sm mx-auto relative z-10"/>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
