import React ,{ Component } from 'react';
import {Link} from 'react-router-dom';
import { Row, Col } from 'antd';
import '../assets/index.css';
class Home extends Component {
    constructor(props){
        super(props);
    }
    render(){
        const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>
        return(
            <div>
                Home
                <Link to='/book'>to book</Link>
                <div>
                    <Row>
                    <Col span={12}>col-12</Col>
                    <Col span={12}>col-12</Col>
                    </Row>
                    <Row>
                    <Col span={8}>col-8</Col>
                    <Col span={8}>col-8</Col>
                    <Col span={8}>col-8</Col>
                    </Row>
                    <Row>
                    <Col span={6}>col-6</Col>
                    <Col span={6}>col-6</Col>
                    <Col span={6}>col-6</Col>
                    <Col span={6}>col-6</Col>
                    </Row>
                    <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">col-6</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">col-6</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">col-6</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">col-6</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>col-8</Col>
                        <Col span={8} offset={8}>col-8</Col>
                    </Row>
                    <Row>
                        <Col span={6} offset={6}>col-6 col-offset-6</Col>
                        <Col span={6} offset={6}>col-6 col-offset-6</Col>
                    </Row>
                        <Row>
                        <Col span={12} offset={6}>col-12 col-offset-6</Col>
                    </Row>
                    <Row>
                        <Col span={18} push={6}>col-18 col-push-6</Col>
                        <Col span={6} pull={18}>col-6 col-pull-18</Col>
                    </Row>
                    <Row type='flex' justify='start'>
                        <Col span={6}>col-6</Col>
                        <Col span={6}>col-6</Col>
                        <Col span={6}>col-6</Col>
                    </Row>
                    <Row type='flex' justify='center'>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                    </Row>
                    <Row type='flex' justify='end'>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                    </Row>
                    <Row type='flex' justify='space-between'>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                    </Row>
                    <Row type='flex' justify='space-around'>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                        <Col span={4}>col-4</Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle">
                        <Col span={4} xs={{color:'#000'}}><DemoBox value={200}>col-1</DemoBox></Col>
                        <Col span={4}><DemoBox value={50}>col-4</DemoBox></Col>
                        <Col span={4}><DemoBox value={120}>col-4</DemoBox></Col>
                        <Col span={4}><DemoBox value={80}>col-4</DemoBox></Col>
                    </Row>
                    <Row>
                        <Col sm={8} xs={12}>123</Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Home;