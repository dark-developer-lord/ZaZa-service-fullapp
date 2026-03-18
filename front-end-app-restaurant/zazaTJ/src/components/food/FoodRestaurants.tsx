import { useTranslation } from "react-i18next"
import imgRest1 from "@/assets/image9.png"
import imgRest2 from "@/assets/image10.png"
import imgRest3 from "@/assets/image11.png"

export default function FoodRestaurants() {
  const { t } = useTranslation()

  const restaurants = [
    { id: 1, name: t("food.restaurants.r1", "Pizza Express"), category: "Italian", img: imgRest1 },
    { id: 2, name: t("food.restaurants.r2", "KFC"), category: "Fast Food", img: imgRest2 },
    { id: 3, name: t("food.restaurants.r3", "McDonald's"), category: "Burgers", img: imgRest3 },
    { id: 4, name: t("food.restaurants.r4", "Subway"), category: "Healthy", img: imgRest1 },
  ]

  return (
    <div className="py-24 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              {t("food.restaurants.title", "Our top restaurants")}
            </h2>
            <p className="text-xl text-slate-600">
              {t("food.restaurants.subtitle", "Order from top-rated spots near you")}
            </p>
          </div>
          <button className="text-green-600 font-bold hover:text-green-700 transition-colors inline-flex items-center gap-2 group whitespace-nowrap">
            {t("food.restaurants.cta", "Explore all restaurants")}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {restaurants.map((rest) => (
            <div key={rest.id} className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={rest.img}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://via.placeholder.com/400x300?text=Food"
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{rest.name}</h3>
              <p className="text-slate-500">{rest.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

