import React,{Component} from 'react'
import {Carousel} from 'antd-mobile';

class Banners extends Component {
    render(){
        return (
            <Carousel
                autoplay
                infinite
            >
                {
                    this.props.banners.map((item,i)=>{
                        return (
                            <img className="app-banner"  src={item.pic} key={`b${i}`}
                            onLoad={() => {
                                // fire window resize event to change height
                                window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                                }}
                            />
                        )
                    })
                }
            </Carousel>
        )
    }
}

export default Banners;