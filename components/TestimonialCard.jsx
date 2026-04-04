function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`material-symbols-outlined text-yellow-500 ${i < Math.round(rating) ? "filled" : ""}`}>
          star
        </span>
      ))}
    </div>
  );
}

export default function TestimonialCard({ reviewsData }) {
  const isDynamic = !!(reviewsData && reviewsData.reviews && reviewsData.reviews.length > 0);

  if (!isDynamic) {
    return null;
  }

  const displayReviews = reviewsData.reviews.slice(0, 3);
  const overallRating = reviewsData?.rating || 5.0;
  const totalReviewsCount = reviewsData?.totalReviews || 0;

  return (
    <section className="py-16 md:py-20 bg-surface-container-low">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline font-black text-[clamp(24px,3vw,36px)] uppercase tracking-widest text-black">
            Client <span className="text-primary italic">Intelligence</span>
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 bg-black/5 py-2 px-6 border border-black/10">
            <span className="text-yellow-500 font-bold text-lg">⭐ {overallRating}</span>
            <span className="text-on-surface-variant text-sm font-body">({totalReviewsCount} Google Reviews)</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((testimonial, idx) => {
            const isHighlight = idx === 1;
            const authorName = testimonial.author_name;
            const quoteText = `"${testimonial.text}"`;
            const initials = authorName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();
            const timeDesc = testimonial.relative_time_description;
            const profilePhoto = testimonial.profile_photo_url;
            const rating = testimonial.rating;

            return (
              <div
                key={authorName + idx}
                className={`bg-white p-8 border-l-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ${
                  isHighlight ? "border-primary" : "border-black/10"
                } flex flex-col hover:shadow-[0_8px_30px_rgba(220,0,0,0.08)] transition-all`}
              >
                <StarRating rating={rating} />
                <p className="font-body text-[clamp(14px,1.2vw,18px)] text-on-surface-variant italic leading-relaxed mb-6 line-clamp-6">
                  {quoteText}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={authorName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center font-headline font-bold text-primary text-sm flex-shrink-0 rounded-full">
                      {initials}
                    </div>
                  )}
                  <div>
                    <div className="font-headline font-bold text-sm uppercase line-clamp-1 text-black">{authorName}</div>
                    <div className="text-xs text-on-surface-variant">{timeDesc}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
