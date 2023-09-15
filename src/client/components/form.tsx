import React from "react";


interface IFormInputProps {
	handleSubmit: any
}


export default class FormInput extends React.Component {
	public state: { text: string };

	constructor(props) {
		super(props);
		this.state = { text: "" };
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	public handleSubmit = (e) => {
		e.preventDefault();
		console.log('submitted')
	};

	public render() {
		return (
			<div className="formBlock">
				<span>Add a sheet: </span>
				<form onSubmit={this.handleSubmit}>
					<input />
				</form>
			</div>
		);
	}
}