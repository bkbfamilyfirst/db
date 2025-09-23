"use client"

// During migration to Sonner, the legacy Radix-based Toaster is intentionally disabled.
// Keep an exported component to avoid breaking existing imports; render null so nothing shows.
export function Toaster() {
  return null
}
