export interface Login {
    email: string,
    password: string
}

export interface Register {
    email: string,
    password: string,
    passwordConfirmation: string
}

export interface Download {
    password: string
}

export interface Upload {
    fileName: string,
    password: string | undefined,
    expiration: string | undefined
}