"use client";

import { useEffect, useRef } from "react";

type UseInfiniteScrollOptions = {
  enabled: boolean;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
};

export function useInfiniteScroll({
  enabled,
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = "240px",
}: UseInfiniteScrollOptions) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;

    if (!enabled || !target || !hasMore || isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, hasMore, isLoading, onLoadMore, rootMargin]);

  return targetRef;
}
