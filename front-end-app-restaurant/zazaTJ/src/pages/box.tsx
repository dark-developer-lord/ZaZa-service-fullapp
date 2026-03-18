import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import backgroundImageofSwiper from "../assets/Gemini_Generated_Image_pan3o8pan3o8pan3.png";
import { useTranslation } from "react-i18next";
import wink from "@/assets/wink_bf076b40b5 (1).avif";
import { Link } from "react-router";
import BgBlue from "@/components/bgBlue";
import imgOfbgBlue from "@/assets/instant_deliveries_1_e748df9bc7_4b3c3c2e58.avif";
import icon8 from "@/assets/icon_8_329b757fb3_492c4b6217.avif";
import icon7 from "@/assets/icon_7_5b10f3f1df_c3333e211b.avif";
import imgOfmove from "@/assets/move.avif";
import Component1 from "@/components/component1";
import appimage from "@/assets/app.avif";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Component6 from "@/components/component6";
const Box = () => {
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
              className="h-full flex flex-col justify-center items-start rounded-2xl shadow-xl text-white font-bold bg-cover bg-center px-6 md:px-20"
              style={{ backgroundImage: `url(${backgroundImageofSwiper})` }}
            >
              <p className="md:text-6xl text-3xl text-green-400 font-black text-left w-full">
                {t("supermarkets.a1")}
              </p>
              <p className="md:text-6xl text-3xl text-green-400 font-black text-left w-full">
                {t("supermarkets.a2")}
              </p>
              <p className="md:text-6xl text-3xl text-green-400 font-black text-left w-full">
                {t("supermarkets.a3")}
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
          <div className="flex gap-1 rounded-[8px] cursor-pointer w-25 h-11 bg-green-400 text-center items-center pl-4">
            <img className="w-7 h-7" src={wink} alt="" />
            <p className="text-xl font-bold text-green-900">Box</p>
          </div>
          <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={"/pharmacy"}>
            <div className="flex gap-1 rounded-[8px] cursor-pointer w-40 h-11 bg-gray-300 text-center items-center pl-4">
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
            <p className="text-[40px] font-bold text-green-900">Box</p>
            <p>{t("supermarkets.a17")}</p>
          </div>
        </div>
      </div>
      <section className="flex flex-wrap justify-center mt-10 gap-10 p-6">
        <div className="bg-gray-100 shadow-md rounded-2xl w-[380px] h-[280px] p-6 flex flex-col items-center text-center">
          <img
            src={icon8}
            alt="Reliable delivery riders"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold mb-2">{t("supermarkets.a8")}</h1>
          <p className="text-gray-600">{t("supermarkets.a19")}</p>
        </div>

        <div className="bg-gray-100 shadow-md rounded-2xl w-[380px] h-[280px] p-6 flex flex-col items-center text-center">
          <img
            src={icon7}
            alt="Real-time tracking"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold mb-2">{t("supermarkets.a20")}</h1>
          <p className="text-gray-600">{t("supermarkets.a21")}</p>
        </div>
      </section>
      <div>
        <BgBlue
          img={imgOfbgBlue}
          title="Box"
          description={t("supermarkets.a22")}
        />
      </div>
      <Component1
        img={imgOfmove}
        title="Box XL"
        description={t("supermarkets.a23")}
      />
      <BgBlue
        img={appimage}
        title="Box Purchase"
        description={t("supermarkets.a24")}
      />
      <div className="w-[90%] mt-20 m-auto bg-gradient-to-br from-[#3f2acb] to-[#160771] p-12 rounded-3xl text-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("supermarkets.a25")}
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="payment" className="border-none">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 border-b border-white/10">
              {t("supermarkets.a26")}
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-white/80">
              {t("supermarkets.a27")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="timing" className="border-none">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 border-b border-white/10">
              {t("supermarkets.a28")}
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-white/80">
              {t("supermarkets.a29")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="captain" className="border-none">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 border-b border-white/10">
              {t("supermarkets.a30")}
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-white/80">
              {t("supermarkets.a31")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="salom" className="border-none">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 border-b border-white/10">
              {t("supermarkets.a32")}
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-white/80">
              {t("supermarkets.a33")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="vaalekum" className="border-none">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 border-b border-white/10">
              {t("supermarkets.a34")}
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-white/80">
              {t("supermarkets.a35")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <p className="text-4xl font-bold text-center mt-20 mb-[-50px]">
        {t("resDeliver.a14")}
      </p>
      <Component6 style={"mt-20"} />
    </div>
  );
};

export default Box;
