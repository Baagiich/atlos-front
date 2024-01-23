import dayjs from "dayjs";

export function formatDateTime(date?: string): string | null {
  if (!date) return null;

  return dayjs(date).format("YYYY/MM/DD");
}

export function formatDateInput(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  return dayjs(value).format("YYYY-MM-DD");
}

export function formatDateTimeFull(date?: string): string | null {
  if (!date) return null;

  return dayjs(date).format("YYYY/MM/DD hh:mm");
}
