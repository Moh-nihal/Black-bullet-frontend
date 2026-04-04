"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { pickLocalizedText } from "@/lib/pickLocalizedText";

const getVehicleTypes = (locale) => [
  { icon: "directions_car", label: locale === "ar" ? "سيارة رياضية / خارقة" : "Supercar / Exotic" },
  { icon: "sports_motorsports", label: locale === "ar" ? "أداء فائق" : "Hyper Performance" },
  { icon: "precision_manufacturing", label: locale === "ar" ? "بناء مخصص" : "Custom Build" },
];

const MAX_SERVICE_TYPE_LEN = 120;

function mapPublicServicesToBookingOptions(list, locale) {
  if (!Array.isArray(list)) return [];
  return list.map((s) => {
    const titleRaw = s.title;
    const label = pickLocalizedText(titleRaw, locale);
    const desc = pickLocalizedText(s.shortDesc || s.description, locale);
    const forApi = label.trim().slice(0, MAX_SERVICE_TYPE_LEN);
    return {
      key: String(s.slug || s._id || label),
      icon: s.icon || "build",
      label,
      desc,
      serviceTypeForApi: forApi,
    };
  });
}

// Generate next 14 days for date selection
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      date: d,
      dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      dayNumber: d.getDate(),
      isoDate: d.toISOString().split("T")[0],
    });
  }
  return dates;
};

// Fallback slots if API fails
const FALLBACK_SLOTS = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

export default function BookingForm() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";

  const [activeStep, setActiveStep] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [selectedService, setSelectedService] = useState(0);
  const [bookingServices, setBookingServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    model: "",
    notes: "",
  });

  const dates = generateDates();
  const [availableSlots, setAvailableSlots] = useState(FALLBACK_SLOTS);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [dayIsClosed, setDayIsClosed] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setServicesLoading(true);
      try {
        const res = await api.get("/public/services", {
          params: { limit: 50, locale },
        });
        const list = res.data?.data;
        const mapped = mapPublicServicesToBookingOptions(list, locale);
        if (!cancelled) setBookingServices(mapped);
      } catch (e) {
        console.error("BookingForm: failed to load services", e);
        if (!cancelled) {
          setBookingServices([]);
          toast.error("Could not load services. Please refresh the page.");
        }
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    setSelectedService((i) => {
      const n = bookingServices.length;
      if (n === 0) return 0;
      return Math.min(Math.max(0, i), n - 1);
    });
  }, [bookingServices.length]);

  const fetchSlots = useCallback(async (isoDate) => {
    setSlotsLoading(true);
    setSelectedTime(null);
    setDayIsClosed(false);
    try {
      const res = await api.get(`/public/bookings/available-slots?date=${isoDate}`);
      
      // The API should return { success: true, data: { closed: boolean, slots: string[] } }
      // But we'll handle both the new object structure and the legacy array structure for robustness.
      const rawData = res.data;
      let slots = [];
      let closed = false;

      if (rawData && (rawData.success || rawData.ok) && rawData.data) {
        // New structure (handles both .success and .ok)
        slots = rawData.data.slots || [];
        closed = rawData.data.closed || false;
      } else if (Array.isArray(rawData)) {
        // Legacy array structure
        slots = rawData;
        closed = slots.length === 0;
      } else if (rawData && rawData.slots) {
        // Alternative object structure
        slots = rawData.slots || [];
        closed = rawData.closed || false;
      }

      if (closed || !slots.length) {
        setDayIsClosed(true);
        setAvailableSlots([]);
      } else {
        setDayIsClosed(false);
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      // Use fallback slots if API fails
      setAvailableSlots(FALLBACK_SLOTS);
      setDayIsClosed(false);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // Fetch slots when date changes
  useEffect(() => {
    if (activeStep === 3 && dates[selectedDateIndex]) {
      fetchSlots(dates[selectedDateIndex].isoDate);
    }
  }, [selectedDateIndex, activeStep, fetchSlots]);

  const steps = [
    { num: "01", stage: locale === "ar" ? "المرحلة الأولى" : "Stage One", label: locale === "ar" ? "الهوية الشخصية" : "Personal Identity" },
    { num: "02", stage: locale === "ar" ? "المرحلة الثانية" : "Stage Two", label: locale === "ar" ? "ملف المركبة" : "Vehicle Profile" },
    { num: "03", stage: locale === "ar" ? "المرحلة الثالثة" : "Stage Three", label: locale === "ar" ? "نطاق الخدمة" : "Service Scope" },
    { num: "04", stage: locale === "ar" ? "المرحلة الرابعة" : "Stage Four", label: locale === "ar" ? "التوقيت" : "Tactical Timing" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      setActiveStep(0);
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      setActiveStep(0);
      return;
    }
    if (!formData.model.trim()) {
      toast.error("Please enter your vehicle model");
      setActiveStep(1);
      return;
    }
    if (selectedTime === null) {
      toast.error("Please select a time slot");
      return;
    }
    const selectedSvc = bookingServices[selectedService];
    if (!selectedSvc?.serviceTypeForApi) {
      toast.error("Please select a service");
      setActiveStep(2);
      return;
    }
    if (!recaptchaToken) {
      toast.error("Please verify that you are not a robot");
      return;
    }

    setSubmitting(true);
    try {
      const selectedDate = dates[selectedDateIndex];
      await api.post("/bookings", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        model: formData.model.trim(),
        vehicleTypeIndex: selectedVehicle,
        serviceType: selectedSvc.serviceTypeForApi,
        preferredDate: selectedDate.isoDate,
        preferredTime: availableSlots[selectedTime],
        preferredDateLabel: `${selectedDate.dayLabel} ${selectedDate.dayNumber}`,
        notes: formData.notes.trim(),
        recaptchaToken,
      });
      toast.success("Booking submitted! A Performance Engineer will contact you soon.");
      setSubmitted(true);
      setRecaptchaToken(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("This time slot was just taken. Please choose another.");
        setSelectedTime(null);
        fetchSlots(dates[selectedDateIndex].isoDate);
      } else {
        const message = err.response?.data?.message || err.message || "Failed to submit booking";
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-black/10 p-12 text-center space-y-6 max-w-2xl mx-auto shadow-lg">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-primary text-4xl">task_alt</span>
        </div>
        <h3 className="font-headline font-black text-2xl text-black uppercase italic">
          {locale === "ar" ? "تم تأكيد الحجز" : "Booking Confirmed"}
        </h3>
        <p className="text-on-surface-variant text-sm max-w-md mx-auto">
          {locale === "ar" ? "تم إرسال حجزك بنجاح. سيتواصل معك مهندس الأداء في غضون 60 دقيقة للانتهاء من التفاصيل." : "Your booking has been submitted successfully. A Performance Engineer will contact you within 60 minutes to finalize the details for your session."}
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-on-primary-fixed px-8 py-4 font-headline font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all mt-4"
        >
          {locale === "ar" ? "العودة للرئيسية" : "Return to Home"}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
      {/* Left: Stepper */}
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-40 space-y-6 md:space-y-8">
          {steps.map((step, i) => (
            <button
              key={step.num}
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-4 w-full text-left transition-all ${
                i <= activeStep ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center border-2 font-headline font-bold text-sm ${
                  i <= activeStep
                    ? "border-primary text-primary"
                    : "border-outline text-on-surface-variant"
                }`}
              >
                {step.num}
              </div>
              <div>
                <p
                  className={`font-label text-[10px] font-bold uppercase tracking-widest ${
                    i <= activeStep ? "text-primary" : ""
                  }`}
                >
                  {step.stage}
                </p>
                <p className="font-headline font-bold uppercase text-sm">
                  {step.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="lg:col-span-9">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-black/10 p-6 md:p-8 lg:p-12 shadow-lg relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div
            className="absolute top-0 left-0 h-1 bg-primary shadow-[0_0_15px_rgba(220,0,0,0.4)] transition-all duration-500"
            style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
          />

          <div className="pt-8 min-h-[400px]">
            {/* Step 1: Personal */}
            {activeStep === 0 && (
              <div className="flex flex-col h-full justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="font-label font-bold text-xs text-on-surface-variant uppercase tracking-widest">
                      {locale === "ar" ? "اسم السائق" : "Pilot Name"}
                    </label>
                    <input
                      className="w-full bg-surface-container border border-black/10 text-black p-4 font-headline placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary transition-all"
                      placeholder={locale === "ar" ? "الاسم الكامل" : "FULL NAME"}
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      aria-label="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label font-bold text-xs text-on-surface-variant uppercase tracking-widest">
                      {locale === "ar" ? "وسيلة الاتصال" : "Contact Signal"}
                    </label>
                    <input
                      className="w-full bg-surface-container-highest border-none text-white p-4 font-headline placeholder:text-outline-variant focus:ring-1 focus:ring-primary transition-all"
                      placeholder={locale === "ar" ? "البريد الإلكتروني" : "EMAIL ADDRESS"}
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      aria-label="Email address"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-8 border-t border-outline-variant/20 mt-auto">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="bg-primary text-on-primary-fixed px-10 py-4 font-headline font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    {locale === "ar" ? "المرحلة التالية" : "Next Stage"}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle */}
            {activeStep === 1 && (
              <div className="flex flex-col h-full justify-between">
                <div className="mb-8">
                  <h3 className="font-headline text-xl md:text-2xl font-black text-black mb-6 md:mb-8 uppercase italic tracking-tight">
                    {locale === "ar" ? "مواصفات الآلة" : "Machine Specifications"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getVehicleTypes(locale).map((v, i) => (
                      <button
                        key={v.label}
                        type="button"
                        onClick={() => setSelectedVehicle(i)}
                        className={`p-5 md:p-6 transition-all cursor-pointer text-left ${
                          selectedVehicle === i
                            ? "bg-surface-container-highest border border-primary"
                            : "bg-surface-container-low border border-transparent hover:border-outline-variant/50"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined mb-4 ${
                            selectedVehicle === i
                              ? "text-primary"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {v.icon}
                        </span>
                        <p
                          className={`font-headline font-bold uppercase text-sm ${
                            selectedVehicle === i
                              ? "text-black"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {v.label}
                        </p>
                      </button>
                    ))}
                  </div>
                  <input
                    className="mt-6 w-full bg-surface-container border border-black/10 text-black p-4 font-headline placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary transition-all"
                    placeholder={locale === "ar" ? "سنة الموديل ومواصفات المحرك (مثل 2023 HURACAN STO)" : "MODEL YEAR & ENGINE SPEC (E.G. 2023 HURACAN STO)"}
                    type="text"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    aria-label="Vehicle model"
                  />
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-outline-variant/20 mt-auto">
                  <button
                    type="button"
                    onClick={() => setActiveStep(0)}
                    className="text-on-surface-variant hover:text-black font-headline font-bold uppercase tracking-widest text-sm transition-colors"
                  >
                    {locale === "ar" ? "السابق" : "Back"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="bg-primary text-on-primary-fixed px-10 py-4 font-headline font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    {locale === "ar" ? "المرحلة التالية" : "Next Stage"}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Service */}
            {activeStep === 2 && (
              <div className="flex flex-col h-full justify-between">
                <div className="mb-8">
                  <h3 className="font-headline text-xl md:text-2xl font-black text-black mb-6 md:mb-8 uppercase italic tracking-tight">
                    {locale === "ar" ? "اختر الخدمة" : "Select Service"}
                  </h3>
                  {servicesLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : bookingServices.length === 0 ? (
                    <p className="text-on-surface-variant text-sm font-body py-4">
                      {locale === "ar" ? "لا توجد خدمات متاحة للحجز حاليًا. يرجى المحاولة لاحقًا أو الاتصال بنا مباشرة." : "No services are available to book right now. Please try again later or contact us directly."}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[min(420px,50vh)] overflow-y-auto pr-1">
                      {bookingServices.map((s, i) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setSelectedService(i)}
                          className={`p-5 md:p-6 text-left transition-colors cursor-pointer ${
                            selectedService === i
                              ? "bg-surface-container-highest border-2 border-primary"
                              : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container-highest"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span
                              className={`material-symbols-outlined ${selectedService === i ? "text-primary" : "text-on-surface-variant"}`}
                            >
                              {s.icon}
                            </span>
                          </div>
                          <h4 className="font-headline font-bold text-black uppercase text-sm">{s.label}</h4>
                          {s.desc ? (
                            <p className="text-on-surface-variant text-xs mt-2 font-body line-clamp-3">{s.desc}</p>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Optional notes field */}
                  <div className="mt-6 space-y-2">
                    <label className="font-label font-bold text-xs text-on-surface-variant uppercase tracking-widest">
                      {locale === "ar" ? "ملاحظات إضافية (اختياري)" : "Additional Notes (Optional)"}
                    </label>
                    <textarea
                      className="w-full bg-surface-container border border-black/10 text-black p-4 font-headline placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary transition-all resize-none"
                      placeholder={locale === "ar" ? "أي متطلبات خاصة..." : "ANY SPECIAL REQUIREMENTS..."}
                      rows={3}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      aria-label="Additional notes"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-outline-variant/20 mt-auto">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-on-surface-variant hover:text-black font-headline font-bold uppercase tracking-widest text-sm transition-colors"
                  >
                    {locale === "ar" ? "السابق" : "Back"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!servicesLoading && bookingServices.length === 0) {
                        toast.error("No services available to select.");
                        return;
                      }
                      if (!bookingServices[selectedService]?.serviceTypeForApi) {
                        toast.error("Please select a service.");
                        return;
                      }
                      setActiveStep(3);
                    }}
                    disabled={servicesLoading || bookingServices.length === 0}
                    className="bg-primary text-on-primary-fixed px-10 py-4 font-headline font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {locale === "ar" ? "المرحلة التالية" : "Next Stage"}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Date/Time */}
            {activeStep === 3 && (
              <div className="flex flex-col h-full justify-between">
                <div className="mb-8">
                  <h3 className="font-headline text-xl md:text-2xl font-black text-black mb-6 md:mb-8 uppercase italic tracking-tight">
                    {locale === "ar" ? "نافذة الإطلاق (الموعد)" : "Launch Window"}
                  </h3>

                  {/* Dynamic date selector */}
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-6 md:mb-8">
                    {dates.slice(0, 7).map((d, i) => (
                      <button
                        key={d.isoDate}
                        type="button"
                        onClick={() => setSelectedDateIndex(i)}
                        className={`p-3 text-center transition-colors ${
                          selectedDateIndex === i
                            ? "bg-white border-b-2 border-primary text-black"
                            : "bg-surface-container hover:bg-white cursor-pointer"
                        }`}
                      >
                        <p className={`text-xs font-label ${selectedDateIndex === i ? "text-primary font-bold" : "opacity-50"}`}>
                          {d.dayLabel}
                        </p>
                        <p className="font-headline text-sm mt-1">{d.dayNumber}</p>
                      </button>
                    ))}
                  </div>

                  {/* Time slots from API */}
                  {slotsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : dayIsClosed ? (
                    <div className="bg-error-container/10 border border-error/30 p-6 text-center">
                      <span className="material-symbols-outlined text-error text-2xl mb-2 block">event_busy</span>
                      <p className="text-error text-sm font-label uppercase tracking-widest">
                        {locale === "ar" ? "هذا اليوم مغلق أو محجوز بالكامل. يرجى اختيار تاريخ آخر." : "This day is closed or fully booked. Please select another date."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableSlots.map((time, i) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(i)}
                          className={`py-3 px-4 font-headline text-xs font-bold transition-all ${
                            selectedTime === i
                              ? "bg-primary text-white shadow-[0_0_20px_rgba(220,0,0,0.3)]"
                              : "bg-surface-container text-black hover:bg-primary hover:text-white cursor-pointer"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* reCAPTCHA Widget */}
                  {!dayIsClosed && availableSlots.length > 0 && !slotsLoading && (
                    <div className="flex justify-center mt-8">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                        onChange={(token) => setRecaptchaToken(token)}
                      />
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-outline-variant/20 mt-auto">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="text-on-surface-variant hover:text-black font-headline font-bold uppercase tracking-widest text-sm transition-colors"
                  >
                    {locale === "ar" ? "السابق" : "Back"}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || selectedTime === null || dayIsClosed}
                    className={`w-full md:w-auto px-10 md:px-12 py-5 font-headline font-black text-lg md:text-xl uppercase tracking-tighter transition-all shadow-2xl ${
                      submitting || selectedTime === null || dayIsClosed
                        ? "bg-primary/40 text-on-primary-fixed/60 cursor-not-allowed"
                        : "bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed hover:scale-105 active:scale-95"
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-3">
                        <span className="w-5 h-5 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin" />
                        {locale === "ar" ? "جاري الإرسال..." : "SUBMITTING..."}
                      </span>
                    ) : (
                      locale === "ar" ? "بدء الحجز" : "INITIATE BOOKING"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Confirmation Preview */}
        <div className="mt-12 bg-surface-container-low p-8 border border-black/10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">
              task_alt
            </span>
          </div>
          <h5 className="font-headline font-bold text-black text-xl uppercase italic">
            {locale === "ar" ? "تم تأكيد البروتوكول" : "Protocol Confirmed"}
          </h5>
          <p className="text-on-surface-variant text-sm mt-2 max-w-md">
            {locale === "ar" ? "بمجرد التقديم، سيتواصل معك مهندس الأداء في غضون 60 دقيقة للانتهاء من بياناتك." : "Once you submit, a Performance Engineer will contact you within 60 minutes to finalize the telemetry data for your session."}
          </p>
        </div>
      </div>
    </div>
  );
}
