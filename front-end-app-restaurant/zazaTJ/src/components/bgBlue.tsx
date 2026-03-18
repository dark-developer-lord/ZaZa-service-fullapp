import "../App.css"
import { useTranslation } from "react-i18next"
const BgBlue = ({ title, description, img }: any) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="jagged-gradient-bg2 mt-20 mb-30">
        {" "}
        <section className="flex flex-col md:flex-row items-center justify-between gap-20 p-8 max-w-6xl mx-auto">
          <div className="flex-1">
            <img
              src={img}
              alt="Captain"
              className="rounded-3xl w-full max-w-md h-auto shadow-lg"
            />
          </div>
          <div className="flex-1 text-left text-white">
            <h2 className="text-4xl font-extrabold mb-4">{title}</h2>
            <p className="leading-relaxed mb-6 font-medium">{description}</p>
            <button className="bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-8 rounded-xl transition-all shadow-sm">
              {t("supermarkets.a8")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BgBlue
