import { useEffect } from 'react';

/**
 * Custom hook to set the document title
 * @param title - The title to set for the page
 */
export const usePageTitle = (title: string) => {
  useEffect(() => {
    // Force set the title multiple times to override any caching
    document.title = title;
    
    // Also update meta description for better SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `${title} - Smart transit management and travel planning system`);
    }

    // Force title update again after a short delay to override any race conditions
    const timeoutId = setTimeout(() => {
      document.title = title;
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [title]);
};
