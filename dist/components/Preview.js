import React from 'react';
import reactCSS from 'reactcss';


export default class Preview extends React.Component {
    constructor(props) {
        super(props);
        // this
    }

    render() {return (
        <div>

        </div>
    )}

    style() {return reactCSS({
        default: {

        }
    }, this.props, this.state)}
}