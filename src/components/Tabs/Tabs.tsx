import style from "./style.module.css";
import { Children, ReactElement, useState } from "react";
import TabTitle from "./TabTitle";

type TabsProps = {
    children: ReactElement[];
};

const Tabs = ({ children }: TabsProps) => {
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
            {children[selectedTab]}
        </div>
    );
};

export default Tabs;
