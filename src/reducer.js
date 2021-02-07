
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
            const { targetId, type } = action.payload;
            // console.log(targetId, type);
            const item = findItem(state, targetId);
            if (item.type == type) { //嵌套View组件
                return state
            }
            const obj = {
                id: Math.ceil(Math.random() * 10000),
                type
            };
            if (type == "View") {
                obj.childrens = []
            }
            console.log(item);
            console.log(obj);
            item.childrens.push(obj)
            console.log(state);
            // 进行深拷贝 分配新数组
            const a = JSON.parse(JSON.stringify(state))
            return a
        case 'moveItem':
            const { dragItem, overItem } = action.payload;
            const { draggedId, dragParentId } = dragItem;
            const { overId, overParentId } = overItem;

            const Item = { ...findItem(state, draggedId) };
            const target = findItem(state, overId);

            console.log(JSON.stringify(Item));
            console.log(JSON.stringify(target));
            // console.log(JSON.stringify(targetParent));

            if (target.type == "View" && Item.type == "View") {
                return state
            }
            // const index = targetParent.childrens.findIndex(v => v.id === overId);
            removeNode(state, draggedId, dragParentId);
            // targetParent.childrens.splice(index, 0, item);
            // targetParent.childrens[index].childrens.push(item)
            target.childrens.push(Item)
            console.log(state);
            const b = JSON.parse(JSON.stringify(state))
            return b
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