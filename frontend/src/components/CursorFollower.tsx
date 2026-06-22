"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Track enabled status using a ref to bypass useEffect state closures
  const isEnabledRef = useRef(false);

  const setEnabledStatus = (status: boolean) => {
    setIsEnabled(status);
    isEnabledRef.current = status;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the device supports a hovering pointer (desktops, laptops)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    // Enable custom cursor styles
    document.documentElement.classList.add("has-custom-cursor");
    setEnabledStatus(true);

    // Start positions (centered initially)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;

    const onPointerMove = (e: PointerEvent) => {
      // If touch interaction is detected, hide follower and restore native cursor
      if (e.pointerType === "touch") {
        if (isEnabledRef.current) {
          setEnabledStatus(false);
          document.documentElement.classList.remove("has-custom-cursor");
          const f = followerRef.current;
          const d = dotRef.current;
          if (f) f.style.opacity = "0";
          if (d) d.style.opacity = "0";
        }
        return;
      }

      // If we were disabled (e.g. by touch) but are now moving with a mouse, restore follower
      if (!isEnabledRef.current) {
        setEnabledStatus(true);
        document.documentElement.classList.add("has-custom-cursor");
      }

      const f = followerRef.current;
      const d = dotRef.current;

      // Clean bounds checking instead of flaky document pointerleave/pointerenter events
      const isOutOfBounds = 
        e.clientX <= 2 || 
        e.clientY <= 2 || 
        e.clientX >= window.innerWidth - 2 || 
        e.clientY >= window.innerHeight - 2;

      if (isOutOfBounds) {
        if (f) f.style.opacity = "0";
        if (d) d.style.opacity = "0";
      } else {
        if (f) f.style.opacity = "1";
        if (d) d.style.opacity = "1";
      }

      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        if (isEnabledRef.current) {
          setEnabledStatus(false);
          document.documentElement.classList.remove("has-custom-cursor");
          const f = followerRef.current;
          const d = dotRef.current;
          if (f) f.style.opacity = "0";
          if (d) d.style.opacity = "0";
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
