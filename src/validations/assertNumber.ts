export function assertNumber(message: string) {
  return (v: number) => !!v || message;
}
