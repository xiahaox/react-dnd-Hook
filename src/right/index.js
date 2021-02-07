import React, { Component, useContext } from 'react';
// import { observer } from 'mobx-react';
import { Context } from '../reducer'
import List from './list';
const Right = () => {
    const { dispatch, state } = useContext(Context)
    // const { data, moveItem } = this.props;
    // console.log(JSON.stringify(data));
    console.log(state);
    const data = state
    return (
        <div className="right" >
            <List parentId={null} items={state} dispatch={dispatch} />
        </div>
    )
};

export default Right;
