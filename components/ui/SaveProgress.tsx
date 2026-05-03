"use client";

import { useEffect } from "react";

interface SaveProgressProps {
  testSlug: string;
  testName: string;
  score: number;
  passed: boolean;
  date: string;
}

export interface ProgressEntry {
  testSlug: string;
  testName: string;
  score: number;
  passed: boolean;
  date: string;
}

const STORAGE_KEY = "cdl_progress";
const MAX_ENTRIES = 50;

export function SaveProgress({ testSlug, testName, score, passed, date }: SaveProgressProps) {
  useEffect(() => {
    try {
      const existing: ProgressEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      const newEntry: ProgressEntry = { testSlug, testName, score, passed, date };
      const updated = [newEntry, ...existing].slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage unavailable — ignore
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
