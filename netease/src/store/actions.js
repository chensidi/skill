export const setState = function({commit,state},n){
	commit({
		type:"setTabbarState",
		num:n,
		msg:666
	})
}
export const setColor = function({commit,state},n){
	commit({
		type:"setColor",
		num:n
	})
}
export const setOn = function({commit,state},n){
	commit({
		type:"setOn",
		num:n
	})
}

export const setPlay = function({commit,state},n){
	commit({
		type:"setPlay",
		play:n
	})
}

export const setMp3 = function({commit,state},n){
	commit({
		type:"setMp3",
		mp3:n
	})
}

export const setCover = function({commit,state},n){
	commit({
		type:"setCover",
		cover:n
	})
}

export const setInfo = function({commit,state},{m,n}){
	commit({
		type:"setInfo",
		name:m,
		singer:n
	})
}

export const setDuration = function({commit,state},n){
	commit({
		type:"setDuration",
		num:n
	})
}

export const setKey = function({commit,state},n){
	commit({
		type:"setKey",
		num:n
	})
}

export const setShowPlay = function({commit,state},n){
	commit({
		type:"setShowPlay",
		num:n
	})
}

export const setPc = function({commit,state},n){
	commit({
		type:"setPc",
		num:n
	})
}

export const setIndex = function({commit,state},n){
	commit({
		type:"setIndex",
		num:n
	})
}

export const setCmt = function({commit,state},n){
	commit({
		type:"setCmt",
		num:n
	})
}

export const setSid = function({commit,state},n){
	commit({
		type:"setSid",
		num:n
	})
}

export const setSwitched = function({commit,state},n){
	commit({
		type:"setSwitched",
		num:n
	})
}

export const setFirst = function({commit,state},n){
	commit({
		type:"setFirst",
		num:n
	})
}

export const setKw= function({commit,state},n){
	commit({
		type:"setKw",
		num:n
	})
}

export const setPy= function({commit,state},n){
	commit({
		type:"setPy",
		num:n
	})
}