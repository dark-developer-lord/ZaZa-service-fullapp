import { useTranslation } from "react-i18next"
import { Clock, Store, Tag } from "lucide-react"

export default function FoodFeatures() {
  const { t } = useTranslation()

  const features = [
    {
      id: 1,
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: t("food.features.f1Title", "Fast delivery"),
      description: t("food.features.f1Desc", "Reliable delivery speeds"),
    },
    {
      id: 2,
      icon: <Store className="w-8 h-8 text-green-600" />,
      title: t("food.features.f2Title", "Huge selection"),
      description: t("food.features.f2Desc", "9000+ restaurants"),
    },
    {
      id: 3,
      icon: <Tag className="w-8 h-8 text-green-600" />,
      title: t("food.features.f3Title", "Best deals"),
      description: t("food.features.f3Desc", "Daily discounts"),
    },
  ]

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-2">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-lg text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

