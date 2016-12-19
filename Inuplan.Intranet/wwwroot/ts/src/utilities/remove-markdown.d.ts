declare module "remove-markdown" {
    export default removeMd;
}

interface removeMdStatic {
    (text: string): string
} 

declare var removeMd: removeMdStatic;