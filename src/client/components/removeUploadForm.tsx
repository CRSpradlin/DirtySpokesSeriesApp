import React from "react";

export default class RemoveUploadForm extends React.Component {

	constructor(props) {
		super(props);
	}

	public handleSubmit = (e) => {
		e.preventDefault();
	};

	public render() {
		return (
			<div className="">
				<span className="text-red-500">Add a sheet: </span>
				<form onSubmit={this.handleSubmit}>
					<input type="submit" />
				</form>
			</div>
		);
	}
}