import { stat } from "fs";

export const getTabbarState = (state)=>{
    return state.tabbarState;
}
export const getMyApi = (state) => {
    return state.myApi;
}
export const getColor = (state)=>{
    return state.color;
}

export const getColorObj = (state)=>{
    return state.colors;
}

export const getOn = (state) => {
    return state.active;
}

export const getPlay = (state)=>{
    return state.play;
}

export const getMp3 = (state)=>{
    return state.mp3;
}

export const getCover = (state)=>{
    return state.cover;
}

export const getInfo = (state)=>{
    return {name:state.name,singer:state.singer}
}

export const getDuration = (state)=>{
    return state.duration;
}
export const getKey = (state)=>{
    return state.widthkey;
}

export const getShowPlay = (state)=>{
    return state.showPlay;
}
export const getPC = (state)=>{
    return state.pc;
}

export const getIndex = (state)=>{
    return state.index;
}

export const getCmt = (state)=>{
    return state.cmt;
}

export const getSid = (state)=>{
    return state.sid;
}
export const getSwitched = (state)=>{
    return state.switched;
}

export const getFirst = (state)=>{
    return state.first;
}

export const getKw = (state)=>{
    return state.kw;
}