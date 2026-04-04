"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export default function LandingLeadForm({ slug, variantId, apiUrl }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleModel: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      return toast.error("Name and Phone are required.");
    }
    if (!recaptchaToken) {
      return toast.error("Please verify that you are not a robot.");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl || ''}/api/public/landing/${slug}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          variantId,
          recaptchaToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit lead");

      toast.success("Request submitted successfully! Our team will contact you shortly.");
      setFormData({ name: "", phone: "", vehicleModel: "", message: "" });
      setRecaptchaToken(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
      
      // Optionally route to a /thank-you page
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCTA = async (type) => {
    // Fire and forget conversion tracking
    try {
      fetch(`${apiUrl || ''}/api/public/landing/${slug}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, variantId }),
      }).catch(() => {});
    } catch(e) {}
  };

  return (
    <div className="bg-surface/90 backdrop-blur-md p-8 shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-primary/20 w-full relative z-10">
      <div className="text-center mb-8 border-b border-primary/20 pb-6">
        <h2 className="font-headline text-2xl md:text-3xl font-black uppercase text-black mb-2">
          Request Quote
        </h2>
        <p className="font-body text-on-surface-variant text-sm pr-4">
          Fast-track your vehicle's transformation. Get an expert consultation today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
            Full Name *
          </label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-3 text-sm font-body text-black placeholder:text-on-surface-variant/50 transition-colors focus:ring-0"
            placeholder="e.g. Abdullah Al Maktoum"
          />
        </div>

        <div>
          <label className="block font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
            Phone Number *
          </label>
          <input
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-3 text-sm font-body text-black placeholder:text-on-surface-variant/50 transition-colors focus:ring-0"
            placeholder="+971 50 123 4567"
          />
        </div>

        <div>
           <label className="block font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
            Vehicle Profile
          </label>
          <input
            name="vehicleModel"
            type="text"
            value={formData.vehicleModel}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-3 text-sm font-body text-black placeholder:text-on-surface-variant/50 transition-colors focus:ring-0"
            placeholder="Make, Model, Year"
          />
        </div>

        <div className="pb-4">
          <label className="block font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">
            Goals (Optional)
          </label>
          <textarea
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary px-4 py-3 text-sm font-body text-black placeholder:text-on-surface-variant/50 transition-colors focus:ring-0 resize-none"
            placeholder="Looking to add 150BHP and improve exhaust sound..."
          />
        </div>

        <div className="py-2 flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
            onChange={(token) => setRecaptchaToken(token)}
            theme="light"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white font-headline font-black uppercase tracking-widest py-4 text-sm hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? "Submitting..." : "Get Performance Quote"}
            {!isSubmitting && <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        </button>
      </form>
    </div>
  );
}
