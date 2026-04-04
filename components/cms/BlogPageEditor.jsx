"use client";

import { useState } from "react";
import FormSection from "./FormSection";
import ImageUpload from "./ImageUpload";

const labelClass = "block font-headline text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant mb-2";
const inputClass = "w-full bg-surface-container-highest border-none text-black px-4 py-3 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all placeholder:text-on-surface-variant/70";

export default function BlogPageEditor({ data, onChange }) {
  const [editingArticle, setEditingArticle] = useState(null);

  const updateField = (section, field, value) => {
    onChange({ ...data, [section]: { ...data[section], [field]: value } });
  };

  const updateArticle = (index, field, value) => {
    const items = [...data.relatedArticles];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...data, relatedArticles: items });
  };

  const addArticle = () => {
    const newItem = { img: "", alt: "", category: "", title: "", titleAr: "", desc: "", descAr: "" };
    onChange({ ...data, relatedArticles: [...data.relatedArticles, newItem] });
    setEditingArticle(data.relatedArticles.length);
  };

  const removeArticle = (index) => {
    onChange({ ...data, relatedArticles: data.relatedArticles.filter((_, i) => i !== index) });
    if (editingArticle === index) setEditingArticle(null);
  };

  const updateCategory = (index, field, value) => {
    const items = [...data.categories];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...data, categories: items });
  };

  const updateRecentPost = (index, field, value) => {
    const items = [...data.recentPosts];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...data, recentPosts: items });
  };

  return (
    <div className="space-y-8">
      {/* Featured Article */}
      <FormSection title="Featured Article (Hero)" icon="newspaper">
        <ImageUpload
          label="Hero Background Image"
          hint="Current: /images/blog-engine.jpg — Recommended 1920×716px"
          value={data.featuredArticle.image}
          onChange={(file) => updateField("featuredArticle", "image", file)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category Badge (EN)</label>
            <input type="text" value={data.featuredArticle.category} onChange={(e) => updateField("featuredArticle", "category", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Category Badge (AR)</label>
            <input type="text" dir="rtl" value={data.featuredArticle.categoryAr || ""} onChange={(e) => updateField("featuredArticle", "categoryAr", e.target.value)} className={inputClass} placeholder="الفئة" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input type="text" value={data.featuredArticle.date} onChange={(e) => updateField("featuredArticle", "date", e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title (EN)</label>
            <input type="text" value={data.featuredArticle.title} onChange={(e) => updateField("featuredArticle", "title", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Title (AR)</label>
            <input type="text" dir="rtl" value={data.featuredArticle.titleAr || ""} onChange={(e) => updateField("featuredArticle", "titleAr", e.target.value)} className={inputClass} placeholder="العنوان" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Accent Phrase (EN)</label>
            <input type="text" value={data.featuredArticle.accentPhrase} onChange={(e) => updateField("featuredArticle", "accentPhrase", e.target.value)} className={`${inputClass} text-primary italic`} />
          </div>
          <div>
            <label className={labelClass}>Accent Phrase (AR)</label>
            <input type="text" dir="rtl" value={data.featuredArticle.accentPhraseAr || ""} onChange={(e) => updateField("featuredArticle", "accentPhraseAr", e.target.value)} className={`${inputClass} text-primary italic`} placeholder="عبارة مميزة" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Author Name</label>
            <input type="text" value={data.featuredArticle.authorName} onChange={(e) => updateField("featuredArticle", "authorName", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Author Title (EN)</label>
            <input type="text" value={data.featuredArticle.authorTitle} onChange={(e) => updateField("featuredArticle", "authorTitle", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Author Title (AR)</label>
            <input type="text" dir="rtl" value={data.featuredArticle.authorTitleAr || ""} onChange={(e) => updateField("featuredArticle", "authorTitleAr", e.target.value)} className={inputClass} placeholder="المسمى الوظيفي" />
          </div>
        </div>
      </FormSection>

      {/* Article Body */}
      <FormSection title="Article Body Content" icon="edit_note">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Lead Quote (EN)</label>
            <textarea value={data.articleBody.leadQuote} onChange={(e) => updateField("articleBody", "leadQuote", e.target.value)} rows={3}
              className={`${inputClass} italic resize-none border-l-4 border-l-primary/30`} />
          </div>
          <div>
            <label className={labelClass}>Lead Quote (AR)</label>
            <textarea dir="rtl" value={data.articleBody.leadQuoteAr || ""} onChange={(e) => updateField("articleBody", "leadQuoteAr", e.target.value)} rows={3}
              className={`${inputClass} italic resize-none border-l-4 border-l-primary/30`} placeholder="الاقتباس الرئيسي..." />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Paragraph 1 (EN)</label>
            <textarea value={data.articleBody.para1} onChange={(e) => updateField("articleBody", "para1", e.target.value)} rows={3}
              className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Paragraph 1 (AR)</label>
            <textarea dir="rtl" value={data.articleBody.para1Ar || ""} onChange={(e) => updateField("articleBody", "para1Ar", e.target.value)} rows={3}
              className={`${inputClass} resize-none`} placeholder="الفقرة الأولى..." />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Paragraph 2 (EN)</label>
            <textarea value={data.articleBody.para2} onChange={(e) => updateField("articleBody", "para2", e.target.value)} rows={3}
              className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Paragraph 2 (AR)</label>
            <textarea dir="rtl" value={data.articleBody.para2Ar || ""} onChange={(e) => updateField("articleBody", "para2Ar", e.target.value)} rows={3}
              className={`${inputClass} resize-none`} placeholder="الفقرة الثانية..." />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Callout Box Heading (EN)</label>
            <input type="text" value={data.articleBody.calloutTitle} onChange={(e) => updateField("articleBody", "calloutTitle", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Callout Box Heading (AR)</label>
            <input type="text" dir="rtl" value={data.articleBody.calloutTitleAr || ""} onChange={(e) => updateField("articleBody", "calloutTitleAr", e.target.value)} className={inputClass} placeholder="عنوان الصندوق البارز" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Closing Paragraph (EN)</label>
            <textarea value={data.articleBody.para3} onChange={(e) => updateField("articleBody", "para3", e.target.value)} rows={3}
              className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Closing Paragraph (AR)</label>
            <textarea dir="rtl" value={data.articleBody.para3Ar || ""} onChange={(e) => updateField("articleBody", "para3Ar", e.target.value)} rows={3}
              className={`${inputClass} resize-none`} placeholder="الفقرة الختامية..." />
          </div>
        </div>
      </FormSection>

      {/* Related Articles */}
      <FormSection title="Related Articles" icon="library_books">
        <div className="bg-surface-container">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h2 className="font-headline text-sm font-bold uppercase tracking-widest">Articles</h2>
            <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">
              {data.relatedArticles.length} entries
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {data.relatedArticles.map((article, index) => {
              const isEditing = editingArticle === index;
              return (
                <div key={index} className={`transition-all ${isEditing ? "bg-white/5" : "hover:bg-white/5"}`}>
                  <div className="flex items-center justify-between px-6 py-4 group">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase px-2 py-1 bg-primary/10 text-primary">{article.category}</span>
                      <p className="text-sm font-bold text-black truncate">{article.title || "Untitled"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingArticle(isEditing ? null : index)}
                        className={`w-8 h-8 flex items-center justify-center transition-colors ${isEditing ? "bg-primary/20 text-primary" : "text-on-surface-variant hover:text-black opacity-0 group-hover:opacity-100"}`}>
                        <span className="material-symbols-outlined text-sm">{isEditing ? "check" : "edit"}</span>
                      </button>
                      <button onClick={() => removeArticle(index)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Title (EN)</label>
                          <input type="text" value={article.title} onChange={(e) => updateArticle(index, "title", e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Title (AR)</label>
                          <input type="text" dir="rtl" value={article.titleAr || ""} onChange={(e) => updateArticle(index, "titleAr", e.target.value)} className={inputClass} placeholder="العنوان" />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Category</label>
                        <input type="text" value={article.category} onChange={(e) => updateArticle(index, "category", e.target.value)} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Description (EN)</label>
                          <textarea value={article.desc} onChange={(e) => updateArticle(index, "desc", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
                        </div>
                        <div>
                          <label className={labelClass}>Description (AR)</label>
                          <textarea dir="rtl" value={article.descAr || ""} onChange={(e) => updateArticle(index, "descAr", e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="الوصف..." />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Image Path</label>
                        <input type="text" value={article.img} onChange={(e) => updateArticle(index, "img", e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={addArticle}
          className="mt-4 w-full border-2 border-dashed border-outline-variant/20 hover:border-primary/40 py-3 flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary transition-all group">
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">add_circle</span>
          <span className="font-headline text-xs font-bold uppercase tracking-widest">Add Article</span>
        </button>
      </FormSection>

      {/* Sidebar */}
      <FormSection title="Blog Sidebar" icon="dashboard_customize" defaultOpen={false}>
        <div>
          <label className={labelClass}>Categories</label>
          <div className="space-y-3">
            {data.categories.map((cat, index) => (
              <div key={index} className="flex items-center gap-3 bg-surface-container p-3">
                <input type="text" value={cat.name} onChange={(e) => updateCategory(index, "name", e.target.value)}
                  className={`flex-1 ${inputClass}`} placeholder="Category (EN)" />
                <input type="text" dir="rtl" value={cat.nameAr || ""} onChange={(e) => updateCategory(index, "nameAr", e.target.value)}
                  className={`flex-1 ${inputClass}`} placeholder="الفئة (AR)" />
                <input type="number" value={cat.count} onChange={(e) => updateCategory(index, "count", parseInt(e.target.value) || 0)}
                  className="w-20 bg-surface-container-highest border-none text-black px-3 py-2 text-sm font-body focus:ring-0 focus:border-b-2 focus:border-primary transition-all text-center" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <label className={labelClass}>Recent Posts</label>
          <div className="space-y-3">
            {data.recentPosts.map((post, index) => (
              <div key={index} className="bg-surface-container p-3 space-y-2">
                <input type="text" value={post.category} onChange={(e) => updateRecentPost(index, "category", e.target.value)} placeholder="Category"
                  className={`${inputClass} text-xs text-primary`} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" value={post.title} onChange={(e) => updateRecentPost(index, "title", e.target.value)} placeholder="Post title (EN)"
                    className={inputClass} />
                  <input type="text" dir="rtl" value={post.titleAr || ""} onChange={(e) => updateRecentPost(index, "titleAr", e.target.value)} placeholder="عنوان المقال (AR)"
                    className={inputClass} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Newsletter Title (EN)</label>
            <input type="text" value={data.newsletter.title} onChange={(e) => updateField("newsletter", "title", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Newsletter Title (AR)</label>
            <input type="text" dir="rtl" value={data.newsletter.titleAr || ""} onChange={(e) => updateField("newsletter", "titleAr", e.target.value)} className={inputClass} placeholder="عنوان النشرة" />
          </div>
          <div>
            <label className={labelClass}>Newsletter Description (EN)</label>
            <textarea value={data.newsletter.description} onChange={(e) => updateField("newsletter", "description", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Newsletter Description (AR)</label>
            <textarea dir="rtl" value={data.newsletter.descriptionAr || ""} onChange={(e) => updateField("newsletter", "descriptionAr", e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="وصف النشرة..." />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
