import React, {Component} from 'react'
import {connect} from 'react-redux'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {withRouter} from 'react-router-dom'
import Tabbar from '../components/tabbar'
import Head from '../components/head'
import Banner from '../components/banner'
import Pubmd from '../components/pubmd'
import Publist from '../components/publist'
import Foot from '../components/foot'
import $ from 'jquery'
import {SearchBar} from 'react-weui'
import {MediaBox,MediaBoxHeader,MediaBoxBody,MediaBoxTitle,MediaBoxDescription,InfiniteLoader} from 'react-weui'
import {Icon} from 'antd'
import Imask from '../components/mask'

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            homeBlock: 0,
            highArr: [],
            topArr: [],
            topList: [],
            input: '',
            result: [],
            total: null,
            page: 0,
            subTxt: '',
            showHot: true,
            hotArr: [],
            defaultV: '',
            showMask: true
        }
    }

    componentDidMount(){
        this.setState({
            showHot: true,
            homeBlock: this.props.homeflag
        })
        let {setTabbarState} = this.props;
        setTabbarState('0');
    }

    changeBlock = (num)=>{
        this.setState({
            homeBlock: num
        })
        this.props.setFlag(num);
    }

    componentWillMount(){
        let {myApi} = this.props;
        this.highquality(myApi);
        this.topAlbum(myApi);
        this.topList(myApi);
        this.hotSearch(myApi);
    }

    highquality = (myApi)=>{
      $.get(`${myApi}/top/playlist/highquality`).then(dt=>{
            if(dt.code!=200)return;
          this.setState({
              highArr: dt.playlists.slice(0,4)
          },()=>{
              setTimeout(()=>{
                this.setState({
                    showMask: false
                })
              },500)
          })
      })
    }

    topAlbum = (myApi)=>{
      $.get(`${myApi}/top/album`).then(dt=>{
        if(dt.code!=200)return;
          this.setState({
              topArr: dt.albums.slice(0,4)
          },()=>{
            setTimeout(()=>{
                this.setState({
                    showMask: false
                })
            },500)
        })
      })
    }

    topList = (myApi)=>{
      let topList = [];
      for(let i = 0; i < 10; i ++){
        $.get(`${myApi}/top/list?idx=${i}`).then(dt=>{
            if(dt.code!=200)return;
            topList[i] = dt.playlist;
            topList[i].tracks = dt.playlist.tracks.slice(0,3);
            this.setState({
                topList: topList
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        showMask: false
                    })
                },500)
            })
        })
      }
    }

    hotSearch = (myApi)=>{
        $.get(`${myApi}/search/hot`).then(dt=>{
            if(dt.code!=200)return;
            this.setState({
                hotArr: dt.result.hots
            })
        })
    }

    handleChange(text, e){
        if(text==''){
            this.setState({
                input: text,
                page: 0,
                result: [],
                showHot: true
            })
        }else{
            this.setState({
                input: text,
                page: 0,
                result: [],
                showHot: false
             })
        }
       
    }


    submit(){
        if(this.state.input!=''&&this.state.subTxt!==this.state.input){
            this.setState({
                subTxt: this.state.input,
                page: 0,
                result: []
            },()=>this.searAjax())
        }
    }

    loadMore = (resolve)=>{
        this.searAjax(resolve);
    }

    searAjax = (resolve)=>{
        $.get(`${this.props.myApi}/search?keywords=${this.state.input}&offset=${30*this.state.page}`).then(dt=>{
            if(dt.code!=200)return;
            this.setState(prev=>({
                result: prev.result.concat(dt.result.songs),
                total: dt.result.songCount,
                page: prev.page + 1
            }),()=>{if(resolve){resolve()}})
        })
    }

    setInput = (input)=>{
        this.setState({
            input: input,
            subTxt: input,
            defaultV: input,
            page: 0,
            result: [],
            showHot: false
        },()=>this.searAjax())
    }

    goPlay = (item)=>{
        localStorage.setItem('sid',item.id);
        this.props.history.replace('/play');
        let historySongs = localStorage.getItem('historySongs');
        if(historySongs != null){
            historySongs = JSON.parse(historySongs);
            var key = false;
            for(let obj of historySongs){
                if(obj.sid === item.id){
                    key = true;
                    break;
                }
            }
            if(!key){
                historySongs.push({sid:item.id,name:item.name,singer:item.artists[0].name});
                localStorage.setItem('historySongs',JSON.stringify(historySongs))
            }
        }else{
            localStorage.setItem('historySongs',JSON.stringify([{sid:item.id,name:item.name,singer:item.artists[0].name}]))
        }
    }

    render(){
        let {tabbar,myApi} = this.props;

        return (
            <div>
                <Head />
                <div className='main'>
                    <div className='tabcard flex'>
                        <span className={this.state.homeBlock==0?'on':''} onClick={this.changeBlock.bind(this,0)}>推荐</span>
                        <span className={this.state.homeBlock==1?'on':''} onClick={this.changeBlock.bind(this,1)}>排行榜</span>
                        <span className={this.state.homeBlock==2?'on':''} onClick={this.changeBlock.bind(this,2)}>搜索</span>
                    </div>
                    <div className={this.state.homeBlock==0?'block':'hide'}>
                        <Banner />
                        <Pubmd title='精品歌单' data={this.state.highArr} />
                        <Pubmd title='新碟上架' data={this.state.topArr} />
                        <Foot></Foot>
                    </div>
                    <div className={this.state.homeBlock==1?'block':'hide'}>
                        <div className='top'>
                            {
                              this.state.topList.map((obj,i)=>{
                                  return (
                                      <Publist data={obj} idx={i} key={i} />
                                  )
                              })
                            }
                        </div>
                    </div>
                    <div className={this.state.homeBlock==2?'block':'hide'}>
                      <div className='searchbar'>
                        <SearchBar
                          placeholder="Music Name Search"
                          lang={{
                              cancel: 'Cancel'
                          }}
                          defaultValue = {this.state.defaultV}
                          onChange={this.handleChange.bind(this)}
                          onSubmit={this.submit.bind(this)}
                        />
                      </div>
                      <div className={this.state.showHot?'show':'hide'}>
                          <h3 className='hot_st'>hot search</h3>
                          <div className='hot_sc'>
                              {
                                  this.state.hotArr.map((item,i)=>{
                                      return (
                                        <a href='javascript:;' onClick={this.setInput.bind(this,item.first)} className={i==0?'hot_tag sear_first':'hot_tag'} key={i}>{item.first}</a>
                                      )
                                  })
                              }
                          </div>
                      </div>
                      <InfiniteLoader
                        onLoadMore={ (resolve, finish) => {
                            if(this.state.total/30>this.state.page){
                                this.loadMore(resolve);
                            }else{
                                finish()
                            }
                        }}
                      >
                            {
                                this.state.result.map((item,i)=>{
                                    return (
                                        <MediaBox key={i} type="appmsg" href="javascript:void(0);" style={{fontSize:14}} onClick={this.goPlay.bind(this,item)}>
                                            <MediaBoxHeader><Icon type="customer-service" theme="filled" style={{fontSize:40,verticalAlign:'middle'}} /></MediaBoxHeader>
                                            <MediaBoxBody>
                                                <MediaBoxTitle className='elp'>{item.name}</MediaBoxTitle>
                                                <MediaBoxDescription className='elp'>
                                                    {item.artists[0].name}
                                                </MediaBoxDescription>
                                            </MediaBoxBody>
                                        </MediaBox>
                                    )
                                })
                            }
                    </InfiniteLoader>
                    </div>
                
                </div>
                <Tabbar />
                <Imask showMask={this.state.showMask} />
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Home));