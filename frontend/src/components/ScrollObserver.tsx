"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const selectors = '.fade-up, .reveal-up, .reveal-left, .reveal-right';

    // Reset all previously observed elements so they can be re-observed on navigation
    document.querySelectorAll(selectors).forEach((el) => {
      el.classList.remove('observed', 'visible');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const observeElements = () => {
      const query = selectors.split(', ').map(s => `${s}:not(.observed)`).join(', ');
      document.querySelectorAll(query).forEach((el) => {
        el.classList.add('observed');
        observer.observe(el);
      });
    };

    // Small delay to allow React to finish rendering the new page
    const timer = setTimeout(() => {
      observeElements();
    }, 50);

    // Catch elements that are rendered later by React
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
