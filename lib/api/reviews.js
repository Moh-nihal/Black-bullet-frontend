export const getGoogleReviews = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/reviews/google`, {
      cache: "no-store"
    });
    if (!res.ok) {
      throw new Error("Failed to fetch Google Reviews");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    return null; // Return null so we can fallback gracefully
  }
};
