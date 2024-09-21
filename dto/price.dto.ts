export interface CreatePriceInputs {
    htAmount: string;
    startDate: Date;
    endDate: Date;
}

export interface UpdatePriceInputs {
    htAmount?: string;
    startDate?: Date;
    endDate?: Date;
}