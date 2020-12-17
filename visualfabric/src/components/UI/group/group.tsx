import React from 'react';
import classes from './group.module.scss'

const group = (props: any) => {

    let type = '';
    switch (props?.type) {
        case 'object':
            type = classes.object;
            break;
        default:
            type = '';
    }

    return (
        <div className={[classes.group, props.className, type].join(' ')}>
            <h3>{props.name}</h3>
            {props.children}
        </div>
    );
}

export default group;