"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import { localizeBlogLanding } from "@/lib/localizeCmsBlog";

// Use the Next.js rewrite proxy so client-side requests work consistently
// even when the backend is on a different host/port.
const API_URL = "";

const fetcher = (url) => fetch(url, { cache: "no-store" }).then((res) => res.json());

const isNonEmptyObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0;

export default function BlogPage() {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const localeQs = `locale=${encodeURIComponent(locale)}`;
  const { data, error } = useSWR(`${API_URL}/api/public/blog?limit=20&${localeQs}`, fetcher);
  const { data: cmsRes } = useSWR(`${API_URL}/api/public/content/blog?${localeQs}`, fetcher);

  const blogs = data?.data || [];
  const hasBlogs = blogs.length > 0;

  const cmsPayload = cmsRes?.data;
  const hasCms = isNonEmptyObject(cmsPayload && typeof cmsPayload === "object" ? cmsPayload : {});
  const cmsData = useMemo(
    () => localizeBlogLanding(cmsPayload && typeof cmsPayload === "object" ? cmsPayload : {}, locale),
    [cmsPayload, locale]
  );
  const useCmsLanding = hasCms;

  // IMPORTANT: If there are no blogs, do NOT show fallback/demo content.
  const featuredBlog = hasBlogs ? blogs[0] : null;
  const relatedBlogs = blogs.length > 1 ? blogs.slice(1, 4) : [];
  const recentPosts = hasBlogs
    ? blogs.slice(0, 3).map((b) => ({
        category: b.category || "General",
        title: (b.title || "").toUpperCase(),
        slug: b.slug,
      }))
    : [];

  const categoryCounts = hasBlogs
    ? blogs.reduce((acc, b) => {
        const name = b.category || "General";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {})
    : {};

  const categoriesList = hasBlogs
    ? Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    : [];

  const heroCategory = useCmsLanding ? cmsData?.featuredArticle?.category : featuredBlog?.category;
  const heroDate = useCmsLanding
    ? cmsData?.featuredArticle?.date
    : featuredBlog?.createdAt
      ? new Date(featuredBlog.createdAt).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;

  const heroTitle = useCmsLanding ? cmsData?.featuredArticle?.title : featuredBlog?.title;
  const heroAccentPhrase = cmsData?.featuredArticle?.accentPhrase;
  const heroAuthor = useCmsLanding ? cmsData?.featuredArticle?.authorName : featuredBlog?.author;
  const heroAuthorTitle = cmsData?.featuredArticle?.authorTitle;
  const heroImage = useCmsLanding ? cmsData?.featuredArticle?.image : featuredBlog?.image;

  const cmsRelatedArticles = Array.isArray(cmsData?.relatedArticles) ? cmsData.relatedArticles : [];
  const cmsCategories = Array.isArray(cmsData?.categories) ? cmsData.categories : [];
  const cmsRecentPosts = Array.isArray(cmsData?.recentPosts) ? cmsData.recentPosts : [];
  const cmsNewsletter = cmsData?.newsletter || {};

  return (
    <>
      {error && (
        <main className="max-w-[1200px] mx-auto px-4 lg:px-6 pt-28 md:pt-32 pb-16">
          <header className="mb-10 md:mb-12">
            <h1 className="font-headline text-[clamp(42px,5vw,72px)] font-black uppercase tracking-tighter">
              Blog <span className="text-primary italic">Intel</span>
            </h1>
            <p className="font-body text-on-surface-variant max-w-2xl mt-4">
              Failed to load blog posts.
            </p>
          </header>
          <div className="bg-error/10 border border-error/30 p-6 md:p-8 text-on-surface-variant">
            {String(error?.message || error)}
          </div>
        </main>
      )}

      {!hasBlogs && !hasCms && (
        <main className="max-w-[1200px] mx-auto px-4 lg:px-6 pt-28 md:pt-32 pb-16">
          <header className="mb-10 md:mb-12">
            <h1 className="font-headline text-[clamp(42px,5vw,72px)] font-black uppercase tracking-tighter">
              Blog <span className="text-primary italic">Intel</span>
            </h1>
            <p className="font-body text-on-surface-variant max-w-2xl mt-4">
              No blog posts published yet.
            </p>
          </header>
          <div className="bg-surface-container border border-outline-variant/20 p-10 md:p-14 text-center text-on-surface-variant font-label uppercase tracking-widest">
            Coming soon.
          </div>
        </main>
      )}

      {(hasBlogs || hasCms) && !error && (
        <>
          {/* Hero Article Header */}
          <header className="relative w-full min-h-[70vh] flex items-end pt-28 md:pt-32 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0 bg-black">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={heroTitle || ""}
              fill
              className="object-cover opacity-60 mix-blend-luminosity"
              priority
              sizes="100vw"
              unoptimized={typeof heroImage === "string" && heroImage.startsWith("http")}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 px-4 lg:px-6 pb-12 md:pb-16 max-w-[1200px] mx-auto w-full">
          {(heroCategory || heroDate) && (
            <div className="flex items-center gap-4 mb-4 md:mb-6 flex-wrap">
              {heroCategory ? (
                <span className="bg-primary text-on-primary-fixed px-3 py-1 font-label font-bold text-[10px] md:text-xs uppercase tracking-widest">
                  {heroCategory}
                </span>
              ) : null}
              {heroDate ? (
                <span className="text-white/90 font-label text-[10px] md:text-xs uppercase tracking-widest">{heroDate}</span>
              ) : null}
            </div>
          )}
          {(heroTitle || (useCmsLanding && heroAccentPhrase)) && (
            <h1 className="font-headline text-[clamp(36px,5vw,72px)] font-black text-white leading-[0.9] tracking-tighter uppercase max-w-4xl mb-6 md:mb-8">
              {heroTitle ? `${heroTitle} ` : null}
              {useCmsLanding && heroAccentPhrase ? (
                <span className="text-primary italic">{heroAccentPhrase}</span>
              ) : null}
            </h1>
          )}
          {(heroAuthor || heroAuthorTitle) && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div>
                {heroAuthor ? (
                  <p className="font-label text-sm font-bold uppercase tracking-tight text-white">{heroAuthor}</p>
                ) : null}
                {heroAuthorTitle ? <p className="text-white/70 text-xs font-body">{heroAuthorTitle}</p> : null}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1200px] mx-auto px-4 lg:px-6 py-12 md:py-16 flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Article Body */}
        <article className="flex-1 space-y-10 md:space-y-12">
          <div className="space-y-6 text-on-surface-variant leading-relaxed text-[clamp(14px,1.2vw,18px)] font-body">
            {!useCmsLanding && featuredBlog?.body ? (
              <div dangerouslySetInnerHTML={{ __html: featuredBlog.body }} />
            ) : useCmsLanding && cmsData?.articleBody ? (
              <>
                {cmsData.articleBody.leadQuote && (
                  <p className="text-on-surface font-medium text-[clamp(16px,1.5vw,22px)] leading-relaxed italic border-l-4 border-primary pl-6 md:pl-8 py-2">
                    {cmsData.articleBody.leadQuote}
                  </p>
                )}
                {cmsData.articleBody.para1 && <p>{cmsData.articleBody.para1}</p>}
                {cmsData.articleBody.para2 && <p>{cmsData.articleBody.para2}</p>}
                {cmsData.articleBody.calloutTitle && (
                  <div className="bg-surface-container p-6 md:p-10 my-10 md:my-12 relative overflow-hidden border border-outline-variant/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <span className="material-symbols-outlined text-[80px] md:text-[120px]">
                        settings_input_component
                      </span>
                    </div>
                    <h3 className="font-headline text-[clamp(20px,2vw,28px)] font-bold uppercase tracking-tight text-on-surface mb-6">
                      {cmsData.articleBody.calloutTitle}
                    </h3>
                  </div>
                )}
                {cmsData.articleBody.para3 && <p>{cmsData.articleBody.para3}</p>}
              </>
            ) : null}
          </div>

          {/* Tags */}
          {!useCmsLanding && featuredBlog?.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-8 border-t border-outline-variant/30">
              {featuredBlog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-label uppercase font-bold text-on-surface-variant px-4 py-2 bg-surface-container-high"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-12 md:space-y-16">
          {/* Categories */}
          <section>
            <h4 className="font-headline text-lg font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary" />
              Categories
            </h4>
            <ul className="space-y-4">
              {(hasBlogs ? categoriesList : cmsCategories).map((cat, idx) => (
                <li
                  key={`${cat?.name || cat || "category"}-${idx}`}
                  className="group flex justify-between items-center py-2 border-b border-outline-variant/10 cursor-pointer"
                >
                  <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors">
                    {cat.name || cat}
                  </span>
                  <span className="text-xs text-outline">{cat.count ?? ""}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Posts */}
          <section>
            <h4 className="font-headline text-lg font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-primary" />
              Recent Posts
            </h4>
            <div className="space-y-6 md:space-y-8">
              {(hasBlogs ? recentPosts : cmsRecentPosts).map((post, idx) => (
                <Link
                  key={`${post.title || "post"}-${idx}`}
                  href={post.slug ? `/${locale}/blog/${post.slug}` : `/${locale}/blog`}
                  className="group block space-y-2"
                >
                  <p className="font-label text-xs uppercase text-primary font-bold">
                    {post.category}
                  </p>
                  <h5 className="font-headline text-sm md:text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h5>
                </Link>
              ))}
            </div>
          </section>

          {/* Newsletter */}
          <div className="bg-surface-container-low p-6 md:p-8 border border-black/10">
            <span className="material-symbols-outlined text-primary text-3xl md:text-4xl mb-4">
              mark_as_unread
            </span>
            <h4 className="font-headline text-lg md:text-xl font-bold uppercase mb-2">
              {cmsNewsletter.title || "Performance Intel"}
            </h4>
            <p className="text-on-surface-variant text-sm mb-6">
              {cmsNewsletter.description || "Get the latest engineering insights and tuning updates delivered to your inbox."}
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                className="w-full bg-surface-container border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 text-sm font-label p-3 text-on-surface placeholder:text-outline-variant transition-all"
                placeholder="EMAIL ADDRESS"
                type="email"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="w-full bg-primary py-3 text-on-primary-fixed font-label font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </aside>
      </main>

      {/* Latest Posts (Admin Blog) */}
      {hasBlogs ? (
        <section className="bg-surface-container-low py-12 md:py-16 border-t border-black/10">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
            <h2 className="font-headline text-[clamp(28px,4vw,48px)] font-black uppercase tracking-tighter mb-8 md:mb-10">
              Latest <span className="text-primary italic">Posts</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {blogs.slice(0, 6).map((b) => {
                const imgSrc = b.image || "/images/blog-engine.jpg";
                const altText = b.title || "Blog post";
                const href = b.slug ? `/${locale}/blog/${b.slug}` : `/${locale}/blog`;
                return (
                  <Link key={b._id || b.slug || b.title} href={href} className="group cursor-pointer block">
                    <div className="relative aspect-video overflow-hidden mb-4 md:mb-6 bg-surface-container-highest">
                      <Image
                        src={imgSrc}
                        alt={altText}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={typeof imgSrc === "string" && imgSrc.startsWith("http")}
                      />
                    </div>
                    <p className="font-label text-xs uppercase text-primary font-bold mb-2">
                      {b.category || "General"}
                    </p>
                    <h3 className="font-headline text-lg md:text-xl font-bold text-on-surface uppercase group-hover:text-primary transition-colors leading-tight mb-3 md:mb-4">
                      {b.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm line-clamp-2">
                      {b.shortDesc || ""}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-surface-container-low py-10 md:py-12 border-t border-black/10">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
            <h2 className="font-headline text-xl md:text-2xl font-black uppercase tracking-widest text-primary mb-4">
              Latest Posts
            </h2>
            <p className="text-on-surface-variant">
              No published blog posts yet. Posts created in the admin panel must be <span className="text-on-surface font-semibold">Published</span> to appear here.
            </p>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {((hasBlogs && relatedBlogs.length > 0) || (!hasBlogs && cmsRelatedArticles.length > 0)) && (
      <section className="bg-surface-container-low py-12 md:py-16 border-t border-black/10">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <h2 className="font-headline text-[clamp(28px,4vw,48px)] font-black uppercase tracking-tighter mb-8 md:mb-10">
            Related <span className="text-primary italic">Intelligence</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {(hasBlogs ? relatedBlogs : cmsRelatedArticles).map((article) => {
              // Handle both API data (with _id, image) and fallback data (with img)
              const imgSrc = article.image || article.img || "/images/blog-engine.jpg";
              const altText = article.alt || article.title || "Blog post";
              return (
                <Link key={article._id || article.title} href={article.slug ? `/${locale}/blog/${article.slug}` : `/${locale}/blog`} className="group cursor-pointer block">
                  <div className="relative aspect-video overflow-hidden mb-4 md:mb-6 bg-surface-container-highest">
                    <Image
                      src={imgSrc}
                      alt={altText}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={imgSrc.startsWith("http")}
                    />
                  </div>
                  <p className="font-label text-xs uppercase text-primary font-bold mb-2">
                    {article.category || "General"}
                  </p>
                  <h3 className="font-headline text-lg md:text-xl font-bold text-on-surface uppercase group-hover:text-primary transition-colors leading-tight mb-3 md:mb-4">
                    {article.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2">
                    {article.shortDesc || article.desc || ""}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      )}
        </>
      )}
    </>
  );
}
