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
