import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class List extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className='list'>
                <h3>List</h3>
                <Link to='/'>to home</Link>
            </div>
        )
    }
}

export default List;