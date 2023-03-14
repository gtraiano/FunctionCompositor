import { ChainOperationTarget } from "../state/actions/chain";

export const onCalculateSeries = {
    eventName: 'onCalculateSeries',
    dispatch: (target: HTMLElement) => {
        target.dispatchEvent(
            new Event(onCalculateSeries.eventName, { bubbles: true })
        );
    }
};

export interface OperationChangeEventProps {
    index: number,
    value: any,
    opTarget: ChainOperationTarget | undefined
};

export const onBypassChange = {
    eventName: 'onBypassChange',
    dispatch: (target: HTMLElement,  { index, value, opTarget }: OperationChangeEventProps) => {
        target.dispatchEvent(
            new CustomEvent(
                onBypassChange.eventName,
                {
                    bubbles: true,
                    detail: { index, value }
                }
            )
        );
    }
}

export const onFrequencyChange = {
    eventName: 'onFrequencyChange',
    dispatch: (target: HTMLElement,  { index, value, opTarget }: OperationChangeEventProps) => {
        target.dispatchEvent(
            new CustomEvent(
                onFrequencyChange.eventName,
                {
                    bubbles: true,
                    detail: { index, value, opTarget }
                }
            )
        );
    }
};

export const onPhaseChange = {
    eventName: 'onPhaseChange',
    dispatch: (target: HTMLElement,  { index, value, opTarget }: OperationChangeEventProps) => {
        target.dispatchEvent(
            new CustomEvent(
                onPhaseChange.eventName,
                {
                    bubbles: true,
                    detail: { index, value, opTarget }
                }
            )
        );
    }
};

export const onAmplitudeChange = {
    eventName: 'onAmplitudeChange',
    dispatch: (target: HTMLElement, { index, value, opTarget }: OperationChangeEventProps) => {
        target.dispatchEvent(
            new CustomEvent(
                onAmplitudeChange.eventName,
                {
                    bubbles: true,
                    detail: { index, value, opTarget }
                }
            )
        );
    }
};

export const onOffsetChange = {
    eventName: 'onOffsetChange',
    dispatch: (target: HTMLElement, { index, value, opTarget }: OperationChangeEventProps) => {
        target.dispatchEvent(
            new CustomEvent(
                onOffsetChange.eventName,
                {
                    bubbles: true,
                    detail: { index, value, opTarget }
                }
            )
        );
    }
};

export const onEditNode = {
    eventName: 'onEditNode',
    dispatch: (target: HTMLElement, index: number) => {
        target.dispatchEvent(
            new CustomEvent(
                onEditNode.eventName,
                {
                    bubbles: true,
                    detail: { index }
                }
            )
        );
    }
};

export const onDeleteNode = {
    eventName: 'onDeleteNode',
    dispatch: (target: HTMLElement, index: number) => {
        target.dispatchEvent(
            new CustomEvent(
                onDeleteNode.eventName,
                {
                    bubbles: true,
                    detail: { index }
                }
            )
        );
    }
};

export default {
    onCalculateSeries,
    onBypassChange,
    onFrequencyChange,
    onPhaseChange,
    onAmplitudeChange,
    onOffsetChange,
    onDeleteNode
};