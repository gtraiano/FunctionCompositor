import style from "./style.module.css";
import { Children, ReactElement, useEffect, useState } from "react";
import TabTitle from "./TabTitle";
import { TabProps } from "./Tab";

interface TabsProps {
    children: ReactElement | ReactElement[];
};

const Tabs: React.FC<TabsProps> = ({ children }) => {
    // first tab set as default
    const defaultIndex = Children.toArray(children).findIndex(item => (item as ReactElement<TabProps>).props.default === true);
    const [selectedTab, setSelectedTab] = useState(defaultIndex !== -1 ? defaultIndex : 0);

    useEffect(() => {
        // warn if more than one tabs have been set as default
        const defaultTabsCount = Children.toArray(children)
            .reduce<number>(
                (count, item) => count + ((item as ReactElement<TabProps>).props.default ? 1 : 0),
                0
            );
        if(defaultTabsCount > 1) {
            console.warn(`Tabs: ${defaultTabsCount} tabs have been set as default, viewing tab "${(Children.toArray(children)[selectedTab] as ReactElement<TabProps>).props.title}" [${selectedTab}] as default`);
        }
    }, []);

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
