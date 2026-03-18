import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import backgroundImageofSwiper from "../assets/Screenshot 2026-02-24 144320.png";
import { useTranslation } from "react-i18next";
import ZAZAExpress from "../assets/Screenshot 2026-02-24 151044.png";
import imgOfClock from "@/assets/Clock2_74216bc5e0_e0a4c8a495.avif";
import imgOfBike from "@/assets/Clock_4_aaef35b69e_9b8908d2ec.avif";
import imgOfSave from "@/assets/Icon4_a4a5590dc1_0519157bab.avif";
import imgOfCity from "@/assets/icon_5_64c0c39076_6e8b706b24.avif";
import imgOfHouse from "@/assets/Icon_8_9b59c8e303_d495d788e1.avif";
import imgOfMicrofon from "@/assets/Icon_6_b12bdf4d2c_9c7a2d133d.avif";
import imgOfPartnors from "@/assets/Screenshot 2026-02-24 160316.png";
import Component1 from "@/components/component1";
import imgoforderdetail from "@/assets/cfb2_54850ae4bc_7756942f8a_0d8f356867.avif";
import Component2 from "@/components/component2";
import imgDeliver from "@/assets/cfb3_d8880cfcde_e94682e42c_f03a197d49.avif";
import imgofTruck from "@/assets/cfb4_db6a844372_6e35d5a122_bb4c344edc.avif";
import Deliverform from "@/components/deliverform";
import Component6 from "@/components/component6";
const DineOut = () => {
  const { t } = useTranslation();
  return (
    <section>
      <section className="w-[90%] h-[80vh] m-auto relative rounded-2xl overflow-hidden">
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
          <SwiperSlide className="rounded-2xl overflow-hidden">
            <section className="relative h-full flex flex-col justify-center items-start px-12 md:px-24 gap-4 rounded-2xl shadow-xl text-[#0a3d2e] bg-gradient-to-br from-[#10e67e] via-[#48f2b3] to-[#b3f8ff]">
              <section className="z-10 max-w-lg">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {t("dineout.a1")}
                  <span className="block text-5xl md:text-8xl font-black italic mt-[-10px]">
                    {t("dineout.a2")}
                  </span>
                </h1>

                <button className="mt-8 px-8 py-3 bg-[#00e676] hover:bg-[#00c853] text-[#0a3d2e] font-bold rounded-xl shadow-md transition-all">
                  {t("dineout.a3")}
                </button>
              </section>
              <section className="absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-end">
                <img
                  src={backgroundImageofSwiper}
                  alt="Delivery"
                  className="h-[100%] w-auto hidden md:block"
                />
              </section>
            </section>
          </SwiperSlide>
        </Swiper>
      </section>
      <section className="text-center ">
        <img className="w-100 h-40 md:ml-[550px]" src={ZAZAExpress} alt="" />
        <p>{t("dineout.a4")}</p>
      </section>
      <section className="flex flex-wrap justify-center mt-10 gap-10 p-6">
        <div className="bg-gray-100 shadow-md rounded-2xl w-[380px] h-[280px] p-6 flex flex-col items-center text-center">
          <img
            src={imgOfClock}
            alt="Super fast delivery"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold mb-2">{t("dineout.a5")}</h1>
          <p className="text-gray-600">{t("dineout.a6")}</p>
        </div>

        <div className="bg-gray-100 shadow-md rounded-2xl w-[380px] h-[280px] p-6 flex flex-col items-center text-center">
          <img
            src={imgOfBike}
            alt="Reliable delivery riders"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold mb-2">{t("dineout.a7")}</h1>
          <p className="text-gray-600">{t("dineout.a8")}</p>
        </div>

        <div className="bg-gray-100 shadow-md rounded-2xl w-[380px] h-[280px] p-6 flex flex-col items-center text-center">
          <img
            src={imgOfSave}
            alt="Real-time tracking"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold mb-2">{t("dineout.a9")}</h1>
          <p className="text-gray-600">{t("dineout.a10")}</p>
        </div>

        <div className="bg-gray-100 shadow-md rounded-2xl w-[380px] h-[280px] p-6 flex flex-col items-center text-center">
          <img
            src={imgOfCity}
            alt="We're in 11 cities"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold mb-2">{t("dineout.a11")}</h1>
          <p className="text-gray-600">{t("dineout.a12")}</p>
        </div>

        <div className="bg-gray-100 shadow-md rounded-2xl w-[380px] h-[280px] p-6 flex flex-col items-center text-center">
          <img src={imgOfHouse} alt="On demand" className="w-20 h-20 mb-4" />
          <h1 className="text-lg font-bold mb-2">{t("dineout.a13")}</h1>
          <p className="text-gray-600">{t("dineout.a14")}</p>
        </div>

        <div className="bg-gray-100 shadow-md rounded-2xl w-[380px] h-[280px] p-6 flex flex-col items-center text-center">
          <img
            src={imgOfMicrofon}
            alt="Round-the-clock support"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold mb-2">{t("dineout.a15")}</h1>
          <p className="text-gray-600">{t("dineout.a6")}</p>
        </div>
      </section>
      <section>
        <div className="text-center mt-20 text-3xl font-bold">
          <p>{t("dineout.a16")}</p>
        </div>
        <img src={imgOfPartnors} className="p-25" alt="" />
      </section>
      <Component1
        img={imgoforderdetail}
        title={t("dineout.a17")}
        description={t("dineout.a18")}
      />
      <Component2
        img={imgDeliver}
        title={t("dineout.a19")}
        description={t("dineout.a20")}
      />
      <Component1
        img={imgofTruck}
        title={t("dineout.a21")}
        description={t("dineout.a22")}
      />
      <p className="text-4xl font-bold text-center mt-20">{t("dineout.a23")}</p>
      <Deliverform />
      <Component6 style="mt-[-60px] mb-[20px]" />
    </section>
  );
};

export default DineOut;
