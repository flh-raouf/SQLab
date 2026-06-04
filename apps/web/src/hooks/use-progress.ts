import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

const STORAGE_KEY = "bdd-revision-progress";

type ProgressData = {
  completedExercises: string[];
  lastExerciseId: string | null;
  hintedExerciseIds: string[];
  revealedExerciseIds: string[];
};

type ProgressContextValue = ProgressData & {
  completed: string[];
  markComplete: (exerciseId: string) => void;
  markHintUsed: (exerciseId: string) => void;
  markSolutionRevealed: (exerciseId: string) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedExercises: Array.isArray(parsed.completedExercises)
          ? parsed.completedExercises
          : [],
        lastExerciseId:
          typeof parsed.lastExerciseId === "string"
            ? parsed.lastExerciseId
            : null,
        hintedExerciseIds: Array.isArray(parsed.hintedExerciseIds)
          ? parsed.hintedExerciseIds
          : [],
        revealedExerciseIds: Array.isArray(parsed.revealedExerciseIds)
          ? parsed.revealedExerciseIds
          : [],
      };
    }
  } catch {
    // ignore
  }
  return {
    completedExercises: [],
    lastExerciseId: null,
    hintedExerciseIds: [],
    revealedExerciseIds: [],
  };
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProgressData>(() => loadProgress());

  const markComplete = useCallback((exerciseId: string) => {
    setData((prev) => {
      if (prev.completedExercises.includes(exerciseId)) return prev;
      const next = {
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseId],
        lastExerciseId: exerciseId,
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markHintUsed = useCallback((exerciseId: string) => {
    setData((prev) => {
      if (prev.hintedExerciseIds.includes(exerciseId)) return prev;
      const next = {
        ...prev,
        hintedExerciseIds: [...prev.hintedExerciseIds, exerciseId],
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markSolutionRevealed = useCallback((exerciseId: string) => {
    setData((prev) => {
      if (prev.revealedExerciseIds.includes(exerciseId)) return prev;
      const next = {
        ...prev,
        revealedExerciseIds: [...prev.revealedExerciseIds, exerciseId],
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const empty: ProgressData = {
      completedExercises: [],
      lastExerciseId: null,
      hintedExerciseIds: [],
      revealedExerciseIds: [],
    };
    saveProgress(empty);
    window.location.reload();
  }, []);

  const ctxValue: ProgressContextValue = {
    ...data,
    completed: data.completedExercises,
    markComplete,
    markHintUsed,
    markSolutionRevealed,
    reset,
  };

  return createElement(ProgressContext.Provider, { value: ctxValue }, children);
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
