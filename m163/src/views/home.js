import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Topbar from '../components/topbar';
import Subnav from '../components/subnav';
import Slider from '../components/slider';
import Footer from '../components/footer';
import Main from '../components/main';
import TopBtn from '../components/top';
import $ from 'jquery';


class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false
        }
        this.scrollHandler = this.scrollHandler.bind(this);
    }
    componentDidMount(){
        var self = this;
        window.addEventListener('scroll', this.scrollHandler);
    }
    scrollHandler(e){
        if($('html').scrollTop() > 0){
            this.setState({
                show: true
            })
        }else{
            this.setState({
                show: false
            })
        }
    }
    scroll(){
        this.setState(prevState => ({
            show: !prevState.show
        }))
    }
    render(){
        return (
            <div className='home'>
                <Topbar />
                <Subnav />
                <Slider />
                <Main />
                <Footer />
                <TopBtn show={this.state.show} />
            </div>
        )
    }
}

export default Home;