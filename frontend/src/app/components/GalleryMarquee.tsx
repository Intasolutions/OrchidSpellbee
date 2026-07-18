"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/config";

interface GalleryItem {
  id: number;
  title: string;
  media_file: string;
  is_video: boolean;
  order: number;
  rotation?: string;
}

export default function GalleryMarquee() {
  const [items, setItems] = useState<GalleryItem[]>([
    { id: 1, title: 'Moment 1', media_file: '/img/img1.JPG', is_video: false, order: 1 },
    { id: 2, title: 'Moment 2', media_file: '/img/img2.JPG', is_video: false, order: 2 },
    { id: 3, title: 'Moment 3', media_file: '/img/img3.JPG', is_video: false, order: 3, rotation: "rotate(180deg)" },
    { id: 4, title: 'Moment 4', media_file: '/img/img4.JPG', is_video: false, order: 4, rotation: "rotate(-90deg) scale(1.4)" },
    { id: 5, title: 'Moment 5', media_file: '/img/img5.JPG', is_video: false, order: 5, rotation: "rotate(-90deg) scale(1.4)" },
    { id: 6, title: 'Moment 6', media_file: '/img/img7.JPG', is_video: false, order: 6, rotation: "rotate(-90deg) scale(1.4)" },
    { id: 7, title: 'Moment 7', media_file: '/video/orchid national.MOV', is_video: true, order: 7 },
    { id: 8, title: 'Moment 8', media_file: '/video/orchid oral2 portrait.MOV', is_video: true, order: 8, rotation: "rotate(-90deg) scale(1.4)" },
    { id: 9, title: 'Moment 9', media_file: '/video/orchid overall portrait.MOV', is_video: true, order: 9, rotation: "rotate(-90deg) scale(1.4)" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // We are using static images instead of fetching from the backend API.
  // useEffect(() => {
  //   fetch(`${API_BASE_URL}/api/gallery/`)
  //     .then((res) => res.json())
  //     .then((data) => setItems(data))
  //     .catch((err) => console.error("Error fetching gallery:", err));
  // }, []);

  if (items.length === 0) return null;

  // Duplicate enough times to always fill the screen and loop seamlessly
  const copies = Math.max(6, Math.ceil(12 / items.length));
  const displayItems = Array.from({ length: copies }, () => items).flat();

  return (
    <div style={{ background: "#ffffff", padding: "6rem 0", overflow: "hidden" }}>
      <div className="container reveal-up" style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "2.5rem", color: "var(--color-text-heading)", fontWeight: "800", marginBottom: "1rem" }}>
          Our Moments
        </h2>
        <div style={{ width: "60px", height: "4px", background: "var(--color-accent-orange)", margin: "0 auto" }}></div>
      </div>

      <div
        className="reveal-up delay-200"
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          padding: "1rem 0",
        }}
      >
        {/* Left Fade Overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "150px",
          height: "100%",
          background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          zIndex: 2,
          pointerEvents: "none"
        }} />
        
        {/* Right Fade Overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "150px",
          height: "100%",
          background: "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          zIndex: 2,
          pointerEvents: "none"
        }} />
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
                position: "relative"
              }}
            >
              {item.is_video ? (
                <video
                  src={item.media_file}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    transform: item.rotation || "none"
                  }}
                />
              ) : (
                <Image
                  src={item.media_file}
                  alt={item.title || "Gallery image"}
                  fill
                  sizes="360px"
                  style={{ objectFit: "cover", transform: item.rotation || "none" }}
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
