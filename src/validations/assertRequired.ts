
export function assertRequired(
    message: string
){
    return (value : string) => !!value || message;
}