import { describe, test, expect } from 'vitest';
import { generator } from '../../../presets/boolean';
import { BooleanOperatorSymbol } from '../../../types';

describe('BooleanFunction', () => {
    const funcs = Object.entries(generator).map(([_s, g]) => g());
    const funcsInv = Object.entries(generator).map(([_s, g]) => g(false));
    const [a, b] = [true, false];
    const offset = false;
    
    const expected: { [key: string]: boolean } = {
        [BooleanOperatorSymbol.AND]: a && b,
        [BooleanOperatorSymbol.OR]: a || b,
        [BooleanOperatorSymbol.NOT]: !(a && b),
        [BooleanOperatorSymbol.XOR]: (a && b) || (!a && b),
        [BooleanOperatorSymbol.NAND]: !(a && b),
        [BooleanOperatorSymbol.NOR]: !(a || b),
        [BooleanOperatorSymbol.XNOR]: (a || !b) && (!a || b)
    };

    const expectedOffset: { [key: string]: boolean } = {
        [BooleanOperatorSymbol.AND]: (offset && a) && b,
        [BooleanOperatorSymbol.OR]: (offset || a) || b,
        [BooleanOperatorSymbol.NOT]: !((offset && a) && b),
        [BooleanOperatorSymbol.XOR]: ((offset && !a) && (a && !b)) || ((!offset && a) && (!a && b)),
        [BooleanOperatorSymbol.NAND]: !((offset && a) && b),
        [BooleanOperatorSymbol.NOR]: !((offset || a) || b),
        [BooleanOperatorSymbol.XNOR]: ((offset || a) || !b) && ((!offset || !a) || b)
    };

    describe('offset undefined', () => {
        funcs.forEach(f => {
            test(f.getSymbol(), async () => {
                const calc = await f.calculate(a, b);
                expect(calc).toBeDefined();
                expect(calc).toBeTypeOf('boolean');
                expect(calc).toBe(expected[f.getSymbol()]);
            });
        });
    });
    
    describe('offset = false', () => {
        funcsInv.forEach(f => {
            test(f.getSymbol(), async () => {
                const calc = await f.calculate(a, b);
                expect(calc).toBeDefined();
                expect(calc).toBeTypeOf('boolean');
                expect(calc).toBe(expectedOffset[f.getSymbol()]);
            });
        });
    });
})