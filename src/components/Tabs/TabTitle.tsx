import style from "./style.module.css";

type TabTitleProps = {
    title: string;                              // tab title text
    index: number;                              // tab index
    setActive: (index: number) => void;         // set tab title active
    active: boolean;                            // tab title is active
};

const TabTitle: React.FC<TabTitleProps> = ({
    title,
    setActive,
    index,
    active,
}) => {
    return (
        <li
            className={
                [style["tab-title"], active ? style["active"] : undefined]
                    .filter((c) => c)
                    .join(" ")
            }
        >
            <button type='button' onClick={() => setActive(index)}>{title}</button>
        </li>
    );
};

export default TabTitle;
