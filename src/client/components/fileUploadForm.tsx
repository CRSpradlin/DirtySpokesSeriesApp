import React from "react";

export default class FileUploadForm extends React.Component {

	state = {
		loading: false
	}
	
	constructor(props) {
		super(props);
	};

	public handleSubmit = (e) => {
		e.preventDefault();
		this.setState({ loading: true });

		// @ts-ignore
		google.script.run.withSuccessHandler(this.onSuccessfulFileUpload)
		 .withFailureHandler(this.onFailedUpload)
		 .uploadHandler(document.getElementById("uploadForm"));
	};

	public handleFileChange = (e) => {
		console.log(e.target.files[0]);
		this.setState({excelFile: e.target.files[0]});
	}

	public onFailedUpload = (error: Error) => {
		alert('Upload Failed: ' + error.message);
		this.setState({ loading: false });
	};

	public onSuccessfulFileUpload = () => {
		this.setState({ loading: false });
	};

	public render() {
		return (
			<div className="content-center">
				<span className="text-sky-700">Add a sheet: </span>
				<form id="uploadForm" onSubmit={this.handleSubmit}>
					<div>
						<input name="excelFile" type="file" />
					</div>
					<div>
						<input type="submit" value={this.state.loading?"Uploading...":"Submit"} disabled={this.state.loading} className="w-[10rem] bg-sky-500 hover:bg-sky-700 px-5 py-2 text-sm rounded-full font-semibold text-white"/>
					</div>
				</form>
			</div>
		);
	};
}