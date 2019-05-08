import React, {Component} from 'react'
import {Footer,FooterLinks,FooterLink,FooterText} from 'react-weui'
class Foot extends Component {
    render(){
        return (
            <div className='foot'>
                <Footer>
                    <FooterLinks>
                        <FooterLink href="javascript:void(0);">Link</FooterLink>
                        <FooterLink href="javascript:void(0);">Link</FooterLink>
                    </FooterLinks>
                    <FooterText>Copyright © 1998 - 2019 Tencent. All Rights Reserved. 联系电话：0755-86013388 QQ群：55209235</FooterText>
                </Footer>
            </div>
        )
    }
}

export default Foot;