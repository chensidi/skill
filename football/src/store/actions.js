export const setState = function({commit,state},n){
	commit({
		type:"setTabbarState",
		num:n,
		msg:666
	})
}
