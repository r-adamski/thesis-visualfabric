import React from 'react';
import classes from './group.module.scss'

const group = (props: any) => {

    return (
        <div className={[classes.group, props.className].join(' ')}>
            <h3>{props.name}</h3>
            {props.children}
        </div>
    );
}

export default group;