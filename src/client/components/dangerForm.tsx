import React from "react";
import { ChildComponentType } from "./root";
import Modal from "./modal";

export default class DangerForm extends React.Component<ChildComponentType> {
	
	constructor(props) {
		super(props);
	};

	state = {
		modalVisability: false
	}

	public setModalVis = (newVis: boolean, runSubmit: boolean) => {
		this.setState({ modalVisability: newVis });

		if (runSubmit) {
			this.props.setLoading(true);

			// @ts-ignore
			google.script.run
				.withSuccessHandler(this.handleSuccess)
				.withFailureHandler(this.handleFailure)
				.clearReports();
		}
	}

	public handleSuccess = () => {
		this.props.setLoading(false);

		alert('Successfully Cleared Reports');
	};

	public handleFailure = (error: Error) => {
		this.props.setLoading(false);

		alert('Error Occured: ' + error.message);
	}

	public handleSubmit = (e) => {
		e.preventDefault();
		this.setModalVis(true, false);
	}

	public render() {
		return (
			<div className="content-center">
				<h1 className="text-red-700 text-2xl p-6">Clear All Results and Data</h1>
				<form id="deleteForm" onSubmit={this.handleSubmit}>
					<div className="m-10">
						<input type="submit" value={this.props.loading?"Deleting...":"Delete"} disabled={this.props.loading} className={`w-[10rem] ${this.props.loading ? 'bg-red-700' : ' bg-red-500 hover:bg-red-700'} px-5 py-2 text-sm rounded-full font-semibold text-white`}/>
					</div>
				</form>
				<Modal modalTitle={'Are you sure you want to DELETE ALL RACES and start over?'} visability={ this.state.modalVisability } setVisability={ this.setModalVis } />
			</div>
		);
	};
}