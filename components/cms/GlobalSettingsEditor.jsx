"use client";

import FormSection from "./FormSection";

const labelClass = "block font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2";
const inputClass = "w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all placeholder:text-on-surface-variant/70";

export default function GlobalSettingsEditor({ data, onChange }) {
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const updateHours = (index, field, value) => {
    const hours = [...data.workingHours];
    hours[index] = { ...hours[index], [field]: value };
    onChange({ ...data, workingHours: hours });
  };

  const footerEng = Array.isArray(data.footerEngineeringLinks) ? data.footerEngineeringLinks : [];
  const footerConn = Array.isArray(data.footerConnectLinks) ? data.footerConnectLinks : [];

  const updateFooterLink = (listKey, index, field, value) => {
    const arr = [...(Array.isArray(data[listKey]) ? data[listKey] : [])];
    arr[index] = { ...arr[index], [field]: value };
    onChange({ ...data, [listKey]: arr });
  };

  const addFooterLink = (listKey, emptyRow) => {
    const arr = [...(Array.isArray(data[listKey]) ? data[listKey] : [])];
    arr.push(emptyRow);
    onChange({ ...data, [listKey]: arr });
  };

  const removeFooterLink = (listKey, index) => {
    const arr = (Array.isArray(data[listKey]) ? data[listKey] : []).filter((_, i) => i !== index);
    onChange({ ...data, [listKey]: arr });
  };

  return (
    <div className="space-y-8">
      {/* Contact */}
      <FormSection title="Contact Information" icon="call">
        <div>
          <label className={labelClass}>WhatsApp Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-bold">+</span>
            <input type="text" value={data.whatsappNumber} onChange={(e) => updateField("whatsappNumber", e.target.value)}
              className="w-full bg-surface-container-highest border-none text-black pl-8 pr-4 py-3 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all placeholder:text-on-surface-variant/70" />
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1 opacity-60">
            Include country code without + sign. Used in WhatsApp button & Hero CTA.
          </p>
        </div>
      </FormSection>

      {/* SEO */}
      <FormSection title="SEO Defaults" icon="search">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Default Page Title (EN)</label>
            <input type="text" value={data.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} className={inputClass} />
            <div className="flex justify-between mt-1">
              <p className="text-[10px] text-on-surface-variant opacity-60">50–60 characters recommended</p>
              <p className={`text-[10px] font-headline font-bold ${(data.seoTitle?.length || 0) > 60 ? "text-error" : "text-on-surface-variant opacity-60"}`}>
                {data.seoTitle?.length || 0}/60
              </p>
            </div>
          </div>
          <div>
            <label className={labelClass}>Default Page Title (AR)</label>
            <input type="text" dir="rtl" value={data.seoTitleAr || ""} onChange={(e) => updateField("seoTitleAr", e.target.value)} className={inputClass} placeholder="عنوان الصفحة الافتراضي" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Meta Description (EN)</label>
            <textarea value={data.metaDescription} onChange={(e) => updateField("metaDescription", e.target.value)} rows={3} className={`${inputClass} resize-none`} />
            <div className="flex justify-between mt-1">
              <p className="text-[10px] text-on-surface-variant opacity-60">150–160 characters recommended</p>
              <p className={`text-[10px] font-headline font-bold ${(data.metaDescription?.length || 0) > 160 ? "text-error" : "text-on-surface-variant opacity-60"}`}>
                {data.metaDescription?.length || 0}/160
              </p>
            </div>
          </div>
          <div>
            <label className={labelClass}>Meta Description (AR)</label>
            <textarea dir="rtl" value={data.metaDescriptionAr || ""} onChange={(e) => updateField("metaDescriptionAr", e.target.value)} rows={3}
              className={`${inputClass} resize-none`} placeholder="الوصف التعريفي..." />
          </div>
        </div>
      </FormSection>

      {/* Footer */}
      <FormSection title="Footer Content" icon="bottom_navigation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Brand Name (EN)</label>
            <input type="text" value={data.footerBrandName ?? ""} onChange={(e) => updateField("footerBrandName", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Brand Name (AR)</label>
            <input type="text" dir="rtl" value={data.footerBrandNameAr || ""} onChange={(e) => updateField("footerBrandNameAr", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Brand Tagline (EN)</label>
            <textarea value={data.footerTagline} onChange={(e) => updateField("footerTagline", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Brand Tagline (AR)</label>
            <textarea dir="rtl" value={data.footerTaglineAr || ""} onChange={(e) => updateField("footerTaglineAr", e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="الشعار التجاري..." />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Copyright Text (EN)</label>
            <input type="text" value={data.copyrightText} onChange={(e) => updateField("copyrightText", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Copyright Text (AR)</label>
            <input type="text" dir="rtl" value={data.copyrightTextAr || ""} onChange={(e) => updateField("copyrightTextAr", e.target.value)} className={inputClass} placeholder="نص حقوق النشر" />
          </div>
        </div>

        <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant pt-2 border-t border-white/5 mt-4">Column titles</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Engineering column (EN)</label>
            <input type="text" value={data.footerEngineeringTitle ?? ""} onChange={(e) => updateField("footerEngineeringTitle", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Engineering column (AR)</label>
            <input type="text" dir="rtl" value={data.footerEngineeringTitleAr || ""} onChange={(e) => updateField("footerEngineeringTitleAr", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Connect column (EN)</label>
            <input type="text" value={data.footerConnectTitle ?? ""} onChange={(e) => updateField("footerConnectTitle", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Connect column (AR)</label>
            <input type="text" dir="rtl" value={data.footerConnectTitleAr || ""} onChange={(e) => updateField("footerConnectTitleAr", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Newsletter column (EN)</label>
            <input type="text" value={data.footerNewsletterTitle ?? ""} onChange={(e) => updateField("footerNewsletterTitle", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Newsletter column (AR)</label>
            <input type="text" dir="rtl" value={data.footerNewsletterTitleAr || ""} onChange={(e) => updateField("footerNewsletterTitleAr", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Newsletter email placeholder (EN)</label>
            <input type="text" value={data.footerNewsletterPlaceholder ?? ""} onChange={(e) => updateField("footerNewsletterPlaceholder", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Newsletter email placeholder (AR)</label>
            <input type="text" dir="rtl" value={data.footerNewsletterPlaceholderAr || ""} onChange={(e) => updateField("footerNewsletterPlaceholderAr", e.target.value)} className={inputClass} />
          </div>
        </div>

        <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant pt-2 border-t border-white/5 mt-4">Engineering links</p>
        <p className="text-[10px] text-on-surface-variant opacity-60 mb-2">Use paths like /services (locale is added automatically). Full URLs open in a new tab.</p>
        <div className="space-y-3">
          {footerEng.map((row, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end border border-white/5 p-3 rounded">
              <div className="md:col-span-3">
                <label className={labelClass}>Label (EN)</label>
                <input type="text" value={row.label ?? ""} onChange={(e) => updateFooterLink("footerEngineeringLinks", index, "label", e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-3">
                <label className={labelClass}>Label (AR)</label>
                <input type="text" dir="rtl" value={row.labelAr || ""} onChange={(e) => updateFooterLink("footerEngineeringLinks", index, "labelAr", e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-5">
                <label className={labelClass}>Href</label>
                <input type="text" value={row.href ?? ""} onChange={(e) => updateFooterLink("footerEngineeringLinks", index, "href", e.target.value)} className={inputClass} placeholder="/services" />
              </div>
              <div className="md:col-span-1 flex justify-end">
                <button type="button" onClick={() => removeFooterLink("footerEngineeringLinks", index)} className="text-error text-xs font-bold uppercase px-2 py-2 hover:underline">Remove</button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addFooterLink("footerEngineeringLinks", { label: "", labelAr: "", href: "/services" })}
            className="text-primary text-xs font-headline font-bold uppercase tracking-widest hover:underline"
          >
            + Add engineering link
          </button>
        </div>

        <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant pt-2 border-t border-white/5 mt-6">Connect links</p>
        <div className="space-y-3">
          {footerConn.map((row, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end border border-white/5 p-3 rounded">
              <div className="md:col-span-3">
                <label className={labelClass}>Label (EN)</label>
                <input type="text" value={row.label ?? ""} onChange={(e) => updateFooterLink("footerConnectLinks", index, "label", e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-3">
                <label className={labelClass}>Label (AR)</label>
                <input type="text" dir="rtl" value={row.labelAr || ""} onChange={(e) => updateFooterLink("footerConnectLinks", index, "labelAr", e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-5">
                <label className={labelClass}>Href</label>
                <input type="text" value={row.href ?? ""} onChange={(e) => updateFooterLink("footerConnectLinks", index, "href", e.target.value)} className={inputClass} placeholder="/booking or https://..." />
              </div>
              <div className="md:col-span-1 flex justify-end">
                <button type="button" onClick={() => removeFooterLink("footerConnectLinks", index)} className="text-error text-xs font-bold uppercase px-2 py-2 hover:underline">Remove</button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addFooterLink("footerConnectLinks", { label: "", labelAr: "", href: "#" })}
            className="text-primary text-xs font-headline font-bold uppercase tracking-widest hover:underline"
          >
            + Add connect link
          </button>
        </div>

        <p className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant pt-2 border-t border-white/5 mt-6">Footer icon bar</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Share icon URL (optional)</label>
            <input type="text" value={data.footerShareUrl ?? ""} onChange={(e) => updateField("footerShareUrl", e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label className={labelClass}>Location icon URL (optional)</label>
            <input type="text" value={data.footerLocationUrl ?? ""} onChange={(e) => updateField("footerLocationUrl", e.target.value)} className={inputClass} placeholder="Google Maps link" />
          </div>
        </div>
      </FormSection>

      {/* Google Maps */}
      <FormSection title="Google Maps" icon="location_on" defaultOpen={false}>
        <div>
          <label className={labelClass}>Google Maps Embed URL</label>
          <input type="text" value={data.mapsEmbedUrl} onChange={(e) => updateField("mapsEmbedUrl", e.target.value)} className={inputClass} />
        </div>
        {data.mapsEmbedUrl && (
          <div className="bg-surface-container-highest">
            <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">preview</span>
              <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Preview</span>
            </div>
            <div className="aspect-video bg-surface-container flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">map</span>
                <p className="text-xs text-on-surface-variant">Map preview will render here</p>
              </div>
            </div>
          </div>
        )}
      </FormSection>

      {/* Working Hours */}
      <FormSection title="Working Hours" icon="schedule">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-white/5">
                <th className="px-4 py-3 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Day</th>
                <th className="px-4 py-3 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Open</th>
                <th className="px-4 py-3 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Close</th>
                <th className="px-4 py-3 font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.workingHours.map((item, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-black">{item.day}</span>
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" value={item.open} onChange={(e) => updateHours(index, "open", e.target.value)}
                      className="bg-surface-container-highest border-none text-black px-3 py-2 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all w-24 text-center placeholder:text-on-surface-variant/70"
                      placeholder="09:00" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="text" value={item.close} onChange={(e) => updateHours(index, "close", e.target.value)}
                      className="bg-surface-container-highest border-none text-black px-3 py-2 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all w-24 text-center placeholder:text-on-surface-variant/70"
                      placeholder="18:00" />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase ${
                      item.closed ? "bg-error/10 text-error" : "bg-[#10b981]/10 text-[#10b981]"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${item.closed ? "bg-error" : "bg-[#10b981]"}`} />
                      {item.closed ? "Closed" : "Open"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>
    </div>
  );
}
