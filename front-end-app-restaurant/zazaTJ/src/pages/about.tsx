import currentImage from "../assets/zaza copy.png"
import { useTranslation } from 'react-i18next'
import img3 from "../assets/image3.png";
import img4 from "../assets/image4.png";
import Component1 from '../components/component1';
import Component2 from '../components/component2';
import Component8 from '@/components/component8';
import Component4 from '@/components/component4';
import img9 from "../assets/image9.png";
import img10 from "../assets/image10.png";
import img11 from "../assets/image11.png";


const About = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="w-full flex justify-center py-16 px-4">
        <div className="relative w-[90%] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={currentImage}
            alt="corporate packages"
            className="w-full h-[420px] object-cover"

          />
        </div>
      </div>
      <div className="w-full py-20 px-4">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-10">
            {t("about.title")}
          </h1>

          <div className="space-y-8 text-lg leading-8 text-slate-700">
            <p>{t("about.description")}</p>
          </div>

        </div>
      </div>
      <Component2 img={img3} title={t("corporatePackages.a1")} description={t("corporatePackages.a2")} />
      <Component1 img={img4} title={t("corporatePackages.a3")} description={t("corporatePackages.a4")} />
      <Component8 />
      <Component1 img={img4} title={t("corporatePackages.a3")} description={t("corporatePackages.a4")} />
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
              title={t("blogPost.title")}
              description={t("blogPost.description")}
            />
            <Component4
              img={img10}
              title={t("blogPostRamadan.title")}
              description={t("blogPostRamadan.description")}
            />
            <Component4
              img={img11}
              title={t("blogPostDineOut.title")}
              description={t("blogPostDineOut.description")}
            />
          </div>
        </div>
      </div>



    </>
  )
}

export default About
