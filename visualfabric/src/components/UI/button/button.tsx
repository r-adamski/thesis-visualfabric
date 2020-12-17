import React from 'react';
import classes from './button.module.scss'

const button = (props: any) => {

    const classList = [classes.button, props.className];
    switch (props.type){
        case 'danger':
            classList.push(classes.danger);
            break;
        default:
            classList.push(classes.info);
    }

    return (
        <button className={classList.join(' ')} onClick={props.action}>{props.children}</button>
    );
}

export default button;