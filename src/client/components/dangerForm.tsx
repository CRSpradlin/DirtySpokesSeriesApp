import React from "react";

export default class DangerForm extends React.Component {

	state = {
		loading: false
	}
	
	constructor(props) {
		super(props);
	};

	public handleSuccess = () => {
		this.setState({
			loading: false
		});

		alert('Successfully Cleared Reports');
	};

	public handleFailure = (error: Error) => {
		this.setState({ 
			loading: false
		});

		alert('Error Occured: ' + error.message);
	}

	public handleSubmit = (e) => {
		e.preventDefault();
		this.setState({
			loading: true
		});

		// @ts-ignore
		google.script.run
		 	.withSuccessHandler(this.handleSuccess)
			.withFailureHandler(this.handleFailure)
			.clearReports();
	}

	public render() {
		return (
			<div className="content-center">
				<span className="text-red-700 text-lg p-6">Clear All Results and Data</span>
				<form id="deleteForm" onSubmit={this.handleSubmit}>
					<div className="m-3">
						<input type="submit" value={this.state.loading?"Deleting...":"Delete"} disabled={this.state.loading} className={`w-[10rem] ${this.state.loading ? 'bg-red-700' : ' bg-red-500 hover:bg-red-700'} px-5 py-2 text-sm rounded-full font-semibold text-white`}/>
					</div>
				</form>
			</div>
		);
	};
}