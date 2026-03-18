import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import backgroundImageofSwiper from "../assets/ba3ff221bd0d97bbc977bf8e9aeac9cb.avif";
import img3 from "../assets/cplus_rebranded_2fce89a1fa_9705eca38d.avif";
import img4 from "../assets/New_Project_2d4f192d1a_2ea94d965a.avif";
import Component1 from "../components/component1";
import img5 from "../assets/About_us_updt_e1e14ed645_a763772db7.avif";
import img6 from "../assets/cfb1_3de6ed9ba7_1f228dd07e_dda5481961.avif";
import img7 from "../assets/Engineering_at_careem_jpg_ef7d7b1c0c_2caad2b88b.avif";
import Component2 from "../components/component2";
import { useTranslation } from "react-i18next";
import Component3 from "@/components/component3";
import img8 from "../assets/Our_social_impact_a3f0da8cdb_83bb7861bd.avif";
import Component4 from "@/components/component4";
import img9 from "@/assets/3_1000x560_1_0c23cd7050.avif";
import img10 from "@/assets/Careem_App_Pay_1000x560_1_5e7d51cdb1.avif";
import img11 from "@/assets/asas.avif";
import Component6 from "@/components/component6";
const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="">
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
              {t("section1.a1")}
            </div>
          </SwiperSlide>

          <SwiperSlide className="rounded-2xl">
            <div
              className="h-full flex items-center justify-center rounded-2xl shadow-xl text-white text-4xl font-bold bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImageofSwiper})` }}
            >
              {t("section1.a2")}
            </div>
          </SwiperSlide>

          <SwiperSlide className="rounded-2xl">
            <div
              className="h-full flex items-center justify-center rounded-2xl shadow-xl text-white text-4xl font-bold bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImageofSwiper})` }}
            >
              {t("section1.a3")}
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <Component6 style="mt-8 mb-8" />
      <div className="w-full max-w-6xl md:ml-[100px] px-4 md:px-6 py-10">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[Autoplay]}
          className="h-[220px] md:w-[1300px] m-auto md:h-[250px] rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <SwiperSlide>
            <div className="relative h-full w-full flex items-center justify-between bg-gradient-to-r from-[#003d26] to-[#005c3a] rounded-[2.5rem] p-8 md:p-14 overflow-hidden">
              <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#20e682]/20 rounded-full blur-3xl"></div>

              <div className="flex flex-col justify-between z-10 max-w-md">
                <span className="font-serif text-4xl md:text-5xl text-green-400">
                  ZAZA
                </span>

                <div className="mt-6">
                  <h2 className="text-white text-xl md:text-3xl font-semibold leading-snug">
                    {t("section4.a1")}
                  </h2>
                  <p className="text-gray-200 mt-3 text-sm md:text-base">
                    {t("section4.a2")}
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center justify-end h-full w-1/2">
                <img
                  src={img4}
                  alt="promo"
                  className="h-[90%] object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="h-full w-full flex items-center justify-between bg-gradient-to-r from-[#003d26] to-[#005c3a] rounded-[2.5rem] p-8 md:p-14 overflow-hidden relative">
              <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"></div>

              <div className="flex flex-col justify-between z-10 max-w-md">
                <span className="font-serif text-4xl md:text-5xl text-green-400">
                  ZAZA
                </span>

                <div className="mt-6">
                  <h2 className="text-white text-xl md:text-3xl font-semibold leading-snug">
                    {t("section4.a3")}
                  </h2>
                  <p className="text-gray-300 mt-3 text-sm md:text-base">
                    {t("section4.a4")}
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center justify-end h-full w-1/2">
                <img
                  src={img3}
                  alt="delivery"
                  className="h-[90%] object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <Component1
        img={img5}
        title={t("section5.a1")}
        description={t("section5.a2")}
      />
      <Component2
        img={img6}
        title={t("section5.a3")}
        description={t("section5.a4")}
      />
      <Component1
        img={img7}
        title={t("section5.a5")}
        description={t("section5.a6")}
      />
      <Component3
        img={img8}
        title={t("section5.a8")}
        description={t("section5.a9")}
      />
      <div className="jagged-gradient-bg py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900">Our blog</h2>
            <a
              href="#"
              className="text-slate-900 font-bold flex items-center gap-2 hover:underline"
            >
              View all <span>→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Component4
              img={img9}
              title={t("section6.a1")}
              description={t("section6.a2")}
            />
            <Component4
              img={img10}
              title={t("section6.a3")}
              description={t("section6.a4")}
            />
            <Component4
              img={img11}
              title={t("section6.a5")}
              description={t("section6.a6")}
            />
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Home;
