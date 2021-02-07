import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Item from './item';

const TreeComponent = observer(class Tree extends Component {
	render() {
		const { parentId, items, move } = this.props;
		/* items即 data数据
		  {
			id: 1,
			type: 'View',
			childrens: []
		} */
		return (
			<>
				{items && items.length
					? items.map(item => {
						return <Item parentId={parentId} key={item.id} item={item} move={move} />;
					})
					: null}
			</>
		);
	}
});

export default TreeComponent;
