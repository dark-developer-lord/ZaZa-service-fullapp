import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import img1 from "../assets/wink_bf076b40b5.avif";
import { useNavigate } from 'react-router';
const Component6 = ({ style }: any) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="md:mb-0 mb-40">
      <div
        className={`w-full h-[500px] flex items-center justify-center ${style}`}
      >
        <div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl mt-0">
          <div
            className="relative bg-gradient-to-br from-emerald-300 to-green-500 
rounded-3xl 
p-6 sm:p-8 md:p-14 
shadow-2xl 
hover:scale-105 transition duration-500 
w-[340px] m-auto md:w-[550px] mt-[150px] md:mt-0"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 leading-tight">
              {t("section2.a1")}
            </h2>
            <ul className="mt-6 sm:mt-8 space-y-3 text-base sm:text-lg text-green-900 font-medium">
              <li
                onClick={() => {
                  navigate("/food");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex cursor-pointer gap-2 items-center"
              >
                <img src={img1} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("section2.a2")}
              </li>
              <li
                onClick={() => {
                  navigate("/food");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex cursor-pointer gap-2 items-center"
              >
                <img src={img1} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("section2.a3")}
              </li>
              <li
                onClick={() => {
                  navigate("/food");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex cursor-pointer gap-2 items-center"
              >
                <img src={img1} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("section2.a4")}
              </li>
              <li
                onClick={() => {
                  navigate("/food");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex cursor-pointer gap-2 items-center"
              >
                <img src={img1} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("section2.a5")}
              </li>
            </ul>
            <ArrowRight
              size={30}
              className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-green-900"
            />
          </div>

          <div
            className="relative 
bg-gradient-to-br from-violet-500 to-purple-700 
rounded-3xl 
p-6 sm:p-8 md:p-14 
shadow-2xl 
hover:scale-105 transition duration-500 
text-white 
w-[340px] m-auto md:w-[550px]"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              {t("section3.a1")}
            </h2>

            <ul className="cursor-pointer mt-6 sm:mt-8 space-y-3 text-base sm:text-lg opacity-90">
              <li
                onClick={() => {
                  navigate("/supermarkets");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex gap-2 items-center"
              >
                <img src={img1} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("section3.a2")}
              </li>
              <li className="flex gap-2 items-center">
                <img src={img1} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("section3.a3")}
              </li>
              <li
                onClick={() => {
                  navigate("/box");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex gap-2 items-center"
              >
                <img src={img1} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                Box
              </li>
              <li
                onClick={() => {
                  navigate("/pharmacy");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex gap-2 items-center"
              >
                <img src={img1} alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("section3.a5")}
              </li>
            </ul>

            <ArrowRight
              size={30}
              className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component6
