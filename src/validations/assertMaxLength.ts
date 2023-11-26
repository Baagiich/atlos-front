export function assertMaxLength(message: string, maxlength: number) {
  return (v: string) => (v && v.length <= maxlength) || message;
}
