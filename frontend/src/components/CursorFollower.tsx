"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Refs to track states synchronously inside the pointer events loop without closure staleness
  const isEnabledRef = useRef(false);
  const isVisibleRef = useRef(false);

  const setEnabledStatus = (status: boolean) => {
    setIsEnabled(status);
    isEnabledRef.current = status;
  };

  const setVisibleStatus = (status: boolean) => {
    setIsVisible(status);
    isVisibleRef.current = status;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Verify hover support (desktops, laptops with mice/trackpads)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    // Enable custom cursor classes
    document.documentElement.classList.add("has-custom-cursor");
    setEnabledStatus(true);
    setVisibleStatus(true);

    // Initial position in the center
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;

    const onPointerMove = (e: PointerEvent) => {
      // Touch interaction detected (scrolling/gestures on touchscreen/trackpad)
      if (e.pointerType === "touch") {
        if (isEnabledRef.current) {
          setEnabledStatus(false);
          setVisibleStatus(false);
          document.documentElement.classList.remove("has-custom-cursor");
        }
        return;
      }

      // Re-enable if moving pointer with a mouse/trackpad fine input
      if (!isEnabledRef.current) {
        setEnabledStatus(true);
        setVisibleStatus(true);
        document.documentElement.classList.add("has-custom-cursor");
      }

      // Check boundaries
      const outOfBounds = 
        e.clientX <= 2 || 
        e.clientY <= 2 || 
        e.clientX >= window.innerWidth - 2 || 
        e.clientY >= window.innerHeight - 2;

      if (outOfBounds) {
        if (isVisibleRef.current) {
          setVisibleStatus(false);
        }
      } else {
        if (!isVisibleRef.current) {
          setVisibleStatus(true);
        }
      }

      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        if (isEnabledRef.current) {
          setEnabledStatus(false);
          setVisibleStatus(false);
          document.documentElement.classList.remove("has-custom-cursor");
        }
        return;
      }
      setIsClicked(true);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setIsClicked(false);
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const target = e.target as HTMLElement;
      
      if (target && typeof target.closest === "function") {
        if (
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('.interactive') ||
          target.closest('.btn') ||
          target.closest('.card') ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA'
        ) {
          setIsHovered(true);
          return;
        }
      }
      setIsHovered(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointerover", handlePointerOver);

    let animationFrameId: number;
    const tick = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      const f = followerRef.current;
      const d = dotRef.current;

      if (f) {
        f.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      }
      if (d) {
        d.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointerover", handlePointerOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div
        ref={followerRef}
        className={`custom-cursor-follower ${isEnabled && isVisible ? "visible" : ""} ${isHovered ? "hovered" : ""} ${isClicked ? "clicked" : ""}`}
        style={{ display: isEnabled ? "block" : "none" }}
      />
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isEnabled && isVisible ? "visible" : ""} ${isHovered ? "hovered" : ""} ${isClicked ? "clicked" : ""}`}
        style={{ display: isEnabled ? "block" : "none" }}
      />
    </>
  );
}

