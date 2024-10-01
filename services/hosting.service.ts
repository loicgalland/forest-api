import {Bed, BedArray} from "../database/models";

export async function calculateCapacity(beds: any): Promise<number> {
    let totalCapacity = 0;

    for (const bedItem of beds) {
        const bed = await Bed.findById(bedItem.bed)
        if (bed) {
            totalCapacity += bed.place * bedItem.quantity;
        }
    }

    return totalCapacity;
}
