import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observer } from 'mobx-react';
import { DragSource, DropTarget } from 'react-dnd';
import './index.css'
import List from './list';
import Components from './components';

const source = {
	/**
	 * 拖拽前为组件增加一些属性
	 * @param {*} props
	 */
	beginDrag(props) {
		const { parentId, item } = props;
		// console.log(props);
		const { id, type, childrens } = item;
		return {
			id,
			parentId,
			type,
			items: childrens
		};
	},

	/**
	 * 限制组件是否可拖拽
	 * @param {*} props
	 */
	canDrag(props) {
		if (props.item.id === 0) return false;
		return true;
	},

	/**
	 * 当前组件是否处于拖拽中
	 * @param {*} props
	 * @param {*} monitor
	 */
	isDragging(props, monitor) {
		return props.item.id === monitor.getItem().id;
	},

	/**
	 * 我们认为当一个组件停止拖拽时移动中的位置都是在查找合适的的位置，只有在停止的时候才是它真正想要放置的位置
	 * @param {*} props
	 * @param {*} monitor
	 */
	endDrag(props, monitor) {
		const result = monitor.getDropResult();
		if (result.dragItem) {
			const { dragItem, overItem } = result;
			// props.move(dragItem, overItem);
			const { draggedId, dragParentId } = dragItem;
			const { overId, overParentId } = overItem;
			if (result.moveShift) {
				//同级拖拽
				props.dispatch({
					type: 'moveShift',
					payload: { dragItem, overItem }
				});

			} else {
				//view与box之间拖拽
				props.dispatch({
					type: 'moveItem',
					payload: { dragItem, overItem }
				});
			}

		}
	}
};

function sourceCollect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging()
	};
}

const target = {
	/**
	 * 是否可以将拖拽的元素放置
	 * @param {*} props
	 * @param {*} monitor
	 */
	canDrop(props, monitor) {
		// 在此处可以获取到拖拽的组件类型，从而增加一些是否可以放置的条件
		// const dragType = monitor.getItem().type;
		// // 放置的组件类型
		// const dropType = props.item.type;
		return true;
	},
	/**
	 * 使用drop而未使用hover是不想一直更改数据结构
	 * @param {*} props
	 * @param {*} monitor
	 */
	drop(props, monitor, component) {
		// console.log(component);
		const didDrop = monitor.didDrop();
		if (didDrop) {
			return undefined;
		}
		const { id: draggedId, parentId: dragParentId } = monitor.getItem();
		const { parentId: overParentId } = props;
		const { id: overId, type: targetType } = props.item;
		console.log("-------------drop-props", props);
		// if (props.item.type !== "Box" && props.item.type !== "View") return undefined;
		/* 
			monitor.getItem()：    {type: "View"}    来自beginDrag return的
			props :  {parentId: null, item: Proxy, move: ƒ}   来自父级属性
		*/
		// console.log(monitor.getItem());
		console.log("draggedId:", draggedId, "dragParentId:", dragParentId); //来自beginDrag return的 ----即 拖拽节点的属性
		console.log("overParentId:", overParentId, "overId:", overId); //来自父级属性			----即 被接收容器的属性

		if (draggedId) { //右侧内部拖拽
			if (draggedId === overId || draggedId === overParentId || dragParentId === overId) return undefined;
			if (dragParentId === overId) return undefined;
			// return {
			// 	dragItem: { draggedId, dragParentId },
			// 	overItem: { overId, overParentId }
			// };
			if (dragParentId == overParentId && targetType != "View") { //同层切换顺序
				const hoverBoundingRect = (findDOMNode(component)).getBoundingClientRect();
				// console.log(hoverBoundingRect);
				// 获取中点垂直坐标
				const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;//放置目标节点中心点
				// 确定鼠标位置
				const clientOffset = monitor.getClientOffset();
				// 获取距顶部距离
				const hoverClientY = (clientOffset).y - hoverBoundingRect.top;  //鼠标距放置节点top的距离

				console.log(hoverClientY, hoverMiddleY);
				if (hoverClientY != hoverMiddleY && dragParentId == overParentId) {//同级拖拽
					return {
						dragItem: { draggedId, dragParentId },
						overItem: { overId, overParentId },
						moveShift: 1
					}
				}
			} else {
				//非切换顺序
				return {
					dragItem: { draggedId, dragParentId },
					overItem: { overId, overParentId }
				};

			}
		}
		// 左侧拖右侧
		return { id: overId, overParentId: overParentId, targetType: targetType };  //来自上一级 data数据里的item的id-----即被接收容器的id
	}
};

function targetCollect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver({ shallow: true }),
		canDrop: monitor.canDrop()
	};
}
class Item extends Component {
	constructor(props) {
		super(props)
		this.state = {
			hover: false
		}
	}

	render() {
		const { connectDropTarget, connectDragSource, canDrop, isOver, item, dispatch } = this.props;
		const { id, type, childrens } = item;
		const CurrentComponet = Components[type];
		const classes = (canDrop && isOver) ? 'activeHover' : '';

		// console.log(classes);
		return (
			<div >
				<CurrentComponet
					id={id}
					type={type}
					className={`item ${classes}`}
					// className={item.type == 'Box' ? '' : 'bbb'}
					ref={instance => {
						// console.log("-----render", instance);
						// eslint-disable-next-line
						// const node = instance && (instance.props.type == "Box" || instance.props.type == "View") ? findDOMNode(instance) : ""
						connectDragSource(findDOMNode(instance));
						connectDropTarget(findDOMNode(instance));
					}}>
					<List dispatch={dispatch} parentId={id} items={childrens} />
				</CurrentComponet>
			</div>
		);
	}
}

export default DropTarget('ITEM', target, targetCollect)(DragSource('ITEM', source, sourceCollect)(Item));
// export default DropTarget('ITEM', target, targetCollect)(Item);

