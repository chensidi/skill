import {TOCHINE,TOENGLISH} from './../actions';

let initState = "hello word";
export default function ch2en(state = initState,action) {
    switch (action.type){
        case TOCHINE:
            return "你好世界";
        case TOENGLISH:
            return "hello word";
        default:
            return state;
    }
}
