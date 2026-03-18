import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import kareemImage from "../assets/Gemini_Generated_Image_b0slteb0slteb0sl.png";
import { Facebook, Linkedin, Instagram, X, Menu, MapPin, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import wink from "@/assets/wink_bf076b40b5 (1).avif";
import i18n from "../i18n";
import googleplay from "@/assets/google-play (1).webp"
import apk from "@/assets/apk-download (1).webp"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Layout = () => {
  const [Open, setOpen] = useState(false);
  const [partnersOpen, setPartnersOpen] = useState(false);
  const [servicesOpen, setservicesOpen] = useState(false);
  const [openEat, setOpenEat] = useState(false);
  const [openGet, setopenGet] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate()
  const hideLayoutPaths = ["/signin", "/login"];
  const hideLayout = hideLayoutPaths.includes(location.pathname);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogout, setshowLogout] = useState(false);

  function TranslateClick(lang: string) {
    i18n.changeLanguage(lang);
  }

  useEffect(() => {
    const phone = localStorage.getItem("userPhone");
    setLoggedIn(!!phone);
  }, []);

  return (
    <div>
      {!hideLayout && (
        <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
          <nav className="flex justify-between items-center px-6 md:px-20 h-[80px]">
            <div className="flex items-center gap-8">
              <Link onClick={() => {
                setPartnersOpen(false)
                setservicesOpen(false)
              }} to="/">
                <img className="w-24 h-8" src={kareemImage} alt="Logo" />
              </Link>

              <div className="hidden md:flex gap-7 font-semibold cursor-pointer">
                <div
                  onClick={() => {
                    setservicesOpen(!servicesOpen);
                    setPartnersOpen(false);
                  }}
                  className="hover:text-green-500"
                >
                  <div>{t("header.a1")}</div>
                </div>

                <div
                  className="hover:text-green-500 cursor-pointer"
                  onClick={() => {
                    setPartnersOpen(!partnersOpen);
                    setservicesOpen(false);
                    setopenGet(false);
                    setOpenEat(false);
                  }}
                >
                  <div className={partnersOpen ? "text-green-500" : ""}>
                    {t("header.a2")}
                  </div>
                </div>

                <div
                  onClick={() => {
                    setPartnersOpen(false);
                    setservicesOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  className="hover:text-green-500"
                >
                  <Link to={"/about"}>{t("header.a3")}</Link>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-7">
              {!loggedIn ? (
                <button
                  onClick={() => {
                    setPartnersOpen(false);
                    setservicesOpen(false);
                    navigate("/signin");
                  }}
                  className="w-20 h-10 bg-green-400 rounded-lg font-semibold hover:bg-green-500 transition-colors"
                >
                  {t("header.a4")}
                </button>
              ) : (
                <div className="relative">
                  {/* User Icon */}
                  <div
                    onClick={() => setshowLogout(!showLogout)}
                    className="cursor-pointer w-10 h-10 border rounded-full flex items-center justify-center"
                  >
                    <User className="w-6 h-6 text-gray-700" />
                  </div>

                  {/* Dropdown */}
                  {showLogout && (
                    <div className="absolute h-50 right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-in-out">
                      {/* Top Section: Profile Info */}
                      <div className="p-6 flex flex-col items-center border-b border-gray-50">
                        {/* Avatar Circle */}
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                          <svg
                            className="w-8 h-8 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>

                        <h3 className="text-gray-900 font-semibold text-lg leading-tight">
                          Ahmad Kamolov
                        </h3>
                      </div>

                      {/* Bottom Section: Actions */}
                      <div className="p-2 mt-[0px]">
                        <button
                          onClick={() => {
                            localStorage.removeItem("userPhone");
                            setLoggedIn(false);
                            setshowLogout(false);
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
                        >
                          <span className="text-lg group-hover:text-red-500 transition-colors">
                            {t("header.a5")}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Select onValueChange={TranslateClick}>
                <SelectTrigger className="w-[110px] border border-gray-300 rounded-md px-3 flex items-center justify-between font-semibold hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition">
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

            <button
              onClick={() => setOpen(!Open)}
              className="md:hidden cursor-pointer"
            >
              {Open ? (
                <X size={28} />
              ) : (
                <Menu onClick={() => setPartnersOpen(false)} size={28} />
              )}
            </button>

            {Open && (
              <div className="md:hidden fixed top-[80px] left-0 w-full bg-white shadow-xl z-40 flex flex-col gap-2 py-6 font-semibold animate-fadeIn">
                <div
                  onClick={() => {
                    setservicesOpen(!servicesOpen);
                    setPartnersOpen(false);
                    setOpenEat(false);
                    setopenGet(false);
                  }}
                  className="px-6 py-2 hover:bg-green-50 rounded transition-colors cursor-pointer"
                >
                  {t("header.a1")}
                </div>

                {servicesOpen && (
                  <div className="w-full bg-[#f7f8f9] border-t border-gray-100 py-4 animate-slideDown">
                    <div className="px-6 flex flex-col gap-4 font-semibold text-[#004a43]">
                      <div
                        onClick={() => {
                          setOpenEat(!openEat);
                          setopenGet(false);
                        }}
                        className="hover:text-green-500 cursor-pointer transition-colors"
                      >
                        {t("servicesOpen.a1")}
                      </div>
                      <div
                        onClick={() => {
                          setopenGet(!openGet);
                          setOpenEat(false);
                        }}
                        className="hover:text-green-600 cursor-pointer transition-colors"
                      >
                        {t("servicesOpen.a2")}
                      </div>
                    </div>
                  </div>
                )}

                {openEat && (
                  <div className="flex gap-4 relative mt-2 ml-6">
                    <Link
                      onClick={() => {
                        setOpenEat(false);
                        setPartnersOpen(false);
                        setservicesOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      to="/food"
                    >
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                        <img className="w-6 h-6" src={wink} alt="" />
                        <p className="text-green-900 font-semibold">Food</p>
                      </div>
                    </Link>
                  </div>
                )}

                {openGet && (
                  <div className="flex flex-wrap gap-3 mt-2 ml-6">
                    {[
                      { to: "/supermarkets", text: t("Pharmacy.a10") },
                      { to: "/box", text: "Box" },
                      { to: "/pharmacy", text: t("Pharmacy.a9") },
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        onClick={() => {
                          setopenGet(false);
                          setservicesOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        to={item.to}
                      >
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                          <img className="w-6 h-6" src={wink} alt="" />
                          <p className="text-green-900 font-semibold">
                            {item.text}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <div
                  className="px-6 py-2 mt-4 hover:bg-green-50 rounded transition-colors cursor-pointer"
                  onClick={() => {
                    setPartnersOpen(!partnersOpen);
                    setservicesOpen(false);
                  }}
                >
                  {t("header.a2")}
                </div>

                {partnersOpen && (
                  <div className="flex flex-col pl-6 gap-2 mt-2 animate-slideDown">
                    <Link
                      onClick={() => {setOpen(false)
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      to="/CorporatePackages"
                    >
                      {t("section8.a1")}
                    </Link>
                    <Link onClick={() => {setOpen(false)
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }} to="/resDeliver">
                      {t("section8.a2")}
                    </Link>
                    <Link onClick={() => {setOpen(false)
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }} to="/b2bdeliver">
                      {t("section8.a3")}
                    </Link>
                    <Link
                      onClick={() => {setOpen(false)
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      to="/CorporatePackages"
                    >
                      {t("section8.a5")}
                    </Link>
                  </div>
                )}

                <Link
                  onClick={() => {
                    setOpen(false) 
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-2 hover:bg-green-50 rounded transition-colors"
                  to="/about"
                >
                  {t("header.a3")}
                </Link>

                <div className="flex justify-center items-center mt-4 gap-4 px-6">
                  <Select onValueChange={TranslateClick}>
                    <SelectTrigger className="w-[100px] border border-gray-300 rounded-md px-3 flex items-center justify-between font-semibold hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition">
                      <SelectValue placeholder={i18n.language.toUpperCase()} />
                    </SelectTrigger>
                    <SelectContent className="w-[100px] bg-white border border-gray-300 rounded-md shadow-lg p-1">
                      <SelectItem
                        value="tj"
                        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-green-100 cursor-pointer"
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
                        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-green-100 cursor-pointer"
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

                  {!loggedIn ? (
                    <button
                      onClick={() => {
                        setPartnersOpen(false);
                        setservicesOpen(false);
                        navigate("/signin");
                      }}
                      className="w-20 h-10 bg-green-400 rounded-lg font-semibold hover:bg-green-500 transition-colors"
                    >
                      {t("header.a4")}
                    </button>
                  ) : (
                    <div className="cursor-pointer w-10 h-10 border rounded-full text-center flex items-center justify-center">
                      <User />
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>

          {partnersOpen && (
            <div className="w-full md:block hidden bg-[#f7f8f9] border-t border-gray-100 py-6">
              <div className="px-6 md:px-20 flex gap-10 font-semibold text-[#004a43]">
                <Link
                  to="/CorporatePackages"
                  onClick={() => {setPartnersOpen(false)
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {t("section8.a1")}
                </Link>
                <Link to="/resDeliver" onClick={() => {setPartnersOpen(false)
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}>
                  {t("section8.a2")}
                </Link>
                <Link to="/b2bdeliver" onClick={() => {setPartnersOpen(false)
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}>
                  {t("section8.a3")}
                </Link>
                <Link to="/" onClick={() => {setPartnersOpen(false)
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}>
                  {t("section8.a5")}
                </Link>
              </div>
            </div>
          )}

          {servicesOpen && (
            <div className="w-full h-[200px] block bg-[#f7f8f9] border-t border-gray-100 py-6">
              <div className="px-6 md:px-20 flex flex-col gap-10 font-semibold text-[#004a43]">
                <div
                  onClick={() => {
                    setOpenEat(!openEat);
                    setopenGet(false);

                    // setservicesOpen(false); // close dropdown on click
                  }}
                  className="hover:text-green-500 cursor-pointer"
                >
                  {t("servicesOpen.a1")}
                </div>
                <div
                  onClick={() => {
                    setopenGet(!openGet);
                    setOpenEat(false);
                    // setservicesOpen(false); // close dropdown on click
                  }}
                  className="hover:text-green-600 cursor-pointer"
                >
                  {t("servicesOpen.a2")}
                </div>
              </div>
            </div>
          )}

          {openEat && (
            <div className="flex gap-5 relative md:mt-[-175px] ml-[250px]">
              <Link
                onClick={() => {
                  setOpenEat(!openEat);
                  setOpenEat(false);
                  setPartnersOpen(false);
                  setservicesOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                to="/food"
              >
                <div className="flex gap-1 rounded-[8px] cursor-pointer w-25 h-8 bg-gray-300 items-center pl-2">
                  <img className="w-7 h-7" src={wink} alt="" />
                  <p className="text-xl font-bold text-green-900">Food</p>
                </div>
              </Link>
            </div>
          )}

          {openGet && (
            <div className="flex gap-5 relative md:mt-[-175px] ml-[250px]">
              <Link
                onClick={() => {
                  setopenGet(false);
                  setservicesOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                to="/supermarkets"
              >
                <div className="flex gap-1 rounded-[8px] cursor-pointer w-50 h-8 bg-gray-300 items-center pl-4">
                  <img className="w-7 h-7" src={wink} alt="" />
                  <p className="text-xl font-bold text-green-900">
                    {t("Pharmacy.a10")}
                  </p>
                </div>
              </Link>
              <Link
                onClick={() => {
                  setopenGet(false);
                  setservicesOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                to="/box"
              >
                <div className="flex gap-1 rounded-[8px] cursor-pointer w-25 h-8 bg-gray-300 items-center pl-4">
                  <img className="w-7 h-7" src={wink} alt="" />
                  <p className="text-xl font-bold text-green-900">Box</p>
                </div>
              </Link>
              <Link
                onClick={() => {
                  setPartnersOpen(false);
                  setservicesOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                to="/pharmacy"
              >
                <div className="flex gap-1 rounded-[8px] cursor-pointer w-40 h-8 bg-gray-300 items-center pl-4">
                  <img className="w-7 h-7" src={wink} alt="" />
                  <p className="text-xl font-bold text-green-900">
                    {t("Pharmacy.a9")}
                  </p>
                </div>
              </Link>
            </div>
          )}
        </header>
      )}

      <main className="pt-[100px]">
        <Outlet />
      </main>

      {!hideLayout && (
        <footer className="bg-white pt-16 pb-8 px-8 border-t border-gray-100 font-sans text-[#004a32]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
              <div className="lg:col-span-1">
                <div className="font-bold mb-8 flex items-center">
                  <img className="w-30 h-10" src={kareemImage} alt="" />
                </div>
                <div className="space-y-3">
                  <div className="text-[8px] leading-tight">
                    <img className="w-35" src={googleplay} alt="" />
                  </div>
                  <div className="text-[8px] leading-tight">
                    <img className="w-35" src={apk} alt="" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-6">{t("section7.a1")}</h4>
                <ul className="space-y-4 text-sm text-gray-700">
                  <li
                    onClick={() => {
                      navigate("/food");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    {t("section7.a3")}
                  </li>
                  <li
                    onClick={() => {
                      navigate("/supermarkets");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    {t("section7.a4")}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6">{t("section7.a7")}</h4>
                <ul className="space-y-4 text-sm text-gray-700">
                  <li
                    onClick={() => {
                      navigate("/CorporatePackages");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    {t("section7.a8")}
                  </li>
                  <li
                    onClick={() => {
                      navigate("/resDeliver");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    {t("section7.a9")}
                  </li>
                  <li
                    onClick={() => {
                      navigate("/b2bdeliver");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    {t("section7.a10")}
                  </li>
                  <li
                    onClick={() => {
                      navigate("/");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    {t("section7.a11")}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-wrap leading-tight">
                  {t("section7.a12")}
                </h4>
                <ul className="space-y-4 text-sm text-gray-700">
                  <li
                    onClick={() => {
                      navigate("/about");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    {t("section7.a13")}
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="border w-[180px] border-gray-200 p-2 px-4 rounded-lg flex justify-between items-center cursor-pointer hover:border-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} /> <span>{t("section7.a21")}</span>
                  </div>
                  <span className="text-[10px]">▼</span>
                </div>
                <div className="p-2 px-4 rounded-lg flex w-[200px] justify-between items-center cursor-pointer hover:border-gray-400">
                  <Select onValueChange={TranslateClick}>
                    <SelectTrigger className="w-[200px] md:ml-[-15px] border border-gray-300 rounded-md px-3 flex items-center justify-between font-semibold hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition">
                      <SelectValue placeholder={i18n.language.toUpperCase()} />
                    </SelectTrigger>
                    <SelectContent className="w-[200px] bg-white border border-gray-300 rounded-md shadow-lg p-1">
                      <SelectItem
                        value="tj"
                        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-green-100 cursor-pointer"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/1280px-Flag_of_Tajikistan.svg.png"
                          alt="Tajik"
                          className="w-[25px] h-[20px] rounded-sm"
                        />
                        {t("footer.a1")}
                      </SelectItem>
                      <SelectItem
                        value="ru"
                        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-green-100 cursor-pointer"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg"
                          alt="Russian"
                          className="w-[25px] h-[20px] rounded-sm"
                        />
                        {t("footer.a2")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
              <p>{t("section7.a25")}</p>
              <div className="flex gap-6">
                <span className="cursor-pointer hover:text-black transition-colors underline-offset-4 hover:underline">
                  {t("section7.a26")}
                </span>
                <span className="cursor-pointer hover:text-black transition-colors underline-offset-4 hover:underline">
                  {t("section7.a27")}
                </span>
              </div>
              <div className="flex gap-4 text-[#004a32]">
                <Facebook
                  className="cursor-pointer hover:text-green-500 transition-colors"
                  size={20}
                />
                <X
                  className="cursor-pointer hover:text-green-500 transition-colors"
                  size={20}
                />
                <Linkedin
                  className="cursor-pointer hover:text-green-500 transition-colors"
                  size={20}
                />
                <Instagram
                  className="cursor-pointer hover:text-green-500 transition-colors"
                  size={20}
                />
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
