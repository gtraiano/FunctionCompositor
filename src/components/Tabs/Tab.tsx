import style from "./style.module.css";

interface TabProps {
    children: React.ReactNode;  // content
    title: string;              // text to display in tab title
}

const Tab: React.FC<TabProps> = ({ children }: TabProps) => {
    return <div className={style["tab"]}>{children}</div>;
};

export default Tab;
