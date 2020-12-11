import React, { Fragment } from 'react';

import classes from './layout.module.scss';

const layout = (props: any) => {

    return (
        <Fragment>
            <header>
                by Rafał Adamski &copy; 2020
            </header>
            <main className={classes.Layout}>
                {props.children}
            </main>
        </Fragment>
    );
}

export default layout;