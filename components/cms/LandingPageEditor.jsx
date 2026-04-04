"use client";

import FormSection from "./FormSection";
import ImageUpload from "./ImageUpload";
import RepeaterField from "./RepeaterField";

const labelClass = "block font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2";
const inputClass = "w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all placeholder:text-on-surface-variant/70";

export default function ServicesPageEditor({ data, onChange }) {
  const updateField = (section, field, value) => {
    onChange({ ...data, [section]: { ...data[section], [field]: value } });
  };

  const updateService = (index, field, value) => {
    const items = [...data.servicesGrid];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...data, servicesGrid: items });
  };

  const addService = () => {
    onChange({
      ...data,
      servicesGrid: [
        ...data.servicesGrid,
        { num: String(data.servicesGrid.length + 1).padStart(2, "0"), title: "", titleAr: "", img: "", alt: "", desc: "", descAr: "", slug: "" },
      ],
    });
  };

  const removeService = (index) => {
    onChange({ ...data, servicesGrid: data.servicesGrid.filter((_, i) => i !== index) });
  };

  const updateEcuFeature = (index, field, value) => {
    const items = [...data.ecuDetail.features];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...data, ecuDetail: { ...data.ecuDetail, features: items } });
  };

  return (
    <div className="space-y-8">
      {/* Services Hero */}
      <FormSection title="Services Page Hero" icon="web">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Label Text (EN)</label>
            <input type="text" value={data.hero.label} onChange={(e) => updateField("hero", "label", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Label Text (AR)</label>
            <input type="text" dir="rtl" value={data.hero.labelAr || ""} onChange={(e) => updateField("hero", "labelAr", e.target.value)} className={inputClass} placeholder="تسمية النص" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Heading (EN)</label>
            <input type="text" value={data.hero.heading} onChange={(e) => updateField("hero", "heading", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Heading (AR)</label>
            <input type="text" dir="rtl" value={data.hero.headingAr || ""} onChange={(e) => updateField("hero", "headingAr", e.target.value)} className={inputClass} placeholder="العنوان" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Heading Accent Word (EN)</label>
            <input type="text" value={data.hero.accentWord} onChange={(e) => updateField("hero", "accentWord", e.target.value)} className={`${inputClass} text-primary italic`} />
          </div>
          <div>
            <label className={labelClass}>Heading Accent Word (AR)</label>
            <input type="text" dir="rtl" value={data.hero.accentWordAr || ""} onChange={(e) => updateField("hero", "accentWordAr", e.target.value)} className={`${inputClass} text-primary italic`} placeholder="كلمة مميزة" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Description (EN)</label>
            <textarea value={data.hero.description} onChange={(e) => updateField("hero", "description", e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Description (AR)</label>
            <textarea dir="rtl" value={data.hero.descriptionAr || ""} onChange={(e) => updateField("hero", "descriptionAr", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="الوصف..." />
          </div>
        </div>
      </FormSection>

      {/* Services Grid */}
      <FormSection title="Services Grid" icon="grid_view">
        <div className="space-y-4">
          {data.servicesGrid.map((service, index) => (
            <div key={index} className="relative bg-surface-container p-5 group hover:bg-surface-container-high transition-all border-l-2 border-primary/30">
              <div className="absolute -top-3 left-4 px-2 py-0.5 bg-surface-container-highest text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant">
                Service {service.num}
              </div>
              <button onClick={() => removeService(index)}
                className="absolute top-3 right-3 w-7 h-7 bg-error/10 hover:bg-error/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-error">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div className="pt-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Title (EN)</label>
                    <input type="text" value={service.title} onChange={(e) => updateService(index, "title", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Title (AR)</label>
                    <input type="text" dir="rtl" value={service.titleAr || ""} onChange={(e) => updateService(index, "titleAr", e.target.value)} className={inputClass} placeholder="العنوان" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Image Path</label>
                    <input type="text" value={service.img} onChange={(e) => updateService(index, "img", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Slug</label>
                    <input type="text" value={service.slug} onChange={(e) => updateService(index, "slug", e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Description (EN)</label>
                    <input type="text" value={service.desc || ""} onChange={(e) => updateService(index, "desc", e.target.value)} className={inputClass} placeholder="Short service description..." />
                  </div>
                  <div>
                    <label className={labelClass}>Description (AR)</label>
                    <input type="text" dir="rtl" value={service.descAr || ""} onChange={(e) => updateService(index, "descAr", e.target.value)} className={inputClass} placeholder="وصف الخدمة..." />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addService}
          className="mt-4 w-full border-2 border-dashed border-outline-variant/20 hover:border-primary/40 py-3 flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-all group">
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
          <span className="font-headline text-xs font-bold uppercase tracking-widest">Add Service</span>
        </button>
      </FormSection>

      {/* ECU Detail Section */}
      <FormSection title="ECU Detail Section" icon="settings_input_component" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Section Label (EN)</label>
            <input type="text" value={data.ecuDetail.label} onChange={(e) => updateField("ecuDetail", "label", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Section Label (AR)</label>
            <input type="text" dir="rtl" value={data.ecuDetail.labelAr || ""} onChange={(e) => updateField("ecuDetail", "labelAr", e.target.value)} className={inputClass} placeholder="تسمية القسم" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Section Heading (EN)</label>
            <input type="text" value={data.ecuDetail.heading} onChange={(e) => updateField("ecuDetail", "heading", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Section Heading (AR)</label>
            <input type="text" dir="rtl" value={data.ecuDetail.headingAr || ""} onChange={(e) => updateField("ecuDetail", "headingAr", e.target.value)} className={inputClass} placeholder="عنوان القسم" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Paragraph 1 (EN)</label>
            <textarea value={data.ecuDetail.para1} onChange={(e) => updateField("ecuDetail", "para1", e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Paragraph 1 (AR)</label>
            <textarea dir="rtl" value={data.ecuDetail.para1Ar || ""} onChange={(e) => updateField("ecuDetail", "para1Ar", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="الفقرة الأولى..." />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Paragraph 2 (EN)</label>
            <textarea value={data.ecuDetail.para2} onChange={(e) => updateField("ecuDetail", "para2", e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Paragraph 2 (AR)</label>
            <textarea dir="rtl" value={data.ecuDetail.para2Ar || ""} onChange={(e) => updateField("ecuDetail", "para2Ar", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="الفقرة الثانية..." />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Booking button text (EN)</label>
            <input
              type="text"
              value={data.ecuDetail.bookingCtaText || ""}
              onChange={(e) => updateField("ecuDetail", "bookingCtaText", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Booking button text (AR)</label>
            <input
              type="text"
              dir="rtl"
              value={data.ecuDetail.bookingCtaTextAr || ""}
              onChange={(e) => updateField("ecuDetail", "bookingCtaTextAr", e.target.value)}
              className={inputClass}
              placeholder="نص زر الحجز"
            />
          </div>
        </div>
        <div className="space-y-4">
          <label className={labelClass}>Feature Cards</label>
          {data.ecuDetail.features.map((feat, i) => (
            <div key={i} className="bg-surface-container p-4 border-l-2 border-primary/30 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Title (EN)</label>
                  <input type="text" value={feat.title} onChange={(e) => updateEcuFeature(i, "title", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Title (AR)</label>
                  <input type="text" dir="rtl" value={feat.titleAr || ""} onChange={(e) => updateEcuFeature(i, "titleAr", e.target.value)} className={inputClass} placeholder="العنوان" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Description (EN)</label>
                  <input type="text" value={feat.desc} onChange={(e) => updateEcuFeature(i, "desc", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Description (AR)</label>
                  <input type="text" dir="rtl" value={feat.descAr || ""} onChange={(e) => updateEcuFeature(i, "descAr", e.target.value)} className={inputClass} placeholder="الوصف" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      {/* CTA Section */}
      <FormSection title="CTA Section" icon="ads_click" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>CTA Heading (EN)</label>
            <input type="text" value={data.cta.heading} onChange={(e) => updateField("cta", "heading", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>CTA Heading (AR)</label>
            <input type="text" dir="rtl" value={data.cta.headingAr || ""} onChange={(e) => updateField("cta", "headingAr", e.target.value)} className={inputClass} placeholder="عنوان الدعوة" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Accent Word (EN)</label>
            <input type="text" value={data.cta.accentWord} onChange={(e) => updateField("cta", "accentWord", e.target.value)} className={`${inputClass} text-primary italic`} />
          </div>
          <div>
            <label className={labelClass}>Accent Word (AR)</label>
            <input type="text" dir="rtl" value={data.cta.accentWordAr || ""} onChange={(e) => updateField("cta", "accentWordAr", e.target.value)} className={`${inputClass} text-primary italic`} placeholder="كلمة مميزة" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Suffix (EN)</label>
            <input type="text" value={data.cta.suffix || ""} onChange={(e) => updateField("cta", "suffix", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Suffix (AR)</label>
            <input type="text" dir="rtl" value={data.cta.suffixAr || ""} onChange={(e) => updateField("cta", "suffixAr", e.target.value)} className={inputClass} placeholder="اللاحقة" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Primary Button (EN)</label>
            <input type="text" value={data.cta.primaryText} onChange={(e) => updateField("cta", "primaryText", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Primary Button (AR)</label>
            <input type="text" dir="rtl" value={data.cta.primaryTextAr || ""} onChange={(e) => updateField("cta", "primaryTextAr", e.target.value)} className={inputClass} placeholder="نص الزر الأساسي" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Secondary Button (EN)</label>
            <input type="text" value={data.cta.secondaryText} onChange={(e) => updateField("cta", "secondaryText", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Secondary Button (AR)</label>
            <input type="text" dir="rtl" value={data.cta.secondaryTextAr || ""} onChange={(e) => updateField("cta", "secondaryTextAr", e.target.value)} className={inputClass} placeholder="نص الزر الثانوي" />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
