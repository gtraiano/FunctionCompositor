import style from './style.module.css';
import { DragEvent, ReactNode, useEffect, useRef } from "react";

/**
 * Draggable component props
 * @param children container content
 * @param onDragStart drag event listener to run alongside the container's default listener
 * @param onDrop drop event listener to run alongside the container's default listener
 * @param onDragOver dragover event listener to run alongside the container's default listener
 * @param onDragLeave dragleave event listener to run alongside the container's default listener
 */
interface DraggableProps {
    children: ReactNode,
    onDragStart?: (e: DragEvent) => void,
    onDrop?: (e: DragEvent) => void,
    onDragOver?: (e: DragEvent) => void,
    onDragLeave?: (e: DragEvent) => void,
};

/**
 * Wraps a component inside a draggable div.
 * Dragging action takes place only on container, whereas the content is rendered non-draggable.
 * @param props 
 * @returns 
 */
const Draggable = (props: DraggableProps) => {
    const defaultOnDragStart = (e: DragEvent) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        props.onDragStart && props.onDragStart(e);
    };

    const defaultOnDragOver = (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.classList.add(style['drag-over']);
        props.onDragOver && props.onDragOver(e);
    };

    const defaultOnDragLeave = (e: DragEvent) => {
        e.stopPropagation();
        e.currentTarget.classList.remove(style['drag-over']);
        props.onDragLeave && props.onDragLeave(e);
    };

    const defaultOnDrop = (e: DragEvent) => {
        e.stopPropagation();
        e.currentTarget.classList.remove(style['drag-over']);
        props.onDrop && props.onDrop(e);
        console.log(e.target, e.currentTarget);
    };

    const ref = useRef<HTMLDivElement>(null);

    const dragHandler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
    }

    useEffect(() => {
        if(ref.current && ref.current.childElementCount) {
            // set all top level children as draggable
            // and attach default drag event listener to prevent drag action on content
            [...ref.current.children].forEach(c => {
                c.setAttribute('draggable', 'true');
                c.addEventListener('dragstart', dragHandler);
            });
        }
        return () => {
            ref.current && ref.current.childElementCount
            && [...ref.current.children].forEach(c => {
                c.removeEventListener('dragstart', dragHandler);
            });
        }
    }, [ref.current]);
    
    return (
        <div
            ref={ref}
            className={style['draggable']}
            draggable
            onDragStart={defaultOnDragStart}
            onDragOver={defaultOnDragOver}
            onDragLeave={defaultOnDragLeave}
            onDrop={defaultOnDrop}
        >
            {props.children}
        </div>
    );
};

export default Draggable;