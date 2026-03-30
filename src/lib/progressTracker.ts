// Progress tracking for chapters - saves to localStorage + syncs via SyncStorage
const PREFIX = "u19-";

export interface ChapterProgress {
  completedSteps: Record<string, boolean>;
  score: number;
  total: number;
  completed: boolean;
  lastVisit: string;
}

export function getProgress(chapterId: string): ChapterProgress {
  if (typeof window === "undefined") return { completedSteps: {}, score: 0, total: 0, completed: false, lastVisit: "" };
  try {
    const raw = localStorage.getItem(PREFIX + chapterId);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedSteps: {}, score: 0, total: 0, completed: false, lastVisit: "" };
}

export function saveProgress(chapterId: string, data: Partial<ChapterProgress>) {
  if (typeof window === "undefined") return;
  const current = getProgress(chapterId);
  const updated = { ...current, ...data, lastVisit: new Date().toISOString() };
  localStorage.setItem(PREFIX + chapterId, JSON.stringify(updated));
}

export function markStepComplete(chapterId: string, stepId: string) {
  const current = getProgress(chapterId);
  current.completedSteps[stepId] = true;
  saveProgress(chapterId, { completedSteps: current.completedSteps });
}

export function saveQuizScore(chapterId: string, score: number, total: number) {
  saveProgress(chapterId, { score, total, completed: score >= total * 0.6 });
}

export function getAllProgress(): Record<string, ChapterProgress> {
  if (typeof window === "undefined") return {};
  const result: Record<string, ChapterProgress> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) {
      try { result[key.replace(PREFIX, "")] = JSON.parse(localStorage.getItem(key) || "{}"); } catch {}
    }
  }
  return result;
}
