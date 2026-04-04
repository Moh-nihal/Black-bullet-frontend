export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Base static routes for both locales
  const staticRoutes = [
    '',
    '/services',
    '/gallery',
    '/blog',
    '/booking'
  ];

  const routes = [];

  ['en', 'ar'].forEach(locale => {
    staticRoutes.forEach(route => {
      routes.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // Attempt to fetch dynamic routes from the Node.js backend
  try {
     const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
     
     // Dynamic Services
     const servicesRes = await fetch(`${backendUrl}/public/services`, { next: { revalidate: 3600 } });
     if (servicesRes.ok) {
        const services = await servicesRes.json();
        if (Array.isArray(services)) {
          services.forEach(service => {
              ['en', 'ar'].forEach(locale => {
                  routes.push({
                      url: `${baseUrl}/${locale}/services/${service.slug}`,
                      lastModified: new Date(service.updatedAt || new Date()),
                      changeFrequency: 'monthly',
                      priority: 0.7,
                  });
              });
          });
        }
     }

     // Dynamic Blogs
     const blogsRes = await fetch(`${backendUrl}/public/blogs`, { next: { revalidate: 3600 } });
     if (blogsRes.ok) {
        const blogsResult = await blogsRes.json();
        const blogsArray = blogsResult.data || blogsResult; // handling paginated or raw arrays
        if (Array.isArray(blogsArray)) {
            blogsArray.forEach(blog => {
                ['en', 'ar'].forEach(locale => {
                    routes.push({
                        url: `${baseUrl}/${locale}/blog/${blog.slug}`,
                        lastModified: new Date(blog.updatedAt || new Date()),
                        changeFrequency: 'weekly', // blogs change often
                        priority: 0.6,
                    });
                });
            });
        }
     }
  } catch(error) {
     console.error("Sitemap generation error (Dynamic Routes bypassed):", error);
  }

  return routes;
}
