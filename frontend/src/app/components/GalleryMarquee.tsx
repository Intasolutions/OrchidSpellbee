"use client";

import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/config";

interface GalleryItem {
  id: number;
  title: string;
  media_file: string;
  is_video: boolean;
  order: number;
}

export default function GalleryMarquee() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/gallery/`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching gallery:", err));
  }, []);

  if (items.length === 0) return null;

  // Duplicate enough times to always fill the screen and loop seamlessly
  const copies = Math.max(6, Math.ceil(12 / items.length));
  const displayItems = Array.from({ length: copies }, () => items).flat();

  return (
    <div style={{ background: "#ffffff", padding: "6rem 0", overflow: "hidden" }}>
      <div className="container" style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "2.5rem", color: "var(--color-text-heading)", fontWeight: "800", marginBottom: "1rem" }}>
          Our Moments
        </h2>
        <div style={{ width: "60px", height: "4px", background: "var(--color-accent-orange)", margin: "0 auto" }}></div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          padding: "1rem 0",
        }}
      >
        <div
          className="marquee-track"
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "1.5rem",
            width: "max-content",
            // translateX moves exactly one "set" of items = 1/copies of total width
            animation: `marqueeScroll ${items.length * 5}s linear infinite`,
          }}
        >
          {displayItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              style={{
                width: "360px",
                height: "260px",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                flexShrink: 0,
                backgroundColor: "#f8f9fa",
              }}
            >
              {item.is_video ? (
                <video
                  src={`${API_BASE_URL}${item.media_file}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={`${API_BASE_URL}${item.media_file}`}
                  alt={item.title || "Gallery image"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-${Math.round(100 / copies)}% - 0.25rem)); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
