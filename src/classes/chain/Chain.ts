import { Calculate } from "../../types";
import ChainNode from "./ChainNode";

class Chain<T> implements Calculate<T> {
    nodes: Array<ChainNode<T> | Chain<T>>; // node can be a regular node or a chain
    
    constructor() {
        this.nodes = [];
    }

    /**
     * Inserts a node to a given index in the chain
     * @param node node to insert
     * @param index index in chain to insert node (if undefined, appends node to chain)
     */
    add = (node: ChainNode<T> | Chain<T>, index?: number) => {
        if(!node) throw Error('Chain.add: node must not be null or undefined');
        // append to tail
        if(index === undefined) this.nodes.push(node);
        // insert at given index
        else {
            if(index < 0 || index > this.nodes.length - 1) throw RangeError(`Chain.add: index ${index} is out of range`);
            this.nodes.splice(index, 0, node);
        }
    }

    /**
     * Remove node at given index from chain
     * @param index index of node to remove (if undefined, removes chain tail node)
     */
    remove = (index?: number) => {
        // remove from tail
        if(index === undefined) this.nodes.pop();
        // remove from given index
        else {
            if(index < 0 || index > this.nodes.length - 1) throw RangeError(`Chain.remove: index ${index} is out of range`);
            this.nodes.splice(index, 1);
        }
    }

    /**
     * Swap positions of two nodes in chain
     * @param from index of node to be exhanged
     * @param to index of node to be exchanged
     */
    swap = (from: number, to: number) => {
        if(from < 0 || from > this.nodes.length) throw RangeError(`Chain.move: argument from=${from} is out of range`);
        if(to < 0 || to > this.nodes.length) throw RangeError(`Chain.move: argument to=${to} is out of range`);
        // does not take into account if either node is a chain
        [this.nodes[from], this.nodes[to]] = [this.nodes[to], this.nodes[from]];
        //this.nodes = [...this.nodes.slice(0, from), this.nodes[to], ...this.nodes.slice(from + 1, to), this.nodes[from]];
    }

    /**
     * Move node to a different position in chain
     * @param from source node index
     * @param to target index to move
     */
    move = (from: number, to: number) => {
        if(from < 0 || from > this.nodes.length || from === undefined) throw RangeError(`Chain.move: argument from=${from} is out of range`);
        if(to < 0 || to > this.nodes.length || to === undefined) throw RangeError(`Chain.move: argument to=${to} is out of range`);
        const toMove = this.nodes.splice(from, 1)[0];
        this.nodes.splice(to, 0, toMove);
    }

    private setAllInputs = (value: T) => {
        this.nodes.forEach(n => {
            if(n instanceof ChainNode<T>) (n as ChainNode<T>).input = value;
            else if(n instanceof Chain<T>) {
                for(let i = 0; i < n.nodes.length; i++) {
                    (n.nodes[i] as ChainNode<T>).input = value;
                }
            }
        });
    }

    private clearInitialNodeInput = () => {
        // set input of first node to undefined
        if(this.nodes[0] instanceof ChainNode<T>) (this.nodes[0] as ChainNode<T>).input = undefined as T;
        else if((this.nodes[0] instanceof Chain<T>) && (this.nodes[0].nodes.length)) {
            (this.nodes[0].nodes[0] as ChainNode<T>).input = undefined as T;
        }
    }

    calculate = async (t: T) => {
        let calc: T = undefined as T;
        
        for(let i = 0; i < this.nodes.length; i++) {
            // current node output
            calc = await this.nodes[i].calculate(t);
            // pass forward current node's output
            // next node is a chain and has at least 1 node
            if(
                (this.nodes[i+1] instanceof Chain<T>)
                && ((this.nodes[i+1] as Chain<T>).nodes.length)
            ) {
                // set current node's output as first node's input
                ((this.nodes[i+1] as Chain<T>).nodes[0] as ChainNode<T>).input = calc;
            }
            // next node is a regular node
            else if(this.nodes[i+1] instanceof ChainNode<T>) {
                (this.nodes[i+1] as ChainNode<T>).input = calc;
            }
        }
        // reset initial input of chain for next call of calculate()
        this.clearInitialNodeInput();
        return calc;
    }

    /**
     * Calculate a series of input values
     * @param t input values array
     * @returns an array y of outputs, where y[i] is the calculated output for input t[i]
     */
    calculateSeries = async (t: T[]) => {
        const calc: T[] = [];
        for(const ct of t) {
            const v = await this.calculate(ct);
            calc.push(v);
        }
        return calc;
    }

    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                return {
                    done: index > this.nodes.length - 1,
                    value: this.nodes[index++]
                }
            }
        }
    }
}

export default Chain;