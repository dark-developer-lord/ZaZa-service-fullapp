import { useTranslation } from "react-i18next"
import mudassir from "../assets/mudassir.png"
import abdulla from "../assets/abdulla.png"
import magnus from "../assets/magnus.png"
export default function LeadershipComponent() {
    const { t } = useTranslation("translation")

    const leaders = [
        {
            id: "member1",
            name: t("leadership.member1Name", "Mudassir Sheikha"),
            role: t("leadership.member1Role", "Co-founder and CEO"),
            image: mudassir // Replace with valid image path
        },
        {
            id: "member2",
            name: t("leadership.member2Name", "Abdulla Elyas"),
            role: t("leadership.member2Role", "Co-founder"),
            image: abdulla, // Replace with valid image path
        },
        {
            id: "member3",
            name: t("leadership.member3Name", "Magnus Olsson"),
            role: t("leadership.member3Role", "Co-founder and Chief Product Architect"),
            image: magnus, // Replace with valid image path
        }
    ]

    return (
        <div className="w-full bg-white py-16 px-4 sm:px-6 md:px-8 lg:px-12 font-sans overflow-hidden">
            <div className="max-w-[1280px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16 lg:mb-20">
                    <div className="lg:w-1/3 shrink-0">
                        <h2 className="text-[32px] md:text-[40px] font-bold text-[#1e293b] tracking-tight leading-tight">
                            {t("leadership.title", "ZAZA Leadership")}
                        </h2>
                    </div>
                    <div className="lg:w-2/3">
                        <p className="text-[16px] md:text-[18px] leading-[1.6] text-[#334155]">
                            {t(
                                "leadership.description",
                                "ZAZA was started by Mudassir Sheikha and Magnus Olsson, who wanted to solve the problem of the region's lack of reliable transportation. In 2013, Abdulla Elyas became ZAZA's third co-founder, and together, over a decade, they led the company into 14 countries, and hired over 12 thousand colleagues to bring ZAZA's purpose to life."
                            )}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {leaders.map((leader) => (
                        <div key={leader.id} className="flex flex-col group">
                            <div className="aspect-[5.4/5.09] w-full rounded-[24px] mb-6 overflow-hidden relative">
                                {/* Fallback background block. The actual images should be transparent PNGs to match the design. */}
                                <div className="absolute inset-0 flex items-end justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={leader.image}
                                        alt={leader.name}
                                        className="w-[100%] h-[100%] object-contain object-bottom opacity-0 transition-opacity duration-300"
                                        onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                    {/* If no image gracefully fails to this placeholder background */}
                                </div>
                            </div>
                            <h3 className="text-[24px] md:text-[26px] font-bold text-[#1e293b] mb-1.5 leading-tight">
                                {leader.name}
                            </h3>
                            <p className="text-[#475569] text-[16px] mb-5 leading-snug pr-4">
                                {leader.role}
                            </p>

                            <div className="mt-auto pt-2">
                                <a
                                    href="#"
                                    aria-label={`${leader.name} LinkedIn`}
                                    className="inline-flex text-black hover:text-[#00e676] transition-colors"
                                >
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8.46 17.5H6.18V9.58H8.46V17.5ZM7.32 8.49C6.59 8.49 6 7.9 6 7.16C6 6.43 6.59 5.84 7.32 5.84C8.04 5.84 8.63 6.43 8.63 7.16C8.63 7.9 8.04 8.49 7.32 8.49ZM17.82 17.5H15.54V13.65C15.54 12.73 15.52 11.55 14.26 11.55C12.98 11.55 12.78 12.55 12.78 13.59V17.5H10.5V9.58H12.69V10.66H12.72C13.02 10.09 13.76 9.4 15.01 9.4C17.47 9.4 17.82 11.02 17.82 13.12V17.5Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
