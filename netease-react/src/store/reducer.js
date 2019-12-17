import  img  from "../static/coffee.png";
import url from "../static/coffee.mp3";
const initState = {
    api: 'http://127.0.0.1:4000',
    active: 1,
    mp3: {
        url: url,
        name: '咖啡',
        art: '张学友',
        id: 188261
    },
    pic: img
}
function reducer(state=initState,action){
    switch(action.type){
        case 'changeActive':
            return {
                ...state,
                active: action.num
            };
        case 'changeMp3':
            return {
                ...state,
                mp3: action.mp3
            };
        case 'changePic':
            return {
                ...state,
                pic: action.pic
            };
        default: 
            return state;
    }
}

export default reducer;