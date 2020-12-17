import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions';
import classes from './advancedBlock.module.scss';
import Button from '../../components/UI/button/button';
import Header from '../../components/BlockParts/header';
import Metadata from '../../components/BlockParts/metadata';
import Data from '../../components/BlockParts/blockData';

const advancedBlock = (props: any) => {

    //show/hide
    let classList = [classes.advBlock];
    if (props.visible){
        classList.push(classes.visible);
    }

    if(props.blockData !== null){

        const header = props.blockData.data.header;
        const data = props.blockData.data.data;
        const metadata = props.blockData.data.metadata;

        return (
            <div className={classList.join(' ')}>

                <Button className={classes.closeBtn} type='danger'
                    action={() => props.hideAdvancedBlock()}>
                    Close
                </Button>

                <h2>Block <span className={classes.number}>#{header.number}</span></h2>

                <Header data={header} className={classes.header}/>

                <Data data={data} className={classes.data}/>

                <Metadata data={metadata} className={classes.metadata} />

            </div>
        );

    }
    else {
        return (
            <div className={classList.join(' ')}>
            </div>
        );
    }
}


const mapStateToProps = (state: any) => {
    return {
      blockData: state.block.blockData,
      visible: state.block.visible
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
      hideAdvancedBlock: () => dispatch(actions.hideAdvancedBlock())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(advancedBlock);