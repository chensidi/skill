export const mapStateToProps = (state) => {
    return {
        tabbar: state.tabbar,
        myApi: state.myApi,
        homeflag: state.homeflag
    }
}

export const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        setTabbarState(data){
            dispatch({type:'setTabbatState',data:data});
        },
        setMyApi(data){
            dispatch({type:'setMyApi',data:data})
        },
        setFlag(data){
            dispatch({type:'setFlag',data:data})
        }
    }
}