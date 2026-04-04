function withLocaleQuery(url, locale) {
  const loc = locale === "ar" ? "ar" : "en";
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}locale=${encodeURIComponent(loc)}`;
}

export const getHomeContent = async (locale = "en") => {
  try {
    const base = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/public/content/home`;
    const res = await fetch(withLocaleQuery(base, locale), {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch CMS content");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return null;
  }
};

export const getServicesContent = async (locale = "en") => {
  try {
    const base = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/public/content/services`;
    const res = await fetch(withLocaleQuery(base, locale), {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch CMS content for services");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching services page content:", error);
    return null;
  }
};

export const getGalleryContent = async (locale = "en") => {
  try {
    const base = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/public/content/gallery`;
    const res = await fetch(withLocaleQuery(base, locale), {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch CMS content for gallery");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching gallery page content:", error);
    return null;
  }
};
