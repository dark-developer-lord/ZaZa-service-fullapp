import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Component6 from "./component6";
import { partnerApi, ApiError } from "@/lib/api";

interface RestaurantFormData {
  merchantName: string;
  country: string;
  city: string;
  contactName: string;
  phone: string;
  email: string;
  numLocations: string;
}

export default function PartnerForm() {
  const { t } = useTranslation();
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string>("");

  const schema = yup.object({
    merchantName: yup.string().required(t("resDeliver.a13")),
    country:      yup.string().required(t("resDeliver.a13")),
    city:         yup.string().required(t("resDeliver.a13")),
    contactName:  yup.string().required(t("resDeliver.a13")),
    phone:        yup.string().required(t("resDeliver.a13")),
    email:        yup.string().email().required(t("resDeliver.a13")),
    numLocations: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RestaurantFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: RestaurantFormData) => {
    setSubmitStatus("loading");
    setServerError("");
    try {
      await partnerApi.submitRestaurant({
        merchant_name: data.merchantName,
        contact_name:  data.contactName,
        phone:         data.phone,
        email:         data.email,
        city:          `${data.country}, ${data.city}`,
        address:       data.numLocations ? `Кол-во точек: ${data.numLocations}` : undefined,
      });
      setSubmitStatus("success");
      reset();
    } catch (err) {
      setSubmitStatus("error");
      setServerError(err instanceof ApiError ? err.message : "Ошибка сети. Попробуйте снова.");
    }
  };

  const fieldClass = (hasError: boolean) =>
    `w-full rounded-md border px-4 py-4 text-sm bg-[#f8f9fa] focus:outline-none focus:ring-1 ${
      hasError ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-[#00e676]"
    }`;

  const fields: { key: keyof RestaurantFormData; label: string; type?: string }[] = [
    { key: "merchantName", label: t("resDeliver.a5") },
    { key: "country",      label: t("resDeliver.a6") },
    { key: "city",         label: t("resDeliver.a7") },
    { key: "contactName",  label: t("resDeliver.a8") },
    { key: "phone",        label: t("resDeliver.a9"),  type: "tel" },
    { key: "email",        label: t("resDeliver.a10"), type: "email" },
    { key: "numLocations", label: t("resDeliver.a11"), type: "number" },
  ];

  if (submitStatus === "success") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <p className="text-xl font-bold text-[#004c3f]">Заявка отправлена!</p>
        <p className="text-gray-500 mt-2">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-w-2xl mx-auto p-6 bg-white"
      >
        {fields.map(({ key, label, type = "text" }) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#004c3f]">
              <span className="text-[#ff5e00]">*</span> {label}
            </label>
            <input
              {...register(key)}
              type={type}
              placeholder={t("resDeliver.a12")}
              className={fieldClass(!!errors[key])}
            />
            {errors[key] && (
              <p className="text-red-500 text-xs">{label} {errors[key]?.message}</p>
            )}
          </div>
        ))}

        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={submitStatus === "loading"}
          className="w-full md:w-auto rounded-lg bg-[#1EA780] px-24 py-4 text-md font-bold text-white disabled:opacity-60"
        >
          {submitStatus === "loading" ? "Отправка..." : t("resDeliver.a13")}
        </button>
      </form>
      <p className="text-4xl font-bold text-center mt-20 mb-20">{t("resDeliver.a14")}</p>
      <Component6 />
    </div>
  );
}



export default function PartnerForm() {
    const { t } = useTranslation()
    const schema = yup.object({
      merchantName: yup.string().required(t("resDeliver.a13")),
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data:any) => {
    console.log(data);
  };

    return (
      <div>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-2xl mx-auto p-6 bg-white"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#004c3f]">
          <span className="text-[#ff5e00]">*</span> {t("resDeliver.a5")}
        </label>

        <input
          {...register("merchantName")}
          type="text"
          placeholder={t("resDeliver.a12")}
          className={`w-full rounded-md border px-4 py-4 text-sm bg-[#f8f9fa] focus:outline-none focus:ring-1
            ${
              errors.merchantName
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#00e676]"
            }`}
        />

        {errors.merchantName && (
          <p className="text-red-500 text-xs">{`${t("resDeliver.a5")} ${errors.merchantName.message}`}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#004c3f]">
          <span className="text-[#ff5e00]">*</span> {t("resDeliver.a6")}
        </label>

        <input
          {...register("merchantName")}
          type="text"
          placeholder={t("resDeliver.a12")}
          className={`w-full rounded-md border px-4 py-4 text-sm bg-[#f8f9fa] focus:outline-none focus:ring-1
            ${
              errors.merchantName
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#00e676]"
            }`}
        />

        {errors.merchantName && (
          <p className="text-red-500 text-xs">{`${t("resDeliver.a6")} ${errors.merchantName.message}`}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#004c3f]">
          <span className="text-[#ff5e00]">*</span> {t("resDeliver.a7")}
        </label>

        <input
          {...register("merchantName")}
          type="text"
          placeholder={t("resDeliver.a12")}
          className={`w-full rounded-md border px-4 py-4 text-sm bg-[#f8f9fa] focus:outline-none focus:ring-1
            ${
              errors.merchantName
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#00e676]"
            }`}
        />

        {errors.merchantName && (
          <p className="text-red-500 text-xs">{`${t("resDeliver.a7")} ${errors.merchantName.message}`}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#004c3f]">
          <span className="text-[#ff5e00]">*</span> {t("resDeliver.a8")}
        </label>

        <input
          {...register("merchantName")}
          type="text"
          placeholder={t("resDeliver.a12")}
          className={`w-full rounded-md border px-4 py-4 text-sm bg-[#f8f9fa] focus:outline-none focus:ring-1
            ${
              errors.merchantName
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#00e676]"
            }`}
        />

        {errors.merchantName && (
          <p className="text-red-500 text-xs">{`${t("resDeliver.a8")} ${errors.merchantName.message}`}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#004c3f]">
          <span className="text-[#ff5e00]">*</span> {t("resDeliver.a9")}
        </label>

        <input
          {...register("merchantName")}
          type="text"
          placeholder={t("resDeliver.a12")}
          className={`w-full rounded-md border px-4 py-4 text-sm bg-[#f8f9fa] focus:outline-none focus:ring-1
            ${
              errors.merchantName
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#00e676]"
            }`}
        />

        {errors.merchantName && (
          <p className="text-red-500 text-xs">{`${t("resDeliver.a9")} ${errors.merchantName.message}`}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#004c3f]">
          <span className="text-[#ff5e00]">*</span> {t("resDeliver.a10")}
        </label>

        <input
          {...register("merchantName")}
          type="text"
          placeholder={t("resDeliver.a12")}
          className={`w-full rounded-md border px-4 py-4 text-sm bg-[#f8f9fa] focus:outline-none focus:ring-1
            ${
              errors.merchantName
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#00e676]"
            }`}
        />

        {errors.merchantName && (
          <p className="text-red-500 text-xs">{`${t("resDeliver.a10")} ${errors.merchantName.message}`}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#004c3f]">
          <span className="text-[#ff5e00]">*</span> {t("resDeliver.a11")}
        </label>

        <input
          {...register("merchantName")}
          type="text"
          placeholder={t("resDeliver.a12")}
          className={`w-full rounded-md border px-4 py-4 text-sm bg-[#f8f9fa] focus:outline-none focus:ring-1
            ${
              errors.merchantName
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-[#00e676]"
            }`}
        />

        {errors.merchantName && (
          <p className="text-red-500 text-xs">{`${t("resDeliver.a11")} ${errors.merchantName.message}`}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full md:w-auto rounded-lg bg-[#1EA780] px-24 py-4 text-md font-bold text-white"
      >
        {t("resDeliver.a13")}
      </button>
    </form>
    <p className="text-4xl font-bold text-center mt-20 mb-20">{t("resDeliver.a14")}</p>
    <Component6/>
      </div>
  );
}
