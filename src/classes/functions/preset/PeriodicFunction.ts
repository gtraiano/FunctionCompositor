import { GenericFunctionProps } from "../GenericFunction";
import ArithmeticFunction from "./ArithmeticFunction";

export interface PeriodicFunctionProps extends GenericFunctionProps<number> {
    frequency?: number; // frequency
    phase?: number;     // phase
    amplitude?: number; // factor to multiply output by
}

export class PeriodicFunction extends ArithmeticFunction {
    private frequency: number;
    private phase: number;
    private amplitude: number;
    
    constructor(config: PeriodicFunctionProps) {
        super(config);
        this.frequency = config.frequency ?? 1;
        this.phase = config.phase ?? 0;
        this.amplitude = config.amplitude ?? 1;
        this.cbWithArgs = (t: number) => this.amplitude * this.callback(t, this.frequency, this.phase)(this.getOffset());
        
        this.calculate = (t: number) => new Promise<number>((resolve) => {
            resolve(this.cbWithArgs(t));
        });
    }

    getFrequency = () => this.frequency;

    setFrequency = (f: number) => {
        if(f <= 0) throw Error('PeriodicFunction.setFrequency: frequency value must be greater than 0');
        this.frequency = f;
    }

    getAmplitude = () => this.amplitude;
    
    setAmplitude = (amp: number) => {
        if(amp < 0) throw Error('PeriodicFunction.setAmplitude: amplitude value must be greater than or equal to 0');
        this.amplitude = amp;
    }

    getPhase = () => this.phase;

    setPhase = (p: number) => {
        this.phase = p;
    }
}

export default PeriodicFunction;