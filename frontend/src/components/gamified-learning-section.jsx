
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Trophy, Target, Users, Zap, Star, Award, Gamepad2, Gift } from "lucide-react"

export function GamifiedLearningSection() {
  const features = [
    {
      icon: Trophy,
      title: "Leaderboards",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Award,
      title: "Badges",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Target,
      title: "Challenges",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Gift,
      title: "Rewards",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Users,
      title: "Teams",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Gamepad2,
      title: "Games",
      color: "bg-indigo-100 text-indigo-600",
    },
  ]

  const steps = [
    "Join learning sessions in your subject",
    "Get instant answers",
    "Use in any language",
    "Earn badges and climb leaderboards",
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Gamified Learning Experience with
              <span className="block text-indigo-600">Leaderboards & Badges</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              The platform transforms studying into a game-like experience to boost motivation and engagement. Users
              earn points for helping others, asking good questions, and completing challenges. A dynamic leaderboard
              ranks users based on their contributions, encouraging healthy competition.
            </p>

            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-gray-900">How It Works:</h3>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                    {index + 1}
                  </div>
                  <p className="text-gray-600">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <motion.div
                    key={index}
                    className={`${feature.color} rounded-xl p-4 text-center relative`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <IconComponent className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-semibold">{feature.title}</p>
                  </motion.div>
                )
              })}
            </div>

            {/* Floating elements for visual appeal */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Star className="w-4 h-4 text-white" />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Zap className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
