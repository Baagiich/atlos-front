export function assertPasswordConfirm(message: string, plainPassword: string) {
  return (v: string) => v === plainPassword || message;
}
