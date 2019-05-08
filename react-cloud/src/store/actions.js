export function setTabbarState(data){
    return (dispatch,getState) => {
        dispatch({
            type: 'setTabbatState',
            data: data
        })
    }
}

export function setMyApi(data){
    return (dispatch,getState) => {
        dispatch({
            type: 'setMyApi',
            data: data
        })
    }
}

export function setFlag(data){
    return (dispatch,getState) => {
        dispatch({
            type: 'setFlag',
            data: data
        })
    }
}