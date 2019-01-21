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
