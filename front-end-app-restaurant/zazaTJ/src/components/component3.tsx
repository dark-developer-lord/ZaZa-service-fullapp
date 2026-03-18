import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const Component3 = ({img,title,description}:any) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div>
      <div>
        <div className="mt-25 mb-30">
          {" "}
          <section className="flex flex-col md:flex-row items-center justify-between gap-20 p-8 max-w-6xl mx-auto">
            <div className="flex-1">
              <img
                src={img}
                alt="Captain"
                className="rounded-3xl w-full max-w-md h-auto shadow-lg"
              />
            </div>
            <div className="flex-1 text-left text-slate-900">
              <h2 className="text-4xl font-extrabold mb-4">{title}</h2>
              <p className="leading-relaxed mb-6 font-medium">{description}</p>
              <button onClick={() => {
                    navigate("/about") 
                    window.scrollTo({top:0,behavior:"smooth"})
                  }} className="bg-[#1EA780] cursor-pointer hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm">
                {t("section5.a7")}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Component3
