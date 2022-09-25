import { describe, expect, test } from '@jest/globals';
import { getBudget } from "../budgetCalculator";


describe('Budget calculator', () => {
    test('Budget should be 2993', async () => {

        const budget = getBudget(7800);
        console.log(budget)
        expect(budget).toBe(2993);

    });
});