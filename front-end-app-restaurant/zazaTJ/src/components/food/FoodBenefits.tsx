import { useTranslation } from "react-i18next"
import { Crown, Timer, Headset } from "lucide-react"

export default function FoodBenefits() {
  const { t } = useTranslation()

  const benefits = [
    {
      id: 1,
      icon: <Crown className="w-7 h-7 text-green-600" />,
      title: t("food.benefits.b1Title", "ZAZA Plus"),
      description: t(
        "food.benefits.b1Desc",
        "Enjoy free delivery and exclusive perks every day."
      ),
    },
    {
      id: 2,
      icon: <Timer className="w-7 h-7 text-green-600" />,
      title: t("food.benefits.b2Title", "On‑time orders"),
      description: t(
        "food.benefits.b2Desc",
        "Accurate delivery time estimates so you always know when your food arrives."
      ),
    },
    {
      id: 3,
      icon: <Headset className="w-7 h-7 text-green-600" />,
      title: t("food.benefits.b3Title", "24/7 support"),
      description: t(
        "food.benefits.b3Desc",
        "Our team is here around the clock to help with anything you need."
      ),
    },
  ]

  return (
    <section className="py-24 bg-[#f7f8f9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            {t("food.benefits.title", "Why people love ZAZA Food")}
          </h2>
          <p className="text-lg text-slate-600">
            {t(
              "food.benefits.subtitle",
              "Membership perks, reliable delivery, and support that’s always there for you."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {benefit.title}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}