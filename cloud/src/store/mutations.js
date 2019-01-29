export const setTabbarState = function(state,obj){
    state.tabbarState = obj.num;
}

export const setColor = function(state,obj){
    state.color = obj.num;
}

export const setOn = function(state,obj){
    state.active = obj.num;
}

export const setPlay = function(state,obj){
    state.play = obj.play;
}

export const setMp3 = function(state,obj){
    state.mp3 = obj.mp3;
}

export const setCover = function(state,obj){
    state.cover = obj.cover;
}

export const setInfo = function(state,obj){
    state.name = obj.name;
    state.singer = obj.singer;
}

export const setDuration = function(state,obj){
    state.duration = obj.num;
}

export const setKey = function(state,obj){
    state.widthkey = obj.num;
}

export const setShowPlay = function(state,obj){
    state.showPlay = obj.num;
}

export const setPc = function(state,obj){
    state.pc = obj.num;
}

export const setIndex = function(state,obj){
    state.index = obj.num;
}