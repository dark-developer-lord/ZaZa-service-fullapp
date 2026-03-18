import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const Component4 = ({ img, title, description }: any) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className="flex flex-col text-left group">
      <div className="overflow-hidden rounded-3xl mb-6">
        <img
          src={img}
          alt={title}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <h3 className="text-xl font-extrabold text-slate-900 mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>

      <button onClick={() => {
                    navigate("/about") 
                    window.scrollTo({top:0,behavior:"smooth"})
                  }} className="w-fit cursor-pointer bg-white border border-transparent shadow-sm hover:bg-slate-50 text-slate-900 font-bold py-2 px-6 rounded-xl transition-all text-sm">
        {t("section5.a7")}
      </button>
    </div>
  );
};

export default Component4;
