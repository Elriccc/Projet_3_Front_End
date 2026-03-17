export interface DownloadFile {
    fileLink: String,
    name: string,
    extension: string,
    size: number
    usePassword: boolean,
    daysUntilExpired: number,
    tags: string[]
}