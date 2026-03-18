import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Home, ShieldCheck } from "lucide-react"

export default function FeatureCards() {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className=" flex flex-col items-center justify-center p-2 gap-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">

        {/* Reliability */}
        <Card
          className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer"
          style={{
            transform: hovered === 0 ? "translateY(-6px)" : "translateY(0)",
            boxShadow:
              hovered === 0
                ? "0 12px 32px rgba(0,0,0,0.10)"
                : "0 2px 8px rgba(0,0,0,0.04)",
          }}
          onMouseEnter={() => setHovered(0)}
          onMouseLeave={() => setHovered(null)}
        >
          <CardContent className="flex flex-col items-center text-center pt-10 pb-10 px-8 gap-5">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1d6b50] to-[#0f4434]">
              <Clock size={32} strokeWidth={1.5} className="text-emerald-400" />
            </div>
            <h3 className="font-bold text-lg">
              {t("featureCards.reliability.a1")}
            </h3>
            <p className="text-gray-500 text-sm">
              {t("featureCards.reliability.a2")}
            </p>
          </CardContent>
        </Card>

        {/* Quality */}
        <Card
          className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer"
          style={{
            transform: hovered === 1 ? "translateY(-6px)" : "translateY(0)",
            boxShadow:
              hovered === 1
                ? "0 12px 32px rgba(0,0,0,0.10)"
                : "0 2px 8px rgba(0,0,0,0.04)",
          }}
          onMouseEnter={() => setHovered(1)}
          onMouseLeave={() => setHovered(null)}
        >
          <CardContent className="flex flex-col items-center text-center pt-10 pb-10 px-8 gap-5">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1d6b50] to-[#0f4434]">
              <Home size={32} strokeWidth={1.5} className="text-emerald-400" />
            </div>
            <h3 className="font-bold text-lg">
              {t("featureCards.quality.a1")}
            </h3>
            <p className="text-gray-500 text-sm">
              {t("featureCards.quality.a2")}
            </p>
          </CardContent>
        </Card>

        {/* Safety */}
        <Card
          className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer"
          style={{
            transform: hovered === 2 ? "translateY(-6px)" : "translateY(0)",
            boxShadow:
              hovered === 2
                ? "0 12px 32px rgba(0,0,0,0.10)"
                : "0 2px 8px rgba(0,0,0,0.04)",
          }}
          onMouseEnter={() => setHovered(2)}
          onMouseLeave={() => setHovered(null)}
        >
          <CardContent className="flex flex-col items-center text-center pt-10 pb-10 px-8 gap-5">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1d6b50] to-[#0f4434]">
              <ShieldCheck size={32} strokeWidth={1.5} className="text-emerald-400" />
            </div>
            <h3 className="font-bold text-lg">
              {t("featureCards.safety.a1")}
            </h3>
            <p className="text-gray-500 text-sm">
              {t("featureCards.safety.a2")}
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}