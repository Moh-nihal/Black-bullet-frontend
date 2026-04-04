"use client";

import { useState } from "react";
import FormSection from "./FormSection";
import ImageUpload from "./ImageUpload";
import StarRating from "./StarRating";

export default function TestimonialsManager({ data, onChange }) {
  const [editingId, setEditingId] = useState(null);

  const addTestimonial = () => {
    const newItem = {
      id: Date.now(),
      initials: "",
      name: "",
      quote: "",
      rating: 5,
      highlight: false,
      avatar: null,
    };
    onChange([...data, newItem]);
    setEditingId(newItem.id);
  };

  const updateTestimonial = (id, field, value) => {
    onChange(data.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const removeTestimonial = (id) => {
    onChange(data.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <FormSection title="Manage Testimonials" icon="reviews">
        {/* Stats bar — matches dashboard stat cards style */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-surface-container p-6 border-b-2 border-primary-dim">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Total Reviews</p>
            <h3 className="text-3xl font-headline font-bold">{data.length}</h3>
          </div>
          <div className="bg-surface-container p-6 border-b-2 border-tertiary">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">Avg Rating</p>
            <h3 className="text-3xl font-headline font-bold text-primary">
              {data.length ? (data.reduce((s, t) => s + t.rating, 0) / data.length).toFixed(1) : "—"}
            </h3>
          </div>
          <div className="bg-surface-container-highest p-6 flex items-center justify-center">
            <button
              onClick={addTestimonial}
              className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-headline font-bold py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Testimonial
            </button>
          </div>
        </div>

        {/* Testimonial Table / Cards — matching the dashboard booking table */}
        <div className="bg-surface-container">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h2 className="font-headline text-sm font-bold uppercase tracking-widest">All Reviews</h2>
            <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">
              {data.length} entries
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {data.map((testimonial) => {
              const isEditing = editingId === testimonial.id;
              return (
                <div key={testimonial.id} className={`transition-all ${isEditing ? "bg-white/5" : "hover:bg-white/5"}`}>
                  {/* Row */}
                  <div className="flex items-center justify-between px-6 py-4 group">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/20 flex items-center justify-center font-headline font-bold text-primary text-sm shrink-0">
                        {testimonial.initials || testimonial.name?.split(" ").map(n => n[0]).join("") || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-black">{testimonial.name || "Untitled"}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`material-symbols-outlined text-xs ${i < testimonial.rating ? "text-primary" : "text-outline-variant"}`}
                              style={i < testimonial.rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >star</span>
                          ))}
                        </div>
                      </div>
                      <p className="hidden md:block text-sm text-on-surface-variant italic truncate max-w-md ml-4">
                        {testimonial.quote ? `"${testimonial.quote.replace(/"/g, "").substring(0, 80)}..."` : "No review text"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {testimonial.highlight && (
                        <span className="text-[10px] font-bold uppercase px-2 py-1 bg-primary/10 text-primary border border-primary/20">
                          Featured
                        </span>
                      )}
                      <button
                        onClick={() => setEditingId(isEditing ? null : testimonial.id)}
                        className={`w-8 h-8 flex items-center justify-center transition-colors ${
                          isEditing ? "bg-primary/20 text-primary" : "text-on-surface-variant hover:text-black opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{isEditing ? "check" : "edit"}</span>
                      </button>
                      <button
                        onClick={() => removeTestimonial(testimonial.id)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Edit Panel */}
                  {isEditing && (
                    <div className="px-6 pb-6 space-y-5 border-t border-white/5 pt-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">
                            Client Name
                          </label>
                          <input
                            type="text"
                            value={testimonial.name}
                            onChange={(e) => updateTestimonial(testimonial.id, "name", e.target.value)}
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all placeholder:text-on-surface-variant/70"
                          />
                        </div>
                        <div>
                          <label className="block font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">
                            Initials
                          </label>
                          <input
                            type="text"
                            value={testimonial.initials}
                            onChange={(e) => updateTestimonial(testimonial.id, "initials", e.target.value)}
                            maxLength={2}
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all uppercase placeholder:text-on-surface-variant/70"
                            placeholder="e.g. KA"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">
                            Review Text (EN)
                          </label>
                          <textarea
                            value={testimonial.quote}
                            onChange={(e) => updateTestimonial(testimonial.id, "quote", e.target.value)}
                            rows={4}
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all resize-none italic placeholder:text-on-surface-variant/70"
                            placeholder="Client review text..."
                          />
                        </div>
                        <div>
                          <label className="block font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2">
                            Review Text (AR)
                          </label>
                          <textarea
                            dir="rtl"
                            value={testimonial.quoteAr || ""}
                            onChange={(e) => updateTestimonial(testimonial.id, "quoteAr", e.target.value)}
                            rows={4}
                            className="w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all resize-none italic placeholder:text-on-surface-variant/70"
                            placeholder="نص المراجعة..."
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <StarRating
                          label="Rating"
                          value={testimonial.rating}
                          onChange={(val) => updateTestimonial(testimonial.id, "rating", val)}
                        />
                        <div className="flex items-center gap-3">
                          <span className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Featured</span>
                          <button
                            onClick={() => updateTestimonial(testimonial.id, "highlight", !testimonial.highlight)}
                            className={`relative w-12 h-6 transition-colors duration-200 ${
                              testimonial.highlight ? "bg-primary" : "bg-surface-container-highest"
                            }`}
                          >
                            <span className={`absolute top-1 w-4 h-4 transition-all duration-200 ${
                              testimonial.highlight ? "left-7 bg-on-primary" : "left-1 bg-on-surface-variant"
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {data.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-3">rate_review</span>
              <p className="text-sm text-on-surface-variant">No testimonials yet</p>
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
}
