
export  function assertEmail(
    message :string
){
    return (v: string) => /.+@.+\..+/.test(v) || message;
}