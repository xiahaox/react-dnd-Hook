import React, { useContext } from 'react';
import { DragSource } from 'react-dnd';
import { Context } from '../reducer'




// const { dispatch, state } = useContext(Context);
const source = {
    // 开始拖拽钱组织数据结构
    beginDrag(props, monitor, component) {
        return {
            type: props.name
        };
    },

    endDrag(props, monitor) {
        const item = monitor.getItem();
        const result = monitor.getDropResult();  //drop return 值
        // 确定组件已经放置到右侧区域，有结果返回的时候，调用新增组件的方法
        if (monitor.didDrop() && result) {
            // props.onEndDrag(result.id, item.type);
            props.dispatch({
                type: 'additem',
                payload: { targetId: result.id, type: item.type }
            });
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),  //使用 connectDragSource 包裹住 DOM 节点，使其可以接受各种拖动 API
        isDragging: monitor.isDragging()  // 是否处于拖拽状态
    };
}

function SourceBox(props) {
    const { connectDragSource, isDragging, children, name } = props;
    const classes = isDragging ? 'active' : '';

    return connectDragSource(
        <div className={classes} name={name}>
            {children}
        </div>,
        { dropEffect: 'copy' }
    );
}

export default DragSource('ITEM', source, collect)(SourceBox);
