const initState = {
    api: 'http://127.0.0.1:3000',
    active: 1,
}
function reducer(state=initState,action){
    switch(action.type){
        case 'changeActive':
            return {
                ...state,
                active: action.num
            };
        default: 
            return state;
    }
}

export default reducer;