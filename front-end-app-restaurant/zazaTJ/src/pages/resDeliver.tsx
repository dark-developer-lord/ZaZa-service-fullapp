import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import backgroundImageofSwiper from "../assets/Gemini_Generated_Image_kgpsp4kgpsp4kgps.png";
import { useTranslation } from "react-i18next";
import InputComponent from "@/components/inputComponent";
const ResDeliver = () => {
  const { t } = useTranslation();
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
              className="h-full flex items-center justify-center rounded-2xl shadow-xl text-white text-4xl font-bold bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImageofSwiper})` }}
            >
              <p className="md:text-7xl text-5xl px-20 text-gray-700 font-black text-center">{t("resDeliver.a1")}</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="mt-20">
        <p className="md:text-3xl text-2xl text-center font-bold">{ t("resDeliver.a2") }</p>
        <p className="md:text-3xl text-2xl text-center font-bold">{ t("resDeliver.a3") }</p>
        <p className="text-lg mt-10 text-center">{ t("resDeliver.a4") }</p>
      </div>
          <InputComponent />
    </div>
  );
};

export default ResDeliver;
