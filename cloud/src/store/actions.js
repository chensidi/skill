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