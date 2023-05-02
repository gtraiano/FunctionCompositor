import style from './style.module.css';

const BusyScreen = () => {
    return (
        <>
        <div className={style['busy']} />
        <span className={style['label']}/>
        </>
    );
};

export default BusyScreen;