import React, { Fragment } from 'react';

import classes from './layout.module.scss';

const layout = (props: any) => {

    return (
        <Fragment>
            <header className={classes.header}>
                VisualFabric by Rafał Adamski - Thesis<br/>
                Military University of Technology
            </header>
            <main className={classes.layout}>
                {props.children}
            </main>
        </Fragment>
    );
}

export default layout;