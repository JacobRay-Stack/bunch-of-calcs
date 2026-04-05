"use client";

import { useEffect, useCallback } from "react";

const STORAGE_PREFIX = "boc_";

/**
 * Saves calculator inputs to localStorage so users see their last values on return.
 * Call with the calculator slug and a record of current values.
 * Returns a loadSaved function that returns the stored values (or null).
 */
export function useSavedInputs<T extends Record<string, unknown>>(
  slug: string,
  values: T
) {
  const key = `${STORAGE_PREFIX}${slug}`;

  // Auto-save on value changes (debounced by React's batching)
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(values));
    } catch {
      // localStorage full or unavailable -- silently ignore
    }
  }, [key, values]);

  const loadSaved = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      return JSON.parse(stored) as T;
    } catch {
      return null;
    }
  }, [key]);

  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key]);

  return { loadSaved, clearSaved };
}
