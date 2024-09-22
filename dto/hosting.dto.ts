export interface CreateBedInput {
    bedId: string;
    quantity: number;
}

export interface CreateHostingInputs {
    name: string;
    description: string;
    isSpotLight: boolean;
    beds: CreateBedInput[];
}

export interface UpdateHostingInputs {
    name?: string;
    description?: string;
    isSpotLight?: boolean;
    beds?: CreateBedInput[];
}