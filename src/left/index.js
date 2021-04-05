import React, { useContext } from 'react';
import { Menu } from 'cloud-react';
import SourceBox from './SourceBox';
import { Context } from '../reducer'
const { MenuItem } = Menu;

const types = ['View', 'Text', 'Button', 'Button3'];

export default function Left() {
    const { dispatch, state } = useContext(Context);
    return (
        <Menu>
            {
                types.map((type, index) => {
                    return (
                        <SourceBox dispatch={dispatch} name={type} key={index}>
                            <MenuItem>{type}</MenuItem>
                        </SourceBox>
                    )
                })
            }
        </Menu>
    )
}