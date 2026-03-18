import React from "react";
import { useTranslation } from "react-i18next";

import imageRu from "../assets/image1.png";
import imageTj from "../assets/image2.png";
import Component2 from "../components/component2";
import Component1 from "@/components/component1";
import img3 from "../assets/image3.png";
import img4 from "../assets/image4.png";
import img5 from "../assets/image5.png";
import Component5 from "@/components/component5";
import img6 from "../assets/image6.png";
import Component7 from "@/components/component7";
const images: Record<string, string> = {
  ru: imageRu,
  tj: imageTj,
};

const CorporatePackages: React.FC = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const normalizedLang =
    i18n?.language?.split("-")[0]?.toLowerCase() || "ru";

  const currentImage =
    images[normalizedLang] ?? images["ru"];

  return (
    <>
      
    <div className="w-full flex justify-center py-16 px-4">
      <div className="relative w-[90%] rounded-3xl overflow-hidden shadow-2xl">

        {/* Background Image */}
        <img
          src={currentImage}
          alt="corporate packages"
          className="w-full h-[420px] object-cover"
        />

      </div>
    </div>
      <Component5 />
      <Component2 img={img3} title={t("corporatePackages.a1")} description={t("corporatePackages.a2")} />
      <Component1 img={img4} title={t("corporatePackages.a3")} description={t("corporatePackages.a4")} />
      <Component2 img={img5} title={t("corporatePackages.a5")} description={t("corporatePackages.a6")} />
      <Component1 img={img6} title={t("corporatePackages.a7")} description={t("corporatePackages.a8")} />
      <Component7 />
    </>
  );
};

export default CorporatePackages;