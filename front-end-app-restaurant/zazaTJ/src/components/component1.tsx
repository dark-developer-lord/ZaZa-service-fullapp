import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const Component1 = ({ img, title, description }: any) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div>
      <section className="flex flex-col md:flex-row items-center justify-between gap-35 p-8 max-w-6xl mx-auto mt-10">
        <div className="flex-1 text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-slate-600 leading-relaxed mb-6">{description}</p>
          <button onClick={() => {
                    navigate("/about") 
                    window.scrollTo({top:0,behavior:"smooth"})
                  }} className="bg-[#1EA780] hover:bg-[#00c853] text-white font-semibold py-3 px-8 rounded-lg transition-all cursor-pointer">
            {t("section5.a7")}
          </button>
        </div>

        <div className="flex-1">
          <img
            src={img}
            alt="Office environment"
            className="rounded-3xl w-100 h-80 shadow-lg"
          />
        </div>
      </section>
    </div>
  );
}

export default Component1
