import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Topbar from '../components/topbar';
import Subnav from '../components/subnav';
import Slider from '../components/slider';
import Footer from '../components/footer'

class Home extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className='home'>
                <Topbar />
                <Subnav />
                <Slider />
                <Footer />
            </div>
        )
    }
}

export default Home;