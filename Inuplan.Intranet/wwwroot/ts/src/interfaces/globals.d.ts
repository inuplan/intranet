declare var globals: IGlobals;

interface IGlobals {
    readonly urls: urls
    readonly currentUsername: string
}

interface urls {
    readonly users: string
    readonly images: string
    readonly imagecomments: string
    readonly whatsnew: string
    readonly forumtitle: string
    readonly forumpost: string
    readonly forumcomments: string
    readonly diagnostics: string
    readonly employeeHandbook: string
    readonly c5Search: string
    readonly websocket: {
        readonly latest: string
    }
    readonly intranetside: string
}