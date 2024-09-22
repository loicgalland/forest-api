export interface CreateBedInput {
    bedId: string;
    quantity: number;
}

export interface CreateEquipmentInput {
    equipmentId: string;
    quantity: number;
}

export interface CreateHostingInputs {
    name: string;
    description: string;
    isSpotLight: boolean;
    beds: CreateBedInput[];
    equipments: CreateEquipmentInput[];
}

export interface UpdateHostingInputs {
    name?: string;
    description?: string;
    isSpotLight?: boolean;
    beds?: CreateBedInput[];
    equipments?: CreateEquipmentInput[];
}