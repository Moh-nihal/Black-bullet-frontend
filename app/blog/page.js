"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const fetcher = (url) => fetch(url, { cache: "no-store" }).then((res) => res.json());

// Fallback data
const fallbackArticles = [
  {
    img: "/images/blog-car-night.jpg",
    alt: "Black sleek luxury supercar parked under city lights",
    category: "Custom Projects",
    title: "The Art of the Bespoke Exhaust",
    desc: "Exploring the sonic and performance characteristics of Grade 5 Titanium versus Inconel alloys.",
  },
  {
    img: "/images/blog-parts.jpg",
    alt: "Modern workshop floor with automotive performance parts",
    category: "Maintenance",
    title: "Precision Fluid Engineering",
    desc: "Why high-performance builds require bespoke synthetic blends to combat extreme desert temperatures.",
  },
  {
    img: "/images/blog-carbon.jpg",
    alt: "Extreme close up of high quality carbon fiber weave",
    category: "Industry News",
    title: "Next-Gen Carbon Infusion",
    desc: "How vacuum-sealed autoclave processes are redefining structural rigidity in body panels.",
  },
];

const fallbackCategories = [
  { name: "Tuning Guides", count: 14 },
  { name: "Project Cars", count: 8 },
  { name: "Maintenance", count: 21 },
  { name: "Industry News", count: 5 },
];

const fallbackRecentPosts = [
  { category: "Maintenance", title: "PREPARING YOUR CAR FOR DUBAI SUMMER: THERMAL PROTECTION 101" },
  { category: "Engineering", title: "AERODYNAMIC EFFICIENCY IN CARBON FIBER BODY KITS" },
  { category: "Custom Projects", title: "PROJECT PHANTOM: 1000HP STREET LEGAL GTR BUILD" },
];

export default function BlogPage() {
  const { data } = useSWR(`${API_URL}/api/public/blog?limit=20`, fetcher);
  const blogs = data?.data || [];

  // Use API data if available, else fallback
  const featuredBlog = blogs[0] || null;
  const relatedBlogs = blogs.length > 1 ? blogs.slice(1, 4) : fallbackArticles;
  const recentPosts = blogs.length > 0
    ? blogs.slice(0, 3).map((b) => ({ category: b.category || "General", title: (b.title || "").toUpperCase() }))
    : fallbackRecentPosts;

  return (
    <>
      {/* Hero Article Header */}
      <header className="relative w-full min-h-[70vh] flex items-end pt-28 md:pt-32 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <Image
            src={featuredBlog?.image || "/images/blog-engine.jpg"}
            alt={featuredBlog?.title || "Macro shot of a high performance turbocharged car engine"}
            fill
            className="object-cover opacity-60 mix-blend-luminosity"
            priority
            sizes="100vw"
            unoptimized={!!featuredBlog?.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        <div className="relative z-10 px-4 lg:px-6 pb-12 md:pb-16 max-w-[1200px] mx-auto w-full">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <span className="bg-primary text-on-primary-fixed px-3 py-1 font-label font-bold text-[10px] md:text-xs uppercase tracking-widest">
              {featuredBlog?.category || "Engineering"}
            </span>
            <span className="text-on-surface-variant font-label text-[10px] md:text-xs uppercase tracking-widest">
              {featuredBlog?.createdAt ? new Date(featuredBlog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "June 24, 2024"}
            </span>
          </div>
          <h1 className="font-headline text-[clamp(36px,5vw,72px)] font-black text-on-surface leading-[0.9] tracking-tighter uppercase max-w-4xl mb-6 md:mb-8">
            {featuredBlog?.title || "The Future of ECU Remapping:"}{" "}
            {!featuredBlog && <span className="text-primary italic">Beyond The Dyno</span>}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <p className="font-label text-sm font-bold uppercase tracking-tight">
                {featuredBlog?.author || "Khalid Al-Mansouri"}
              </p>
              <p className="text-on-surface-variant text-xs font-body">
                Chief Performance Architect
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1200px] mx-auto px-4 lg:px-6 py-12 md:py-16 flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Article Body */}
        <article className="flex-1 space-y-10 md:space-y-12">
          <div className="space-y-6 text-on-surface-variant leading-relaxed text-[clamp(14px,1.2vw,18px)] font-body">
            {featuredBlog?.body ? (
              <div dangerouslySetInnerHTML={{ __html: featuredBlog.body }} />
            ) : (
              <>
                <p className="text-on-surface font-medium text-[clamp(16px,1.5vw,22px)] leading-relaxed italic border-l-4 border-primary pl-6 md:pl-8 py-2">
                  In the heart of Dubai&apos;s performance culture, horsepower is no
                  longer just a number—it&apos;s a digital symphony orchestrated through
                  precision software engineering.
                </p>
                <p>
                  ECU (Engine Control Unit) remapping has evolved from simple
                  chip-tuning to a complex multidimensional science. As we push the
                  boundaries of modern internal combustion and hybrid powertrains,
                  the methodology behind our calibrations must reflect the harsh
                  environments of the GCC.
                </p>
                <p>
                  At Black Bullet Garage, we don&apos;t just &quot;flash&quot; a map. We conduct a
                  holistic analysis of thermal dynamics, fuel octane variances
                  specific to the UAE, and the kinetic tolerances of each individual
                  component. The future lies in predictive algorithms that adapt to
                  real-time telemetry data.
                </p>

                {/* Callout Card */}
                <div className="bg-surface-container p-6 md:p-10 my-10 md:my-12 relative overflow-hidden border border-outline-variant/10">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-[80px] md:text-[120px]">
                      settings_input_component
                    </span>
                  </div>
                  <h3 className="font-headline text-[clamp(20px,2vw,28px)] font-bold uppercase tracking-tight text-on-surface mb-6">
                    Key Engineering Focus: Thermal Mitigation
                  </h3>
                  <ul className="space-y-4 font-label text-sm uppercase tracking-wide">
                    {[
                      "Ignition timing adjustment for 50°C+ ambient temperatures",
                      "Torque management optimization to preserve transmission integrity",
                      "Air-fuel ratio enrichment strategies for high-load desert sprints",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="text-primary material-symbols-outlined">bolt</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>
                  The integration of carbon-fiber intake systems and bespoke exhaust
                  manifolds requires a software-first approach. We are entering an
                  era where mechanical upgrades are secondary to the logic gates that
                  control them.
                </p>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-outline-variant/30">
            {(featuredBlog?.tags || ["ECU Tuning", "Dubai Racing", "Performance Tech", "Software"]).map(
              (tag) => (
                <span
                  key={tag}
                  className="text-xs font-label uppercase font-bold text-on-surface-variant px-4 py-2 bg-surface-container-high"
                >
                  {tag}
                </span>
              )
            )}
          </div>
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
              {fallbackCategories.map((cat) => (
                <li
                  key={cat.name}
                  className="group flex justify-between items-center py-2 border-b border-outline-variant/10 cursor-pointer"
                >
                  <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-outline">{cat.count}</span>
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
              {recentPosts.map((post) => (
                <Link
                  key={post.title}
                  href="/blog"
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
          <div className="bg-surface-container-highest p-6 md:p-8 border border-white/5">
            <span className="material-symbols-outlined text-primary text-3xl md:text-4xl mb-4">
              mark_as_unread
            </span>
            <h4 className="font-headline text-lg md:text-xl font-bold uppercase mb-2">
              Performance Intel
            </h4>
            <p className="text-on-surface-variant text-sm mb-6">
              Get the latest engineering insights and tuning updates delivered to
              your inbox.
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

      {/* Related Articles */}
      <section className="bg-surface-container-low py-12 md:py-16 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <h2 className="font-headline text-[clamp(28px,4vw,48px)] font-black uppercase tracking-tighter mb-8 md:mb-10">
            Related <span className="text-primary italic">Intelligence</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {relatedBlogs.map((article) => {
              // Handle both API data (with _id, image) and fallback data (with img)
              const imgSrc = article.image || article.img || "/images/blog-engine.jpg";
              const altText = article.alt || article.title || "Blog post";
              return (
                <Link key={article._id || article.title} href={article.slug ? `/blog/${article.slug}` : "/blog"} className="group cursor-pointer block">
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
    </>
  );
}
