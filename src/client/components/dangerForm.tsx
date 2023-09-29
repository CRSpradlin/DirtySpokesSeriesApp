import React from "react";

export default class DangerForm extends React.Component {

	state = {
		loading: false
	}
	
	constructor(props) {
		super(props);
	};

	public render() {
		return (
			<div className="content-center">
				<span className="text-red-700 text-lg p-6">Danger</span>
			</div>
		);
	};
}