import {calculateCapacity} from "./hosting.service";
import {Bed} from "../database/models";

jest.mock('../database/models', () => ({
    Bed: {
        findById: jest.fn(),
    },
}));

describe('Calculate Hosting Capacity', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('Scenario: Happy path', () => {
        it('should calculate total capacity correctly when beds are valid', async() => {
            (Bed.findById as jest.Mock).mockImplementation((id) => {
                const bedData = {
                    'bed1': { place: 2 },
                    'bed2': { place: 3 },
                };
                return Promise.resolve(bedData[id] || null);
            });

            const beds = [
                { bed: 'bed1', quantity: 2 },
                { bed: 'bed2', quantity: 3 },
            ];

            const totalCapacity = await calculateCapacity(beds);
            expect(totalCapacity).toBe(13);
        })

        it('should handle missing beds gracefully', async () => {
            (Bed.findById as jest.Mock).mockResolvedValue(null);

            const beds = [{ bed: 'missingBed', quantity: 2 }];

            const totalCapacity = await calculateCapacity(beds);
            expect(totalCapacity).toBe(0);
        });
    })

})