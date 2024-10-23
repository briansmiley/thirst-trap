export type Duration = {
  minutes: number;
  seconds: number;
};

export function toDuration(ms: number): Duration {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return { minutes, seconds };
}

export function toDurationString(durationOrMs: Duration | number) {
  const duration =
    typeof durationOrMs === "number" ? toDuration(durationOrMs) : durationOrMs;
  return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`;
}
