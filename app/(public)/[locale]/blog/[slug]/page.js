"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";

const API_URL = "";
const fetcher = (url) => fetch(url, { cache: "no-store" }).then((res) => res.json());

const dateLocaleTag = (locale) => (locale === "ar" ? "ar-AE" : "en-US");

export default function BlogDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const localeQs = `locale=${encodeURIComponent(locale)}`;

  const { data, error, isLoading } = useSWR(
    slug ? `/api/public/blog/${encodeURIComponent(slug)}?${localeQs}` : null,
    fetcher
  );
  const blog = data?.data || null;

  // Fetch all blogs for sidebar (categories + recent posts)
  const { data: allBlogsData } = useSWR(`${API_URL}/api/public/blog?limit=50&${localeQs}`, fetcher);
  const allBlogs = allBlogsData?.data || [];

  // Compute dynamic category counts
  const categoryCounts = allBlogs.reduce((acc, b) => {
    const name = b.category || "General";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const categoriesList = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Recent posts (top 5, excluding current)
  const recentPosts = allBlogs
    .filter((b) => b.slug !== slug)
    .slice(0, 5)
    .map((b) => ({
      category: b.category || "General",
      title: (b.title || "").toUpperCase(),
      slug: b.slug,
    }));

  if (isLoading) {
    return (
      <main className="max-w-[1200px] mx-auto px-4 lg:px-6 pt-28 md:pt-32 pb-16">
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="max-w-[1200px] mx-auto px-4 lg:px-6 pt-28 md:pt-32 pb-16">
        <h1 className="font-headline text-[clamp(36px,5vw,60px)] font-black uppercase tracking-tighter">
          Blog <span className="text-primary italic">Not Found</span>
        </h1>
        <p className="text-on-surface-variant mt-4">This post doesn't exist or isn't published yet.</p>
        {error && (
          <div className="mt-6 bg-error/10 border border-error/30 p-4 text-on-surface-variant">
            {String(error?.message || error)}
          </div>
        )}
        <Link href={`/${locale}/blog`} className="inline-block mt-8 text-primary font-label uppercase tracking-widest text-xs">
          {locale === "ar" ? "← العودة إلى المدونة" : "← Back to Blog"}
        </Link>
      </main>
    );
  }

  const heroImage = blog.image || "/images/blog-engine.jpg";
  const hasContentSections = Array.isArray(blog.contentSections) && blog.contentSections.some(s => s.body?.trim());

  return (
    <>
      {/* Hero Header */}
      <header className="relative w-full min-h-[60vh] flex items-end pt-28 md:pt-32 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={blog.title || "Blog post"}
            fill
            className="object-cover opacity-60 mix-blend-luminosity"
            priority
            sizes="100vw"
            unoptimized={typeof heroImage === "string" && heroImage.startsWith("http")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 px-4 lg:px-6 pb-12 md:pb-16 max-w-[1200px] mx-auto w-full">
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-white hover:text-primary text-xs uppercase tracking-widest font-bold mb-6 bg-black/30 px-4 py-2 backdrop-blur-sm transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {locale === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
          </Link>
          <div className="flex items-center gap-4 mt-6 mb-4 md:mb-6">
            <span className="bg-primary text-on-primary-fixed px-3 py-1 font-label font-bold text-[10px] md:text-xs uppercase tracking-widest">
              {blog.category || "General"}
            </span>
            <span className="text-white/90 font-label text-[10px] md:text-xs uppercase tracking-widest">
              {blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString(dateLocaleTag(locale), {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>
          <h1 className="font-headline text-[clamp(36px,5vw,72px)] font-black text-white leading-[0.9] tracking-tighter uppercase max-w-4xl">
            {blog.title}{" "}
            {blog.accentPhrase && <span className="text-primary italic">{blog.accentPhrase}</span>}
          </h1>
          {blog.shortDesc && (
            <p className="text-white/70 mt-6 max-w-3xl">{blog.shortDesc}</p>
          )}
          {/* Author Info */}
          {(blog.author || blog.authorTitle) && (
            <div className="flex items-center gap-4 mt-8">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div>
                {blog.author && (
                  <p className="font-label text-sm font-bold uppercase tracking-tight text-white">{blog.author}</p>
                )}
                {blog.authorTitle && (
                  <p className="text-white/70 text-xs font-body">{blog.authorTitle}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content + Sidebar */}
      <main className="max-w-[1200px] mx-auto px-4 lg:px-6 py-12 md:py-16 flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Article Body */}
        <article className="flex-1 space-y-10 md:space-y-12">
          <div className="space-y-6 text-on-surface-variant leading-relaxed text-[clamp(14px,1.2vw,18px)] font-body">
            {/* Lead Quote */}
            {blog.leadQuote && (
              <p className="text-on-surface font-medium text-[clamp(16px,1.5vw,22px)] leading-relaxed italic border-l-4 border-primary pl-6 md:pl-8 py-2">
                {blog.leadQuote}
              </p>
            )}

            {/* Structured Content Sections */}
            {hasContentSections ? (
              <>
                {blog.contentSections.map((section, idx) => (
                  <div key={idx}>
                    {section.heading && (
                      <h3 className="font-headline text-[clamp(18px,1.8vw,24px)] font-bold uppercase tracking-tight text-on-surface mb-4">
                        {section.heading}
                      </h3>
                    )}
                    {section.body && <p className="whitespace-pre-line">{section.body}</p>}
                  </div>
                ))}
              </>
            ) : blog.body ? (
              <div dangerouslySetInnerHTML={{ __html: blog.body }} />
            ) : (
              <div className="whitespace-pre-line">{blog.content || ""}</div>
            )}

            {/* Callout Box */}
            {blog.calloutTitle && (
              <div className="bg-surface-container p-6 md:p-10 my-10 md:my-12 relative overflow-hidden border border-outline-variant/10">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-[80px] md:text-[120px]">
                    settings_input_component
                  </span>
                </div>
                <h3 className="font-headline text-[clamp(20px,2vw,28px)] font-bold uppercase tracking-tight text-on-surface mb-6">
                  {blog.calloutTitle}
                </h3>
              </div>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-8 border-t border-outline-variant/30">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-label uppercase font-bold text-on-surface-variant px-4 py-2 bg-surface-container-high"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-12 md:space-y-16">
          {/* Categories */}
          {categoriesList.length > 0 && (
            <section>
              <h4 className="font-headline text-lg font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-primary" />
                Categories
              </h4>
              <ul className="space-y-4">
                {categoriesList.map((cat, idx) => (
                  <li
                    key={`${cat.name}-${idx}`}
                    className="group flex justify-between items-center py-2 border-b border-outline-variant/10 cursor-pointer"
                  >
                    <Link
                      href={`/${locale}/blog?category=${encodeURIComponent(cat.name)}`}
                      className="font-label text-sm uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </Link>
                    <span className="text-xs font-bold text-outline bg-surface-container-highest px-2 py-0.5">
                      {cat.count}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <section>
              <h4 className="font-headline text-lg font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-primary" />
                Recent Posts
              </h4>
              <div className="space-y-6 md:space-y-8">
                {recentPosts.map((post, idx) => (
                  <Link
                    key={`${post.title}-${idx}`}
                    href={`/${locale}/blog/${post.slug}`}
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
          )}

          {/* Newsletter */}
          <div className="bg-surface-container-low p-6 md:p-8 border border-black/10">
            <span className="material-symbols-outlined text-primary text-3xl md:text-4xl mb-4">
              mark_as_unread
            </span>
            <h4 className="font-headline text-lg md:text-xl font-bold uppercase mb-2">
              Performance Intel
            </h4>
            <p className="text-on-surface-variant text-sm mb-6">
              Get the latest engineering insights and tuning updates delivered to your inbox.
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
    </>
  );
}
