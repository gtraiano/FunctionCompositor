import { useEffect } from "react";
import style from "./style.module.css";

export interface TabProps {
    children: React.ReactNode;  // content
    title: string;              // text to display in tab title
    default?: boolean;          // is default active tab
    onActive?: () => void;      // callback to run when tab is set active
}

const Tab: React.FC<TabProps> = ({ children, onActive }: TabProps) => {
    useEffect(() => {
        typeof onActive === 'function' && onActive();
    }, []);

    return <div className={style["tab"]}>{children}</div>;
};

export default Tab;
