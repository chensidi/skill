import React,{Component} from 'react';
import { Modal, Button, WingBlank, WhiteSpace, Toast } from 'antd-mobile';
import {connect} from 'react-redux';
import {changeActive,changeMp3,changePic} from '../store/actions';

class Login extends Component {

    constructor(){
        super();
        this.state = {
            prompt: Modal.prompt
        }
    }
    
    componentWillMount(){
        this.state.prompt(
            'Login',
            'Please input login information',
            (login, password) => console.log(`login: ${login}, password: ${password}`),
            'login-password',
            null,
            ['Please input name', 'Please input password'],
          )
    }

    render(){
        return (
            <div>

            </div>
        )
    }
}

export default Login;