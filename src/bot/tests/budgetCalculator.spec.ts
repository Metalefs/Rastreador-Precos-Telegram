import { describe, expect, test } from '@jest/globals';
import { getBudget } from "../budgetCalculator";


describe('Budget calculator', () => {
    test('Budget should be 2993', async () => {

        const budget = getBudget(7800, {
            rent: 1140,
            investments: 1500,
            groceries: 675,
            bills: 270,
            subscriptions: 22,
            taxes: 1200,
            chatId: 0,
            available: 2993,
            income: 7800,
            _id: ""
          });
        expect(budget).toBe(2993);

    });
});
