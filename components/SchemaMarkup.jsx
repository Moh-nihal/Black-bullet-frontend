export default function SchemaMarkup({ url, locale = "en" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Black Bullet Garage Performance Dubai",
    "alternateName": locale === "ar" ? "بلاط رصاصة مرآب دبي" : "Black Bullet Garage",
    "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logos/bbg.png`,
    "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/#organization`,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${locale}`,
    "telephone": "+971000000000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Al Quoz Industrial Area",
      "addressLocality": "Dubai",
      "addressRegion": "Dubai",
      "postalCode": "00000",
      "addressCountry": "AE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.1322,
      "longitude": 55.2255
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "20:00"
      }
    ],
    "priceRange": "$$$",
    "sameAs": [
      "https://www.instagram.com/blackbulletgarage"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
