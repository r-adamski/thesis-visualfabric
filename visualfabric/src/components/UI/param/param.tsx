import React from 'react';
import classes from './param.module.scss'

const param = (props: any) => {

    return (
        <p className={classes.param}>{props.title}<b className={classes.dots}>:</b><span>{props.val}</span></p>
    );
}

export default param;