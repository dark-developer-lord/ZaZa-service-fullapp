import React from "react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface FormFieldProps {
    label: string
    required?: boolean
    children: React.ReactNode
    helperText?: string
    errorText?: string
}

const FormField = ({ label, required, children, helperText, errorText }: FormFieldProps) => (
    <div className="space-y-1">
        <div className="mb-1.5 px-0.5">
            <Label className="text-sm font-medium text-slate-700 block">
                {required && <span className="text-red-500 mr-1.5">*</span>}
                {label}
            </Label>
        </div>
        {children}
        {helperText && (
            <p className="text-[13px] text-slate-500 font-medium px-0.5 mt-1.5">{helperText}</p>
        )}
        {errorText && (
            <p className="text-[13px] text-[#e11d48] font-medium px-0.5 mt-1.5">{errorText}</p>
        )}
    </div>
)

export default function ContactForm() {
    const { t } = useTranslation("contactForm")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted")
    }

    const inputClasses = "bg-[#f4f6f8] border-0 focus-visible:ring-1 focus-visible:ring-slate-300 shadow-none h-[46px] text-[15px] font-medium placeholder:font-normal placeholder:text-slate-400 px-4 rounded-md"

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center py-16 px-4 font-sans">
            <div className="w-full max-w-[660px] bg-white">
                <div className="text-center pb-10 pt-4">
                    <h1 className="text-[32px] md:text-[36px] font-bold text-[#1e293b] tracking-tight leading-[1.2] max-w-[500px] mx-auto">
                        {t("contactForm.title")}
                    </h1>
                </div>  

                <div className="px-1 sm:px-6">
                    <form className="space-y-7" onSubmit={handleSubmit}>

                        <FormField label={t("contactForm.name")} required>
                            <Input className={inputClasses} placeholder={t("placeholder", "Your answer")} required />
                        </FormField>

                        <FormField
                            label={t("contactForm.workEmail")} 
                            required
                            helperText={t("emailHelper", "Personal emails not accepted eg. @gmail.com, @hotmail.com, etc.")}
                        >
                            <Input className={inputClasses} type="email" placeholder={t("placeholder", "Your answer")} required />
                        </FormField>

                        <FormField label={t("contactForm.phoneNumber")} required>
                            <Input className={inputClasses} type="tel" placeholder={t("placeholder", "Your answer")} required />
                        </FormField>

                        <FormField label={t("contactForm.companyName")} required>
                            <Input className={inputClasses} placeholder={t("placeholder", "Your answer")} required />
                        </FormField>

                        <FormField label={t("contactForm.country")} required>
                            <Input className={inputClasses} placeholder={t("placeholder", "Your answer")} required />
                        </FormField>

                        <FormField label={t("contactForm.city")} required>
                            <Input className={inputClasses} placeholder={t("placeholder", "Your answer")} required />
                        </FormField>

                        <FormField label={t("contactForm.industry")} required>
                            <Input className={inputClasses} placeholder={t("placeholder", "Your answer")} required />
                        </FormField>

                        <FormField
                            label={t("contactForm.employees")}
                            required
                            helperText={t("employeesHelper", "eg. 0-99")}
                        >
                            <Input className={inputClasses} placeholder={t("placeholder", "Your answer")} required />
                        </FormField>

                        <FormField
                            label={t("contactForm.useCases")}
                            required
                            errorText={t("useCaseError", "At least one use case must be selected.")}
                        >
                            <Select>
                                <SelectTrigger className={`${inputClasses} w-full`}>
                                    <SelectValue placeholder={t("useCasesPlaceholder", "Select your use-cases")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="marketing">
                                        {t("useCaseMarketing", "Marketing")}
                                    </SelectItem>
                                    <SelectItem value="sales">
                                        {t("useCaseSales", "Sales")}
                                    </SelectItem>
                                    <SelectItem value="support">
                                        {t("useCaseSupport", "Support")}
                                    </SelectItem>
                                    <SelectItem value="analytics">
                                        {t("useCaseAnalytics", "Analytics")}
                                    </SelectItem>
                                    <SelectItem value="other">
                                        {t("useCaseOther", "Other")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label={t("contactForm.howCanWeHelp")} required>
                            <Textarea
                                placeholder={t("placeholder", "Your answer")}
                                className="bg-[#f4f6f8] border-0 focus-visible:ring-1 focus-visible:ring-slate-300 shadow-none min-h-[120px] resize-y text-[15px] font-medium placeholder:font-normal placeholder:text-slate-400 px-4 py-3 rounded-md"
                                required
                            />
                        </FormField>

                        <div className="pt-6 pb-12 flex justify-center  ">
                            <button
                                type="submit"
                                className="bg-[#1EA780] hover:bg-[#00c853] text-white text-[16px] font-semibold py-3.5 px-12 rounded-md transition-colors"
                            >
                                {t("contactForm.submit")}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}