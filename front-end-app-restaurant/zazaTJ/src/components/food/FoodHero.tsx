import { useTranslation } from "react-i18next"
import heroImg from "@/assets/image10.png"

export default function FoodHero() {
  const { t } = useTranslation()

  return (
    <div className="bg-[#f7f8f9] pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-8">
        <div className="flex-1 space-y-6 md:pr-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
            <span className="block">
              {t("food.hero.title", "ZAZA Food delivery")}
            </span>
            <span className="block text-green-600 mt-2">
              {t("food.hero.subtitle", "Always on time")}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
            {t(
              "food.hero.description",
              "Your favorite food is just a tap away on ZAZA. Choose from over 9,000 restaurants for breakfast, lunch, dinner and everything in between."
            )}
          </p>
          <div className="pt-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors min-w-[200px]">
              {t("food.hero.cta", "Order now")}
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative max-w-lg md:max-w-none">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10">
            <img
              src={heroImg}
              alt="Food Delivery"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-100 rounded-full blur-3xl opacity-50 -z-10" />
        </div>
      </div>
    </div>
  )
}

