import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Item from './item';

class List extends Component {
	render() {
		const { parentId, items, dispatch } = this.props;
		/* items即 data数据
		[
			{
			id: 0,
			type: 'box',
			childrens: []
			}
		]  
		*/
		// console.log(items);
		return (
			<>
				{items && items.length
					? items.map(item => {
						return <Item parentId={parentId} dispatch={dispatch} key={item.id} item={item} />;
					})
					: null}
			</>
		);
	}
}

export default List;
