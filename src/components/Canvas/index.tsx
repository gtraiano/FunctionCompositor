import style from './canvas.module.css';
import { useEffect, useRef, useState } from "react";
import { useStateValue } from "../../state";

interface CanvasProps {
    width: number,              // canvas width in px
    height: number,             // canvas height in px
    grid?: {                    // grid per axis
        x: {
            active?: boolean,   // draw
            gap?: number        // every gap px's
        },
        y: {
            active?: boolean,
            gap?: number
        }
    },
    axes?: {                    // draw axes
        x?: boolean,
        y?: boolean
    }
}

const Canvas = ({ width, height, grid, axes }: CanvasProps) => {
    const [{ input: { output } },] = useStateValue();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [options, setOptions] = useState({
        dimensions: { width, height },
        grid: {
            x: {
                active: grid?.x.active ?? true,
                gap: grid?.x.gap ?? 20
            },
            y: {
                active: grid?.y.active ?? true,
                gap: grid?.y.gap ?? 20
            }
        },
        axes: {
            x: axes?.x ?? true,
            y: axes?.y ?? true
        }
    });

    useEffect(() => {
        setupCanvas();
    }, [options.dimensions, canvasRef.current]);

    useEffect(() => {
        if(!canvasRef.current) {
            console.error('Canvas is undefined');
            return;
        }
        updateGraph(canvasRef.current, canvasRef.current.getContext('2d'), output);
    }, [output, grid, axes, options]);

    const setupCanvas = () => {
        if(canvasRef.current) {
            canvasRef.current.style.width = `${Math.floor(options.dimensions.width / window.devicePixelRatio)}px`;
            canvasRef.current.style.height = `${Math.floor(options.dimensions.height / window.devicePixelRatio)}px`;
            canvasRef.current.width = Math.floor(options.dimensions.width * window.devicePixelRatio);
            canvasRef.current.height = Math.floor(options.dimensions.height * window.devicePixelRatio);
            //canvasRef.current.getContext('2d')?.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    };
    
    const drawGrid = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.lineWidth = 0.25;
        if(options.grid.y.active) {
            for (let j = 0; j <= canvas.height; j = j + options.grid.y.gap) {
                ctx.moveTo(0, j - ctx.lineWidth/2);
                ctx.lineTo(canvas.width, j);
            }
        }
        if(options.grid.x.active) {
            for (let j = 0; j <= canvas.width; j = j + options.grid.x.gap) {
                ctx.moveTo(j, 0);
                ctx.lineTo(j, canvas.height);
            }
        }
        
        ctx.strokeStyle = 'green';
        ctx.stroke();
    };
    
    // AXIS
    const drawAxes = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(127,127,127,0.15)';
    
        if(options.axes.x) {
            //X axis
            for (let i = 0; i <= canvas.width; i++) {
                ctx.lineTo(i, canvas.height/2);
            }
        }
        
        if(options.axes.y) {
            //y axis
            for(let i = 0; i <= canvas.width; i += 180) { // draw vertical line every pi radians
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, canvas.height);
            }
        }
        ctx.stroke();
    };
    
    const drawGraphByCallback = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, callback: (x: number) => number) => {
        // prepare pen
        ctx.lineWidth = 1.75;
        ctx.strokeStyle = "rgb(0,0,0)";
    
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x++) {
            ctx.lineTo(x, canvas.height/2 * (1 - callback(x)));
        }
        ctx.stroke();
    };
    
    const drawGraphByPoints = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, points: number[][]) => {
        // prepare pen
        ctx.lineWidth = 1.75;
        ctx.strokeStyle = "rgb(0,0,0)";
    
        ctx.beginPath();
        points.forEach(([x, y]) => {
            ctx.lineTo(x, canvas.height/2 - y);
        });
        ctx.stroke();
    };
    
    const updateGraph = (canvas: HTMLCanvasElement | null, ctx: CanvasRenderingContext2D | null, method: number[][] | ((x: number) => number)) => {
        if(!canvas || !ctx) {
            console.error('Canvas element is undefined');
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(canvas, ctx);
        drawAxes(canvas, ctx);
        if(typeof method === 'function') drawGraphByCallback(canvas, ctx, method);
        else if(method instanceof Array) drawGraphByPoints(canvas, ctx, method);
    };

    const drawMenu = () => {
        return (
            <div className={style['options-menu']}>
                <ul>
                    <li className={style['header']}>grid</li>
                    <li className={style['multi']}>
                        <input
                            type='checkbox' id='draw-grid-x' checked={options.grid.x.active}
                            onChange={() => { setOptions(o => (
                                { ...o, grid: { ...o.grid, x: { ...o.grid.x, active: !o.grid.x.active} } }))
                            }}
                        />
                        <label htmlFor='draw-grid-x'>X</label>
                        
                        <label htmlFor='grid-gap-x'>gap</label>
                        <input
                            type='number' min='5' value={options.grid.x.gap} disabled={!options.grid.x.active}
                            onChange={(e) => { setOptions(o => (
                                { ...o, grid: { ...o.grid, x: { ...o.grid.x, gap: e.target.valueAsNumber } } }))
                            }}
                        />
                    </li>
                    <li className={style['multi']}>
                        <input
                            type='checkbox' id='draw-grid-y' checked={options.grid.y.active}
                            onChange={() => { setOptions(o => (
                                { ...o, grid: { ...o.grid, y: { ...o.grid.y, active: !o.grid.y.active} } }))
                            }}
                        />
                        <label htmlFor='draw-grid-y'>Y</label>
                        
                        <label htmlFor='grid-gap-y'>gap</label>
                        <input
                            type='number' min='5' value={options.grid.y.gap} disabled={!options.grid.y.active}
                            onChange={(e) => { setOptions(o => (
                                { ...o, grid: { ...o.grid, y: { ...o.grid.y, gap: e.target.valueAsNumber } } }))
                            }}
                        />
                    </li>
                    
                    <li className={style['header']}>axes</li>
                    <li className={style['multi']}>
                        <input
                            type='checkbox' id='draw-axis-x' checked={options.axes.x}
                            onChange={() => { setOptions(o => ({ ...o, axes: { ...o.axes, x: !o.axes.x } })) }}
                        />
                        <label htmlFor='draw-axis-x'>X</label>

                        <input
                            type='checkbox' id='draw-axis-y' checked={options.axes.y}
                            onChange={() => { setOptions(o => ({ ...o, axes: { ...o.axes, y: !o.axes.y } })) }}
                        />
                        <label htmlFor='draw-axis-y'>Y</label>
                    </li>

                    <li className={style['header']}>size</li>
                    <li className={style['multi']}>
                        <label htmlFor='dimensions-x'>X</label>
                        <input
                            type='number' id='dimensions-x' value={options.dimensions.width}
                            onChange={(e) => { setOptions(o => ({ ...o, dimensions: { ...o.dimensions, width: e.target.valueAsNumber } })) }}
                        />
                        
                        <label htmlFor='dimensions-y'>Y</label>
                        <input
                            type='number' id='dimensions-y' value={options.dimensions.height}
                            onChange={(e) => { setOptions(o => ({ ...o, dimensions: { ...o.dimensions, height: e.target.valueAsNumber } })) }}
                        />
                    </li>
                </ul>
            </div>
        );
    };
    
    return (
        <div className={style['canvas-container']}>
            <button
                className={style['options-btn']}
                onClick={(e) => { e.currentTarget.classList.toggle(style['active']); }}
            >
                options
            </button>
            {drawMenu()}
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default Canvas;