import React, { Fragment, useRef } from 'react';
import classes from './search.module.scss'

const Search = (props: any) => {

    const nr: any = useRef();
    const write: any = useRef();

    const nrChanged = (e: any) => {
        write.current.value = null;
        let val = e.target.value;
        if(val === '') {
            props.setNr(-1);
        }
        else{
            props.setNr(val);
        }
    }

    const writesChanged = (e: any) => {
        nr.current.value = null;
        let val = e.target.value;
        if(val === '') {
            props.setWrite('');
        }
        else{
            props.setWrite(val);
        }
    }

    return (
        <nav className={classes.nav}>
            <div className={classes.nr}>
                <label htmlFor="BlockNr">Find block number:</label>
                <input ref={nr} id="BlockNr" type="number" onChange={nrChanged} />
            </div>

            <div className={classes.writes}>
                <label htmlFor="BlockWrites">Find in writes:</label>
                <input ref={write} id="BlockWrites" type="text" onChange={writesChanged}/>
            </div>
        </nav>
    );
}

export default Search;