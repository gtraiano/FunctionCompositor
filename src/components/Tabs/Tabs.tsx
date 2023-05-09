import style from "./style.module.css";
import { Children, ReactElement, useState } from "react";
import TabTitle from "./TabTitle";

interface TabsProps {
    children: ReactElement | ReactElement[];
};

const Tabs: React.FC<TabsProps> = ({ children }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <div className={style["tab-container"]}>
            <ul className={style["tab-titles"]}>
            {
                Children.map(children, (item, index) => (
                    <TabTitle
                        key={index}
                        title={item.props.title}
                        index={index}
                        setActive={setSelectedTab}
                        active={index === selectedTab}
                    />
                ))
            }
            </ul>
            {Children.toArray(children)[selectedTab]}
        </div>
    );
};

export default Tabs;
