import React from 'react';
import {Signature, BlockData, Action, RWSet, Write} from '../../../../interfaces';
import {connect, useDispatch} from 'react-redux';
import * as actions from '../../store/actions';
import classes from './advancedBlock.module.scss';
import Param from '../../components/UI/param/param';
import Group from '../../components/UI/group/group';

const advancedBlock = (props: any) => {


    return (
        <div className={classes.block}>
            test
        </div>
    );
}


const mapStateToProps = (state: any) => {
    return {
      blockData: state.blockData,
      visible: state.visible
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
      hideAdvancedBlock: () => dispatch(actions.hideAdvancedBlock())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(advancedBlock);