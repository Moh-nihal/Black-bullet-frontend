export const getHomeContent = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/public/content/home`, {
      cache: "no-store"
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
