import { useTranslation } from "react-i18next"
import imageOfGooglePlay from "@/assets/google-play.webp"
import apk from "@/assets/apk-download.webp"

export default function FoodDownload() {
  const { t } = useTranslation()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {t("food.download.title", "Download ZAZA now")}
          </h2>
          <p className="text-lg text-slate-600 max-w-lg">
            {t(
              "food.download.subtitle",
              "Get the ZAZA app on your phone to order food, groceries, rides and more in just a few taps."
            )}
          </p>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row md:justify-end gap-4">
          <img
            src={imageOfGooglePlay}
            alt="Google Play"
            className="w-40 cursor-pointer hover:scale-105 transition-transform"
          />
          <img
            src={apk}
            alt="Download APK"
            className="w-40 cursor-pointer hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </section>
  )
}

