export interface DownloadFile {
    fileLink: String,
    name: string,
    extension: string,
    size: number
    password: string,
    usePassword: boolean,
    daysUntilExpired: number,
    tags: string[],
    file: File
}