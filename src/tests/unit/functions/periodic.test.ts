import { describe, test, expect } from 'vitest';
import { generator } from '../../../presets/periodic';
import { PeriodicOperatorSymbol } from '../../../types';

describe('PeriodicFunction', () => {
    const funcs = Object.values(generator).map(g => g());

    // test values for given input
    describe('values at x = 0', () => {
        const expected: { [key in PeriodicOperatorSymbol]: number } = {
            [PeriodicOperatorSymbol.SIN]: 0,
            [PeriodicOperatorSymbol.COS]: 1,
            [PeriodicOperatorSymbol.TAN]: 0,
            [PeriodicOperatorSymbol.SQR]: 0,
            [PeriodicOperatorSymbol.TRN]: 0,
            [PeriodicOperatorSymbol.SAW]: 1.5707963267948966
        };

        for(const f of funcs) {
            test(f.getSymbol(), async () => {
                const calc = await f.calculate(0);
                expect(calc).toBeDefined();
                expect(calc).toBeTypeOf('number');
                expect(calc).toBe(expected[f.getSymbol() as PeriodicOperatorSymbol]);
            });
        };
    });

    // test if amplitude increases output
    describe('amplitude effect on ouput', () => {
        describe('amplitude >= 0', () => {
            const factor = 2;

            for(const f of funcs) {
                test(f.getSymbol(), async () => {
                    const original = await f.calculate(45);
                    f.setAmplitude(factor);
                    const amplified = await f.calculate(45);
                    expect(amplified).toBe(factor * original);
                });
            };
        });

        describe('amplitude <= 0 throws error', () => {
            const factor = -1;

            for(const f of funcs) {
                test(f.getSymbol(), async () => {
                    try {
                        f.setAmplitude(factor);
                    }
                    catch(e: any) {
                        expect(e.message).toBeDefined();
                        expect(e.message).toContain('amplitude value must be greater than or equal to 0');    
                    }
                });
            };
        });
    });

    // test if frequency changes periodicity
    describe('frequency effect on output', () => {
        describe('frequency > 0', () => {
            const freq = 2;
            const x = 90;

            for(const f of funcs) {
                test(f.getSymbol(), async () => {
                    f.setAmplitude(1);
                    const original = await f.calculate(x);
                    f.setFrequency(freq);
                    const higherFreq = await f.calculate(x/2);
                    expect(higherFreq).toBe(original); 
                });
            };
        });

        describe('frequency <= 0 throws error', () => {
            for(const f of funcs) {
                test(f.getSymbol(), async () => {
                    try {
                        f.setFrequency(-1);
                    }
                    catch(e: any) {
                        expect(e.message).toBeDefined();
                        expect(e.message).toContain('frequency value must be greater than 0');
                    }
                });
            }
        });
    });
});