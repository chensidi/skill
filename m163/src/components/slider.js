import React, { Component } from 'react';
import {Carousel} from 'element-react';
import '../css/topbar.css';

class Slider extends Component {
    constructor(props){
        super(props);
        this.state = {
            img: ['http://p1.music.126.net/DXMj3tHSqRcgmo25LZA7HA==/109951163751984031.jpg','http://p1.music.126.net/7NEbseZvR8pKigLVTBvMVw==/109951163751891952.jpg','http://p1.music.126.net/lCIdx8Spols2aIhbRdwsVQ==/109951163751908735.jpg','http://p1.music.126.net/6iR74oXosg9vPLPYOAlh6A==/109951163751925195.jpg',]
        }
    }
    render() {
        return (
        <div className='slider_bg'>
          <div className="demo-3 medium slider">
            <Carousel interval="4000" height="336px" arrow="always">
              {
                this.state.img.map((item, index) => {
                  return (
                    <Carousel.Item key={index}>
                      <img src={item} />
                    </Carousel.Item>
                  )
                })
              }
            </Carousel>
            <div className='download_card'>
                <button className='download_btn'></button>
                <p className='downinfo'>PC 安卓 iPhone WP iPad Mac 六大客户端</p>
            </div>
          </div>
        </div>
        )
    }
}

export default Slider