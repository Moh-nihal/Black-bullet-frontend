"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

const vehicleTypes = [
  { icon: "directions_car", label: "Supercar / Exotic" },
  { icon: "sports_motorsports", label: "Hyper Performance" },
  { icon: "precision_manufacturing", label: "Custom Build" },
];

const serviceProtocols = [
  {
    icon: "bolt",
    label: "ECU STAGE 2 REMAP",
    desc: "Complete optimization for exhaust & intake hardware.",
    elite: true,
  },
  {
    icon: "format_paint",
    label: "CARBON AERO FIT",
    desc: "Precision installation of high-modulus carbon kits.",
    elite: false,
  },
];

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
  const [activeStep, setActiveStep] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [selectedService, setSelectedService] = useState(0);
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

  const fetchSlots = useCallback(async (isoDate) => {
    setSlotsLoading(true);
    setSelectedTime(null);
    setDayIsClosed(false);
    try {
      const res = await api.get(`/bookings/slots?date=${isoDate}`);
      const data = res.data?.data;
      if (data?.closed || !data?.slots?.length) {
        setDayIsClosed(true);
        setAvailableSlots([]);
      } else {
        setAvailableSlots(data.slots);
      }
    } catch {
      // Use fallback slots if API fails
      setAvailableSlots(FALLBACK_SLOTS);
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
    { num: "01", stage: "Stage One", label: "Personal Identity" },
    { num: "02", stage: "Stage Two", label: "Vehicle Profile" },
    { num: "03", stage: "Stage Three", label: "Service Scope" },
    { num: "04", stage: "Stage Four", label: "Tactical Timing" },
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

    setSubmitting(true);
    try {
      const selectedDate = dates[selectedDateIndex];
      await api.post("/bookings", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        model: formData.model.trim(),
        vehicleTypeIndex: selectedVehicle,
        serviceTypeIndex: selectedService,
        preferredDate: selectedDate.isoDate,
        preferredTime: availableSlots[selectedTime],
        preferredDateLabel: `${selectedDate.dayLabel} ${selectedDate.dayNumber}`,
        notes: formData.notes.trim(),
      });
      toast.success("Booking submitted! A Performance Engineer will contact you soon.");
      setSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to submit booking";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-surface-container p-12 text-center space-y-6 max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-primary text-4xl">task_alt</span>
        </div>
        <h3 className="font-headline font-black text-2xl text-white uppercase italic">
          Booking Confirmed
        </h3>
        <p className="text-on-surface-variant text-sm max-w-md mx-auto">
          Your booking has been submitted successfully. A Performance Engineer will contact you
          within 60 minutes to finalize the details for your session.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-on-primary-fixed px-8 py-4 font-headline font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all mt-4"
        >
          Return to Home
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
          className="bg-surface-container p-6 md:p-8 lg:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div
            className="absolute top-0 left-0 h-1 bg-primary shadow-[0_0_15px_#ff8f73] transition-all duration-500"
            style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
          />

          <div className="pt-8 min-h-[400px]">
            {/* Step 1: Personal */}
            {activeStep === 0 && (
              <div className="flex flex-col h-full justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="font-label font-bold text-xs text-on-surface-variant uppercase tracking-widest">
                      Pilot Name
                    </label>
                    <input
                      className="w-full bg-surface-container-highest border-none text-white p-4 font-headline placeholder:text-outline-variant focus:ring-1 focus:ring-primary transition-all"
                      placeholder="FULL NAME"
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
                      Contact Signal
                    </label>
                    <input
                      className="w-full bg-surface-container-highest border-none text-white p-4 font-headline placeholder:text-outline-variant focus:ring-1 focus:ring-primary transition-all"
                      placeholder="EMAIL ADDRESS"
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
                    Next Stage
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle */}
            {activeStep === 1 && (
              <div className="flex flex-col h-full justify-between">
                <div className="mb-8">
                  <h3 className="font-headline text-xl md:text-2xl font-black text-white mb-6 md:mb-8 uppercase italic tracking-tight">
                    Machine Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vehicleTypes.map((v, i) => (
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
                              ? "text-white"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {v.label}
                        </p>
                      </button>
                    ))}
                  </div>
                  <input
                    className="mt-6 w-full bg-surface-container-highest border-none text-white p-4 font-headline placeholder:text-outline-variant focus:ring-1 focus:ring-primary transition-all"
                    placeholder="MODEL YEAR & ENGINE SPEC (E.G. 2023 HURACAN STO)"
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
                    className="text-on-surface-variant hover:text-white font-headline font-bold uppercase tracking-widest text-sm transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="bg-primary text-on-primary-fixed px-10 py-4 font-headline font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    Next Stage
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Service */}
            {activeStep === 2 && (
              <div className="flex flex-col h-full justify-between">
                <div className="mb-8">
                  <h3 className="font-headline text-xl md:text-2xl font-black text-white mb-6 md:mb-8 uppercase italic tracking-tight">
                    Select Protocol
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceProtocols.map((s, i) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setSelectedService(i)}
                        className={`p-5 md:p-6 text-left transition-colors cursor-pointer ${
                          selectedService === i
                            ? "bg-surface-container-highest border-2 border-primary"
                            : "bg-surface-container-low border-2 border-transparent hover:bg-surface-container-highest"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className={`material-symbols-outlined ${selectedService === i ? "text-primary" : "text-on-surface-variant"}`}>
                            {s.icon}
                          </span>
                          {s.elite && (
                            <span className="font-label text-[10px] bg-primary text-on-primary-fixed px-2 py-0.5 font-black uppercase">
                              Elite
                            </span>
                          )}
                        </div>
                        <h4 className="font-headline font-bold text-white uppercase text-sm">
                          {s.label}
                        </h4>
                        <p className="text-on-surface-variant text-xs mt-2 font-body">
                          {s.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Optional notes field */}
                  <div className="mt-6 space-y-2">
                    <label className="font-label font-bold text-xs text-on-surface-variant uppercase tracking-widest">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      className="w-full bg-surface-container-highest border-none text-white p-4 font-headline placeholder:text-outline-variant focus:ring-1 focus:ring-primary transition-all resize-none"
                      placeholder="ANY SPECIAL REQUIREMENTS..."
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
                    className="text-on-surface-variant hover:text-white font-headline font-bold uppercase tracking-widest text-sm transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="bg-primary text-on-primary-fixed px-10 py-4 font-headline font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    Next Stage
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Date/Time */}
            {activeStep === 3 && (
              <div className="flex flex-col h-full justify-between">
                <div className="mb-8">
                  <h3 className="font-headline text-xl md:text-2xl font-black text-white mb-6 md:mb-8 uppercase italic tracking-tight">
                    Launch Window
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
                            ? "bg-surface-bright border-b-2 border-primary text-white"
                            : "bg-surface-container-highest hover:bg-surface-bright cursor-pointer"
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
                        This day is closed or fully booked. Please select another date.
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
                              ? "bg-primary text-on-primary-fixed shadow-[0_0_20px_rgba(255,143,115,0.3)]"
                              : "bg-surface-container-highest text-white hover:bg-primary hover:text-on-primary-fixed cursor-pointer"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-outline-variant/20 mt-auto">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="text-on-surface-variant hover:text-white font-headline font-bold uppercase tracking-widest text-sm transition-colors"
                  >
                    Back
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
                        SUBMITTING...
                      </span>
                    ) : (
                      "INITIATE BOOKING"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Confirmation Preview */}
        <div className="mt-12 bg-surface-container-low p-8 border border-white/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">
              task_alt
            </span>
          </div>
          <h5 className="font-headline font-bold text-white text-xl uppercase italic">
            Protocol Confirmed
          </h5>
          <p className="text-on-surface-variant text-sm mt-2 max-w-md">
            Once you submit, a Performance Engineer will contact you within 60
            minutes to finalize the telemetry data for your session.
          </p>
        </div>
      </div>
    </div>
  );
}
