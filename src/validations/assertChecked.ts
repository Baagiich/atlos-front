export function assertChecked(message: string) {
  return (v: boolean) => !!v || message;
}
