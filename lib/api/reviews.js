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
    // Silently fallback to mock data since the backend Google Places API route is not yet implemented
    return null; 
  }
};
