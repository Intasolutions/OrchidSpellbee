"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the device supports a hovering pointer (desktops, laptops)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    // Enable custom cursor class
    document.documentElement.classList.add("has-custom-cursor");
    setIsVisible(true);

    const follower = followerRef.current;
    const dot = dotRef.current;

    // Initialize positions off-screen so it doesn't pop in the center
    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let dotX = -100;
    let dotY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    
    // Hide visual elements when mouse leaves window bounds
    const onMouseLeave = () => {
      if (follower) follower.style.opacity = "0";
      if (dot) dot.style.opacity = "0";
    };
    
    const onMouseEnter = () => {
      if (follower) follower.style.opacity = "1";
      if (dot) dot.style.opacity = "1";
    };

    // Fallback: If user actually touches screen, disable custom cursor instantly
    const onTouchStart = () => {
      setIsVisible(false);
      document.documentElement.classList.remove("has-custom-cursor");
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('.interactive') ||
          target.closest('.btn') ||
          target.closest('.card') ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    let animationFrameId: number;
    const tick = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      if (follower) {
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("touchstart", onTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={followerRef}
        className={`custom-cursor-follower visible ${isHovered ? "hovered" : ""} ${isClicked ? "clicked" : ""}`}
      />
      <div
        ref={dotRef}
        className={`custom-cursor-dot visible ${isHovered ? "hovered" : ""} ${isClicked ? "clicked" : ""}`}
      />
    </>
  );
}
