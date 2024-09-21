export interface CreateHostingInputs {
    name: string;
    description: string;
    isSpotLight: boolean
}

export interface UpdateHostingInputs {
    name?: string;
    description?: string;
    isSpotLight?: boolean
}