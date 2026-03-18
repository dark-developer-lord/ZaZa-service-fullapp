import { Link } from 'react-router';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import backgroundImageofSwiper from "../assets/Gemini_Generated_Image_p43jlqp43jlqp43j.png";
import wink from "@/assets/wink_bf076b40b5 (1).avif";
import { useTranslation } from 'react-i18next';
import BgBlue from '@/components/bgBlue';
import imgpharm from "@/assets/pharmimg.avif"
import imgaaa from "@/assets/aaaaa.avif"
import Component6 from '@/components/component6';
import Component1 from '@/components/component1';
const Pharmacy = () => {
    const { t } = useTranslation()
  return (
    <div>
      <div className="w-[90%] h-[80vh] m-auto">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay]}
          className="h-full rounded-2xl"
        >
          <SwiperSlide className="rounded-2xl">
            <div
              className="h-full flex flex-col justify-center items-start rounded-2xl shadow-xl text-white font-bold bg-cover bg-center px-6 md:px-10"
              style={{ backgroundImage: `url(${backgroundImageofSwiper})` }}
            >
              <p className="md:text-3xl text-xl text-white font-black text-left w-full">
                {t("Pharmacy.a3")}
              </p>
              <p className="md:text-6xl text-3xl text-green-400 font-black text-left w-full">
                {t("Pharmacy.a4")}
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div>
        <p className="text-5xl text-green-800 font-bold text-center mt-20 mb-20">
          {t("servicesOpen.a2")}
        </p>
      </div>
      <div>
        <div className="flex flex-wrap gap-5 justify-center">
          <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={"/supermarkets"}>
            <div className="flex gap-1 rounded-[8px] cursor-pointer w-50 h-11 bg-gray-300 text-center items-center pl-4">
              <img className="w-7 h-7" src={wink} alt="" />
              <p className="text-xl font-bold text-green-900">{t("section3.a2")}</p>
            </div>
          </Link>
          <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={"/box"}>
            <div className="flex gap-1 rounded-[8px] cursor-pointer w-25 h-11 bg-gray-300 text-center items-center pl-4">
              <img className="w-7 h-7" src={wink} alt="" />
              <p className="text-xl font-bold text-green-900">Box</p>
            </div>
          </Link>
          <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={"/pharmacy"}>
            <div className="flex gap-1 rounded-[8px] cursor-pointer w-40 h-11 bg-green-400 text-center items-center pl-4">
              <img className="w-7 h-7" src={wink} alt="" />
              <p className="text-xl font-bold text-green-900">{t("section3.a5")}</p>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3 mt-20 justify-center md:ml-40">
          <img className="w-13 h-13" src={wink} alt="" />
          <div>
            <p className="text-[40px] font-bold text-green-900">
              {t("Pharmacy.a1")}
            </p>
            <p>{t("Pharmacy.a2")}</p>
          </div>
        </div>
      </div>
      <BgBlue img={imgpharm} title={t("Pharmacy.a5")} description={t("Pharmacy.a6")} />
      <Component1 img={imgaaa} title={t("Pharmacy.a7")} description={t("Pharmacy.a8")} />
      <Component6 style="mt-20"/>
    </div>
  );
}

export default Pharmacy
