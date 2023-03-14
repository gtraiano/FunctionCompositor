import { describe, test, expect } from 'vitest';
import ChainNode from '../../../classes/chain/ChainNode';
import { generate } from '../../../presets/arithmetic';
import { OperationCallbackWithOffset } from '../../../types';

describe('ChainNode', () => {
    const addFive = generate.add(5);
    const mulFive = generate.mul(5);
    const x = 1;

    // test node's main operation
    describe('main operation', () => {
        // undefined main operation defaults to identity function
        describe('undefined', () => {
            // if node input is undefined, output must be equal to main operation applied to calculate()'s argument
            describe('defaults to identity function', () => {
                test('for undefined input, calculate(x) => x', async () => {
                    const node = new ChainNode<number>({
                        bypass: false
                    });
                    const calc = await node.calculate(x);
                    expect(calc).toBe(x);
                });
                // if node input is defined, output must be equal to main operation applied to node's input value (i.e. calculate()'s argument is ignored)
                test('for defined input, calculate(x) => calculate(input)', async () => {
                    const node = new ChainNode<number>({
                        bypass: false,
                        input: x+1
                    })
                    const calc = await node.calculate(x);
                    expect(calc).toBe(x+1);
                });
            });
        });

        // main operation is defined explicitly
        describe('defined', () => {
            test('for undefined input, calculate(x) => mainOperation(x)', async () => {
                const node = new ChainNode<number>({
                    bypass: false,
                    mainOperation: addFive
                });
                const calc = await node.calculate(x);
                expect(calc).toBe((addFive.getCallback() as OperationCallbackWithOffset<number>)(x)(addFive.getOffset()));
            });

            test('for defined input, calculate(x) => mainOperation(input)', async () => {
                const node = new ChainNode<number>({
                    bypass: false,
                    mainOperation: addFive,
                    input: x+1
                });
                const calc = await node.calculate(x);
                expect(calc).toBe((addFive.getCallback() as OperationCallbackWithOffset<number>)(node.input)(addFive.getOffset()));
            });
        })
        
    });

    describe('Calculate interface implementation', () => {
        test('node input is defined, calculate(...args) returns value of calculate(input) instead of calculate(...args)', async () => {
            const node = new ChainNode<number>({
                bypass: false,
                input: -1,
            });
            const calc = await node.calculate(x);
            expect(calc).toBe(node.input);
        });

        test('node input is undefined, calculate(x) => x', async () => {
            const node = new ChainNode<number>({
                bypass: false,
            });
            const calc = await node.calculate(x);
            expect(calc).toBe(x);
        });
    });

    describe('input operation', () => {
        test('with inputOperation (input) => input + 5', async () => {
            const node = new ChainNode<number>({
               bypass: false,
               mainOperation: addFive
            });
            
            const calc = await node.calculate(x);
            expect(calc).toBeDefined();
            expect(calc).toBe(x+5);
        });
    
        test('with defined input and inputOperation (input) => input + 5', async () => {
            const node = new ChainNode<number>({
               bypass: false,
               inputOperation: addFive,
               input: x+1
            });
            
            const calc = await node.calculate(x);
            expect(calc).toBeDefined();
            expect(calc).toBe((addFive.getCallback() as OperationCallbackWithOffset<number>)(x+1)(addFive.getOffset()));
            expect(calc).toBe(x+1+5);
        });
    
        test('with undefined inputOperation', async () => {
            const node = new ChainNode<number>({
               bypass: false
            });
            
            const calc = await node.calculate(x);
            expect(calc).toBeDefined();
            expect(calc).toBe(x);
        });
    });

    // test node's output operation
    describe('output operation', () => {
        test('with outputOperation (output) => output * 5', async () => {
            const node = new ChainNode<number>({
               bypass: false,
               outputOperation: mulFive
            });
            
            const calc = await node.calculate(x);
            expect(calc).toBeDefined();
            expect(calc).toBe((mulFive.getCallback() as OperationCallbackWithOffset<number>)(x)(mulFive.getOffset()));
            expect(calc).toBe(x*5);
        });
    
        test('with defined input and outputOperation (output) => output * 5', async () => {
            const node = new ChainNode<number>({
               bypass: false,
               outputOperation: mulFive,
               input: x+1
            });
            
            const calc = await node.calculate(x);
            expect(calc).toBeDefined();
            expect(calc).toBe((mulFive.getCallback() as OperationCallbackWithOffset<number>)(x+1)(mulFive.getOffset()));
            expect(calc).toBe((x+1)*5);
        });
    
        test('with undefined outputOperation', async () => {
            const node = new ChainNode<number>({
               bypass: false
            });
            
            const calc = await node.calculate(x);
            expect(calc).toBeDefined();
            expect(calc).toBe(x);
        });
    });

    // test all node's operations
    describe('all operations defined', () => {
        test('', async () => {
            const node = new ChainNode<number>({
                bypass: false,
                mainOperation: addFive,
                inputOperation: addFive,
                outputOperation: mulFive
            });

            const calc = await node.calculate(x);
            expect(calc).toBe(((x+5)+5)*5);
            let expected = (addFive.getCallback() as OperationCallbackWithOffset<number>)(x)(addFive.getOffset());
            expected = (addFive.getCallback() as OperationCallbackWithOffset<number>)(expected)(addFive.getOffset());
            expected = (mulFive.getCallback() as OperationCallbackWithOffset<number>)(expected)(mulFive.getOffset());
            expect(calc).toBe(expected);
        });
    });
});