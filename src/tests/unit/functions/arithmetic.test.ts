import { describe, test, expect } from 'vitest';
import { generator, generateCustom } from '../../../presets/arithmetic';
import { ArithmeticOperatorSymbol } from '../../../types';

describe('ArithmeticFunction', () => {
    const input = 4;
    const offset = 10;
    
    const expected: { [key in ArithmeticOperatorSymbol]: number } = {
        [ArithmeticOperatorSymbol.ADD]: input,
        [ArithmeticOperatorSymbol.SUB]: input,
        [ArithmeticOperatorSymbol.MUL]: input,
        [ArithmeticOperatorSymbol.DIV]: input,
        [ArithmeticOperatorSymbol.EXP]: input,
        [ArithmeticOperatorSymbol.EQ]: input,
        [ArithmeticOperatorSymbol.SQRT]: Math.sqrt(input),
        [ArithmeticOperatorSymbol.CBRT]: Math.cbrt(input),
        [ArithmeticOperatorSymbol.ABS]: Math.abs(input)
    };

    const expectedOffset: { [key in ArithmeticOperatorSymbol]: number } = {
        [ArithmeticOperatorSymbol.ADD]: input + offset,
        [ArithmeticOperatorSymbol.SUB]: input - offset,
        [ArithmeticOperatorSymbol.MUL]: input * offset,
        [ArithmeticOperatorSymbol.DIV]: input / offset,
        [ArithmeticOperatorSymbol.EXP]: input ** offset,
        [ArithmeticOperatorSymbol.EQ]: input + offset,
        [ArithmeticOperatorSymbol.SQRT]: Math.sqrt(input + offset),
        [ArithmeticOperatorSymbol.CBRT]: Math.cbrt(input + offset),
        [ArithmeticOperatorSymbol.ABS]: Math.abs(input + offset)
    };

    const funcs = Object.values(generator).map(g => g());
    const funcsOffset = Object.values(generator).map(g => g(offset));

    describe('offset undefined', () => {
        for(const f of funcs) {
            test(f.getSymbol(), async () => {
                const calc = await f.calculate(input);
                expect(calc).toBeDefined();
                expect(calc).toBeTypeOf('number');
                expect(calc).toBe(expected[f.getSymbol() as ArithmeticOperatorSymbol]);
            });
        }
    });

    describe('offset defined', () => {
        for(const f of funcsOffset) {
            test(f.getSymbol(), async () => {
                const calc = await f.calculate(input);
                expect(calc).toBeDefined();
                expect(calc).toBeTypeOf('number');
                expect(calc).toBe(expectedOffset[f.getSymbol()]);
            });
        }

        test('custom', async () => {
            const f = generateCustom({
                symbol: 'modulo 3',
                offset: 3,
                callback: (...input: number[]) => (offset?: number) => input[0] % (offset ?? 1)
            });
            const calc = await f.calculate(input);
            expect(calc).toBeDefined();
            expect(calc).toBeTypeOf('number');
            expect(calc).toBe(input % 3);
        });
    });

    describe('changing offset after object is constructed', () => {
        for(const f of funcs) {
            test(f.getSymbol(), async () => {
                const calc = await f.calculate(input);
                expect(calc).toBeDefined();
                expect(calc).toBeTypeOf('number');
                expect(calc).toBe(expected[f.getSymbol()]);

                f.setOffset(offset);
                const calcOffset = await f.calculate(input);
                expect(calcOffset).not.toBe(calc);
                expect(calcOffset).toBeTypeOf('number');
                expect(calcOffset).toBe(expectedOffset[f.getSymbol()]);
            });
        }

        test('custom', async () => {
            const f = generateCustom({
                symbol: 'modulo 2',
                offset: 2,
                callback: (...input: number[]) => (offset?: number) => input[0] % (offset ?? 1)
            });

            const calc = await f.calculate(input);
            expect(calc).toBeDefined();
            expect(calc).toBeTypeOf('number');
            expect(calc).toBe(input % 2);
            
            f.setOffset(3);
            const calcOffset = await f.calculate(input);
            expect(calcOffset).toBeDefined();
            expect(calcOffset).toBeTypeOf('number');
            expect(calcOffset).toBe(input % 3);
        });
    });
});