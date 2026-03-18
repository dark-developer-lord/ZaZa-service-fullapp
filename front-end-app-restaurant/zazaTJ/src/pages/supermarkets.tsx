import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import backgroundImageofSwiper from "../assets/Gemini_Generated_Image_rtgkd9rtgkd9rtgk.png";
import { useTranslation } from "react-i18next";
import wink from "@/assets/wink_bf076b40b5 (1).avif"
import { Link } from 'react-router';
import BgBlue from '@/components/bgBlue';
import imgOfbgBlue from "@/assets/ssssss.avif"
import imgikea from "@/assets/IKEA_Logo_wine_505f95a9f4_b2cf5efbde_f8661e615e.avif"
import imgOfjones from "@/assets/jones_the_grocer_b7aa1aa0b4_324d85a529.avif"
import imgOfprime from "@/assets/prime_gourmet_logo_309556b205_6eec1684ba.avif"
import imgOfBayara from "@/assets/bayara_logo_9b19714779_a6874bce30.avif"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Component6 from '@/components/component6';
const Supermarkets = () => {
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
      <div className="">
        <div className="flex flex-wrap gap-5 justify-center ">
          <Link onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={"/supermarkets"}>
            <div className="flex gap-1 rounded-[8px] cursor-pointer w-50 h-11 bg-green-400 text-center items-center pl-4">
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
            <p className="text-[40px] font-bold text-green-900">
              {t("supermarkets.a4")}
            </p>
            <p>{t("supermarkets.a5")}</p>
          </div>
        </div>
      </div>
      <div>
        <BgBlue
          img={imgOfbgBlue}
          title={t("supermarkets.a6")}
          description={t("supermarkets.a7")}
        />
      </div>
      <p className="text-3xl font-bold text-center">{t("supermarkets.a9")}</p>
      <div className="flex flex-wrap justify-center gap-20 mt-20">
        <img className="w-45 h-40" src={imgikea} alt="" />
        <img className="w-55 h-55" src={imgOfjones} alt="" />
        <img src={imgOfprime} alt="" />
        <img src={imgOfBayara} alt="" />
      </div>
      <div className="w-[90%] mt-20 m-auto bg-gradient-to-br from-[#3f2acb] to-[#160771] p-12 rounded-3xl text-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("supermarkets.a10")}
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="payment" className="border-none">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 border-b border-white/10">
              {t("supermarkets.a11")}
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-white/80">
              {t("supermarkets.a12")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="timing" className="border-none">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 border-b border-white/10">
              {t("supermarkets.a13")}
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-white/80">
              {t("supermarkets.a14")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="captain" className="border-none">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-6 border-b border-white/10">
              {t("supermarkets.a15")}
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-white/80">
              {t("supermarkets.a16")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Component6 style={"mt-20"} />
    </div>
  );
}

export default Supermarkets
