"use client";

import type React from "react";

interface SkeletonProps {
  w?:     string | number;
  h?:     number;
  r?:     number;
  style?: React.CSSProperties;
}

export function Skeleton({ w = "100%", h = 16, r = 6, style = {} }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{
        width:        w,
        height:       h,
        borderRadius: r,
        ...style,
      }}
    />
  );
}
