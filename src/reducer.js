
import React, { createContext, useReducer } from 'react'

const initState = [
    {
        id: 0,
        type: 'Box',
        childrens: []
    }
];
function findItem(dataList, id) {
    let result = null;
    dataList.forEach(item => {
        const loop = data => {
            if (data.id === id) {
                result = data;
                return result;
            }

            const childs = data.childrens;
            if (childs) {
                for (let i = 0; i < childs.length; i += 1) {
                    loop(childs[i]);
                }
            }
        };

        loop(item);
    });

    return result;
}
const removeNode = (state, removeId, parentId) => {
    const item = findItem(state, parentId);
    const index = item.childrens.findIndex(child => child.id === removeId);
    item.childrens.splice(index, 1);
}
function reducer(state, action) {
    switch (action.type) {
        case 'additem':
            const { targetId, type, over_ParentId, targetType } = action.payload;
            // console.log(type, targetId, over_ParentId, targetType);

            let item;
            if (targetType == "Box" || (targetType == "View" && type !== targetType)) {
                //push 到box

                item = findItem(state, targetId);

            } else {
                item = findItem(state, over_ParentId);
                if (item.type == "View" && type == "View") { //阻止嵌套View组件
                    return state
                }
            }

            const obj = {
                id: Math.ceil(Math.random() * 10000),
                type
            };
            if (type == "View") {
                obj.childrens = []
            }
            item.childrens.push(obj)
            console.log(state);
            // 进行深拷贝 分配新数组
            const a = JSON.parse(JSON.stringify(state))
            return a
        case 'moveItem':
            var { dragItem, overItem } = action.payload;
            var { draggedId, dragParentId } = dragItem;
            var { overId, overParentId } = overItem;

            const Item = { ...findItem(state, draggedId) };
            const target = findItem(state, overId);
            const overParentITem = findItem(state, overParentId);
            const dragParentIdITem = findItem(state, dragParentId);
            // console.log(JSON.stringify(Item));
            // console.log(JSON.stringify(target));
            // console.log(overParentITem);
            // console.log(dragParentIdITem);
            if (Item.type == "View") {
                return state
            }
            removeNode(state, draggedId, dragParentId);
            //push到当前view/BOx层
            if (target.type == "View" || target.type == "Box") {
                target.childrens.push(Item)
            } else {
                overParentITem.childrens.push(Item)
            }
            const b = JSON.parse(JSON.stringify(state))
            return b
        case 'moveShift':
            console.log(state);
            var { dragItem, overItem } = action.payload;
            var { draggedId, dragParentId } = dragItem;
            var { overId, overParentId } = overItem;
            const moveShiftItem1 = { ...findItem(state, draggedId) };
            const moveShiftItem2 = { ...findItem(state, overId) };
            const moveShiftAtrr = { ...findItem(state, dragParentId) }.childrens;
            const moveShiftItem1Index = moveShiftAtrr.findIndex(v => v.id === moveShiftItem1.id);
            const moveShiftItem2Index = moveShiftAtrr.findIndex(v => v.id === moveShiftItem2.id);
            console.log(moveShiftItem1Index, moveShiftItem2Index);
            const newM = moveShiftAtrr.splice(moveShiftItem1Index, 1)[0];
            // moveShiftAtrr[moveShiftItem2Index] = moveShiftAtrr.splice(moveShiftItem1Index, 1, moveShiftAtrr[moveShiftItem2Index])[0];
            moveShiftAtrr.splice(moveShiftItem2Index, 0, newM);

            return JSON.parse(JSON.stringify(state))
        case 'remove':
            return {
                ...state,
            }
        default:
            return state;
    }
}

export const Context = createContext({});

export const ReducerContext = (props) => {
    //利用useReducer,将当前reducer中需要处理的方法进行导出，useReducer的第一个参数表示要处理的相关逻辑，第二个参数表示初始值
    const [state, dispatch] = useReducer(reducer, initState)
    return (
        //在这里我们使用了useContext进行了状态的共享
        <Context.Provider value={{ state, dispatch }}>
            {props.children}
        </Context.Provider>
    )
}