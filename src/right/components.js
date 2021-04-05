import React, { Component } from 'react';
import { Button, Icon } from 'cloud-react';

const divStyle = {
	border: '1px solid red',
	width: '100%',
	padding: '10px',
	color: '#666',
	height: '600px'
};
const ViewStyle = {
	border: '1px solid blue',
	width: '50%',
	height: "150px",
	padding: '10px',
	color: '#666',
	margin: "10px 0"
};
class Box extends Component {

	render() {
		return <div style={divStyle} className={this.props.className}>{this.props.children}</div>;
	}
};

class View extends Component {

	render() {
		return <div style={ViewStyle} className={this.props.className}>这是一个明细组件{this.props.children}</div>;
	}
};

class Text extends Component {
	render() {
		return <Button type="danger" className={this.props.className}>组件一</Button>;
	}
}

class Button1 extends Component {
	render() {
		return <Button style={{ "display": "block", 'margin': '3px 0' }} type="primary" className={this.props.className}>组件二</Button>
	}
}

class Button3 extends Component {
	render() {
		return <Button type="danger" style={{ 'background': 'orange' }} >组件三</Button>;
	}
}

export default { View, Text, Button: Button1, Button3: Button3, Box }