import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import i18n from "../i18n";
const Sigin = () => {
  const navigate = useNavigate();

  const { t } = useTranslation()

  function TranslateClick(lang: string) {
    i18n.changeLanguage(lang);
  }

  const savedPhone = localStorage.getItem("userPhone") || "";

  const [phone, setPhone] = useState(savedPhone);
  const [showModal, setShowModal] = useState(false);

  const handleLogin = () => {
    if (phone.length < 9) {
      alert("Лутфан рақами пурра ворид кунед");
      return;
    }
    localStorage.setItem("userPhone", phone);
    setShowModal(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 mt-[-100px]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-100 relative">
          <div className="relative ml-[500px] mt-[-20px]">
          <Select onValueChange={TranslateClick}>
            <SelectTrigger className="w-[100px] border border-gray-300 rounded-md px-3 flex items-center justify-between font-semibold hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition">
              <SelectValue placeholder={i18n.language.toUpperCase()} />
            </SelectTrigger>

            <SelectContent className="w-[100px] bg-white border border-gray-300 rounded-md shadow-lg p-1">
              <SelectItem
                value="tj"
                className="flex items-center gap-2 mb-1 px-2 py-1 rounded-md hover:bg-green-100 cursor-pointer transition"
                >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/1280px-Flag_of_Tajikistan.svg.png"
                  alt="Tajik"
                  className="w-[25px] h-[20px] rounded-sm"
                  />
                TJ
              </SelectItem>

              <SelectItem
                value="ru"
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-green-100 cursor-pointer transition"
                >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg"
                  alt="Russian"
                  className="w-[25px] h-[20px] rounded-sm"
                  />
                RU
              </SelectItem>
            </SelectContent>
          </Select>
           </div>
        <div className="">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
            {t("signin.a1")}
          </h2>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="flex items-center bg-gray-100 px-3 rounded-lg min-w-[90px]">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/1280px-Flag_of_Tajikistan.svg.png"
              alt="Tajikistan"
              className="w-6 h-4 rounded-sm"
            />
            <span className="ml-2 text-gray-700 font-medium">+992</span>
            <ChevronDown size={16} className="ml-auto text-gray-400" />
          </div>

          <input
            type="tel"
            placeholder="50 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 bg-gray-100 px-4 py-3 rounded-lg text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition mb-4"
        >
          {t("signin.a2")}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500 uppercase tracking-wider text-xs">
              {t("signin.a5")}
            </span>
          </div>
        </div>

        <button
          onClick={() => {}}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition mb-6 shadow-sm"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {t("signin.a4")}
        </button>

        <p className="text-xs text-gray-400 text-center">{t("signin.a3")}</p>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-md p-6 text-center relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-green-700 mb-4">
              {t("signin.a6")} 🎉
            </h3>
            <p className="text-gray-600 mb-6">{t("signin.a7")}</p>
            <button
              onClick={() => {
                navigate("/");
                window.location.reload();
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {t("signin.a8")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sigin;
