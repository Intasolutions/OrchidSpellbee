"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Track if we are in touch mode (hybrid screen use)
  const isTouchMode = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the device supports a hovering pointer (desktops, laptops)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    // Enable custom cursor styles
    document.documentElement.classList.add("has-custom-cursor");
    setIsEnabled(true);

    // Start positions (centered initially)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      // If we were in touch mode but the user has moved the mouse again, restore follower
      if (isTouchMode.current) {
        isTouchMode.current = false;
        setIsEnabled(true);
        document.documentElement.classList.add("has-custom-cursor");
        
        const f = followerRef.current;
        const d = dotRef.current;
        if (f) f.style.opacity = "1";
        if (d) d.style.opacity = "1";
      }

      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    
    // Hide visual elements when mouse leaves window bounds
    const onMouseLeave = () => {
      const f = followerRef.current;
      const d = dotRef.current;
      if (f) f.style.opacity = "0";
      if (d) d.style.opacity = "0";
    };
    
    const onMouseEnter = () => {
      if (isTouchMode.current) return;
      const f = followerRef.current;
      const d = dotRef.current;
      if (f) f.style.opacity = "1";
      if (d) d.style.opacity = "1";
    };

    // If user touches screen, disable custom cursor instantly to allow standard scrolling
    const onTouchStart = () => {
      isTouchMode.current = true;
      setIsEnabled(false);
      document.documentElement.classList.remove("has-custom-cursor");
      
      const f = followerRef.current;
      const d = dotRef.current;
      if (f) f.style.opacity = "0";
      if (d) d.style.opacity = "0";
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

      // Always read latest refs to prevent animating stale unmounted nodes
      const currentFollower = followerRef.current;
      const currentDot = dotRef.current;

      if (currentFollower) {
        currentFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      }
      if (currentDot) {
        currentDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
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

  return (
    <>
      <div
        ref={followerRef}
        className={`custom-cursor-follower ${isEnabled ? "visible" : ""} ${isHovered ? "hovered" : ""} ${isClicked ? "clicked" : ""}`}
        style={{ display: isEnabled ? "block" : "none" }}
      />
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isEnabled ? "visible" : ""} ${isHovered ? "hovered" : ""} ${isClicked ? "clicked" : ""}`}
        style={{ display: isEnabled ? "block" : "none" }}
      />
    </>
  );
}
