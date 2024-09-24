export interface CreateBedInput {
    bedId: string;
    quantity: number;
}

export interface CreateEquipmentInput {
    equipmentId: string;
    quantity: number;
}

export interface CreatePriceInput {
    htAmount: string;
    startDate: Date;
    endDate: Date;
}

export interface CreateHostingInputs {
    name: string;
    description: string;
    isSpotLight: boolean;
    beds: CreateBedInput[];
    equipments: CreateEquipmentInput[];
    prices: CreatePriceInput[];
}

export interface UpdateHostingInputs {
    name?: string;
    description?: string;
    isSpotLight?: boolean;
    beds?: CreateBedInput[];
    equipments?: CreateEquipmentInput[];
}