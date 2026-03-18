import { useTranslation } from "react-i18next"

export default function FoodCTA() {
  const { t } = useTranslation()

  return (
    <section className="py-20 bg-gradient-to-r from-[#004a32] to-[#007a52] text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("food.cta.title", "Ready to order?")}
          </h2>
          <p className="text-base md:text-lg text-emerald-100 max-w-xl">
            {t(
              "food.cta.subtitle",
              "Open ZAZA, pick your favourite restaurant, and we’ll handle the rest."
            )}
          </p>
        </div>
        <div className="flex-1 flex md:justify-end">
          <button className="bg-white text-[#004a32] font-semibold text-lg px-8 py-3 rounded-xl shadow-md hover:bg-emerald-50 transition-colors">
            {t("food.cta.button", "Download the app")}
          </button>
        </div>
      </div>
    </section>
  )
}

