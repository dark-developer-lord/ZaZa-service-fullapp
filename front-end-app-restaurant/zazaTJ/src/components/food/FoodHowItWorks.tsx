import { useTranslation } from "react-i18next"
import { Search, CreditCard, ShoppingBag } from "lucide-react"

export default function FoodHowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      id: 1,
      icon: <Search className="w-6 h-6 text-slate-900" />,
      title: t("food.how.s1Title", "Choose your food"),
      description: t("food.how.s1Desc", "Find exactly what you're craving"),
    },
    {
      id: 2,
      icon: <CreditCard className="w-6 h-6 text-slate-900" />,
      title: t("food.how.s2Title", "Place an order"),
      description: t("food.how.s2Desc", "Pay online or with cash"),
    },
    {
      id: 3,
      icon: <ShoppingBag className="w-6 h-6 text-slate-900" />,
      title: t("food.how.s3Title", "Enjoy your meal"),
      description: t("food.how.s3Desc", "Food at your door in no time"),
    },
  ]

  return (
    <div className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16 tracking-tight">
          {t("food.how.title", "How it works")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-slate-100 z-0" />

          {steps.map((step) => (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-lg text-slate-600 max-w-[280px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

