import { describe, test, expect } from 'vitest';
import Chain from '../../../classes/chain/Chain';
import ChainNode from '../../../classes/chain/ChainNode';
import { generate } from '../../../presets/arithmetic';

describe('Chain', () => {
    const t = 1;
    const addFive = generate.add(5)
    const subFive = generate.sub(5);
    
    test('empty chain calculate(x) returns undefined as output', async () => {
        const chain = new Chain<number>();
        const calc = await chain.calculate(t);
        expect(calc).toBeUndefined();
    });

    test('bypassed nodes do not contribute to output', async () => {
        const chain = new Chain<number>();
        const node1 = new ChainNode<number>({
            bypass: false,
            mainOperation: addFive
        });
        const node2 = new ChainNode<number>({
            bypass: true,
            mainOperation: addFive
        });
        chain.add(node1);
        chain.add(node2);

        const calc = await chain.calculate(t);
        expect(calc).toBe((1 + 5) + (5 * 0));
    });

    test('chain as node', async () => {
        // setup nodes
        // x + 5
        const node1 = new ChainNode<number>({
            bypass: false,
            mainOperation: addFive
        });
        // x + 5
        const node2 = new ChainNode<number>({
            bypass: false,
            mainOperation: addFive
        });
        // x - 5
        const node3 = new ChainNode<number>({
            bypass: false,
            mainOperation: subFive
        });
        
        const chain = new Chain<number>();
        chain.add(node1);

        const subChain = new Chain<number>();
        subChain.add(node2);
        subChain.add(node3);
        
        chain.add(subChain);

        const calc = await chain.calculate(t);
        expect(calc).toBe((t + 5) + 5 - 5);
    });

    test('calculate series', async () => {
        const node1 = new ChainNode<number>({
            bypass: false,
            mainOperation: addFive
        });
        const chain = new Chain<number>();
        chain.add(node1);
        
        const ts = [1, 2, 3];

        const calc = await chain.calculateSeries(ts);
        const expected = await Promise.all(ts.map(async t => await (chain.nodes[0]as ChainNode<number>).mainOperation.calculate(t)));
        expect(calc).toEqual(expected);
    });
    

    describe('add node', () => {
        test('undefined index, adds node to end of chain', () => {
            const chain = new Chain<number>();
            chain.add(new ChainNode<number>({
                bypass: false,
                input: 0
            }));
            chain.add(new ChainNode<number>({
                bypass: false,
                input: 1
            }));
            expect(chain.nodes.length).toBe(2);
            expect((chain.nodes[1] as ChainNode<number>).input).toBe(1);
        });

        test('defined index, adds node to correct position in chain', () => {
            const chain = new Chain<number>();
            chain.add(new ChainNode<number>({
                bypass: false,
                input: 0
            }));
            chain.add(new ChainNode<number>({
                bypass: false,
                input: 1
            }), 0);
            expect(chain.nodes.length).toBe(2);
            expect((chain.nodes[0] as ChainNode<number>).input).toBe(1);
        });

        test('index out of range, throw RangeError', () => {
            try {
                const chain = new Chain<number>();
                chain.add(new ChainNode<number>({
                    bypass: false,
                    input: 0
                }));
                chain.add(new ChainNode<number>({
                    bypass: false,
                    input: 1
                }), 2);
            }
            catch(e: any) {
                expect(e).toBeInstanceOf(RangeError);
                expect(e.message).toBeDefined();
            }
        });
    });

    describe('remove node', () => {
        test('undefined index, removes node at end of chain', () => {
            const chain = new Chain<number>();
            chain.add(new ChainNode<number>({
                bypass: false,
                input: 0
            }));
            chain.add(new ChainNode<number>({
                bypass: false,
                input: 1
            }));
            chain.remove();
            expect(chain.nodes.length).toBe(1);
            expect((chain.nodes[0] as ChainNode<number>).input).toBe(0);
        });

        test('defined index removes correct node', () => {
            const chain = new Chain<number>();
            chain.add(new ChainNode<number>({
                bypass: false,
                input: 0
            }));
            chain.add(new ChainNode<number>({
                bypass: false,
                input: 1
            }));
            chain.remove(0);
            expect(chain.nodes.length).toBe(1);
            expect((chain.nodes[0] as ChainNode<number>).input).toBe(1);
        });

        test('index out of range, throws RangeError', () => {
            try {
                const chain = new Chain<number>();
                chain.add(new ChainNode<number>({
                    bypass: false,
                    input: 0
                }));
                chain.add(new ChainNode<number>({
                    bypass: false,
                    input: 1
                }));
                chain.remove(2);
            }
            catch(e: any) {
                expect(e).toBeInstanceOf(RangeError);
                expect(e.message).toBeDefined();
            }
        });
    })

    describe('exchange node', () => {
        test('arguments within range, from < to', () => {
            const chain = new Chain<number>();
            chain.add(new ChainNode<number>({
                bypass: false,
                mainOperation: addFive
            }));
            chain.add(new ChainNode<number>({
                bypass: false,
                mainOperation: subFive
            }));
            chain.swap(0, 1);
            expect((chain.nodes[0] as ChainNode<number>).mainOperation.getSymbol()).toBe(subFive.getSymbol())
            expect((chain.nodes[1] as ChainNode<number>).mainOperation.getSymbol()).toBe(addFive.getSymbol());
        });

        test('arguments within range, from > to', () => {
            const chain = new Chain<number>();
            chain.add(new ChainNode<number>({
                bypass: false,
                mainOperation: addFive
            }));
            chain.add(new ChainNode<number>({
                bypass: false,
                mainOperation: subFive
            }));
            chain.swap(1, 0);
            expect((chain.nodes[1] as ChainNode<number>).mainOperation.getSymbol()).toBe(addFive.getSymbol());
            expect((chain.nodes[0] as ChainNode<number>).mainOperation.getSymbol()).toBe(subFive.getSymbol());
        });

        test('arguments outside range, throws RangeError', () => {
            try {
                const chain = new Chain<number>();
                chain.add(new ChainNode<number>({
                    bypass: false,
                    mainOperation: addFive
                }));
                chain.add(new ChainNode<number>({
                    bypass: false,
                    mainOperation: subFive
                }));
                chain.swap(1, 5);
            }
            catch(e: any) {
                expect(e).toBeInstanceOf(RangeError);
                expect(e.message).toBeDefined();
            }
        });
    });

    describe('move node', () => {
        test('indices within range, moves node to correct position in chain', () => {
            const chain = new Chain<number>();
            [1, 2, 3].forEach(n => {
                chain.add(new ChainNode<number>({
                    input: n
                }));
            });

            chain.move(1, 2);
            expect((chain.nodes[1] as ChainNode<number>).input).toBe(3);
            expect((chain.nodes[2] as ChainNode<number>).input).toBe(2);
        });

        test('indices out of range, throws RangeError', () => {
            try {
                const chain = new Chain<number>();
                chain.add(new ChainNode<number>({
                    bypass: false,
                    mainOperation: addFive
                }));
                chain.add(new ChainNode<number>({
                    bypass: false,
                    mainOperation: subFive
                }));
                chain.move(0, 5);
            }
            catch(e: any) {
                expect(e).toBeInstanceOf(RangeError);
                expect(e.message).toBeDefined();
            }
        });
    });
});