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
				<span className="text-sky-700 text-lg p-6">Upload New Series Excel Report</span>
				<form id="uploadForm" onSubmit={this.handleSubmit}>
					<div className="m-3">
						<input name="excelFile" type="file" className="text-gray-500 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-500 file:text-white hover:file:bg-sky-700"/>
					</div>
					<div className="m-3">
						<input type="submit" value={this.state.loading?"Uploading...":"Submit"} disabled={this.state.loading} className={`w-[10rem] ${this.state.loading? 'bg-sky-700' : ' bg-sky-500 hover:bg-sky-700'} px-5 py-2 text-sm rounded-full font-semibold text-white`}/>
					</div>
				</form>
			</div>
		);
	};
}