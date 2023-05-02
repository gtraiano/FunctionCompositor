import { useEffect } from 'react';
import style from './style.module.css'

interface OverlayProps {
    children: React.ReactNode,
    show: boolean,
    onClose?: () => void
}

const Overlay = ({ children, show, onClose }: OverlayProps) => {
    useEffect(() => {
        document.documentElement.classList[show ? 'add' : 'remove'](style['no-overflow']);
    }, [show]);
    
    if(!show) return null;

    return (
        <div
            className={style['overlay']}
            tabIndex={0}
            onKeyDown={e => { e.key === 'Escape' && onClose && onClose() }}
        >
            {onClose && <span className={style['close-btn']} onClick={onClose} />}
            {children}
        </div>
    );
};

export default Overlay;