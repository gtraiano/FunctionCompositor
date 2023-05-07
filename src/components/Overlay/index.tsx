import { useEffect } from 'react';
import style from './style.module.css';

interface OverlayProps {
    children: React.ReactNode,      // component content
    show: boolean,                  // controls whether component is displayed or not
    onClose?: () => void,           // callback to run on close button click
    hideBodyOverflow?: boolean      // hide document body overflow
}

const Overlay = ({ children, show, onClose, hideBodyOverflow = false }: OverlayProps) => {
    useEffect(() => {
        hideBodyOverflow && document.documentElement.classList[show ? 'add' : 'remove'](style['no-overflow']);
    }, [show]);
    
    if(!show) return null;

    return (
        <div
            className={style['overlay']}
            tabIndex={0}
            onKeyDown={e => { e.key === 'Escape' && onClose && onClose(); }}
        >
            {onClose && <span className={style['close-btn']} onClick={onClose} />}
            {children}
        </div>
    );
};

export default Overlay;