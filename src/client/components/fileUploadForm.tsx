import React from "react";
import { ChildComponentType } from "./root";

export default class FileUploadForm extends React.Component<ChildComponentType> {
	
	constructor(props) {
		super(props);
	};

	public handleSubmit = (e) => {
		e.preventDefault();
		this.props.setLoading(true);

		// @ts-ignore
		google.script.run.withSuccessHandler(this.onSuccessfulFileUpload)
		 .withFailureHandler(this.onFailedUpload)
		 .uploadHandler(document.getElementById("uploadForm"));
	};

	public onFailedUpload = (error: Error) => {
		this.props.setLoading(false);
		alert('Upload Failed: ' + error.message);
	};

	public onSuccessfulFileUpload = () => {
		this.props.setLoading(false);
		alert("Successfully Uploaded New Race");
	};

	public render() {
		return (
			<div className="content-center">
				<h1 className="text-dirtyspokes-dark text-2xl p-6">Upload New Series Excel Report</h1>
				<form id="uploadForm" onSubmit={this.handleSubmit}>
					<div className="m-3">
						<input name="excelFile" type="file" className="text-gray-500 border w-[35rem] border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-dirtyspokes-light file:text-white hover:file:bg-dirtyspokes-dark"/>
					</div>
					<div className="m-10">
						<input type="submit" value={this.props.loading?"Uploading...":"Submit"} disabled={this.props.loading} className={`w-[10rem] ${this.props.loading? 'bg-dirtyspokes-dark' : ' bg-dirtyspokes-light hover:bg-dirtyspokes-dark'} px-5 py-2 text-sm rounded-full font-semibold text-white`}/>
					</div>
				</form>
			</div>
		);
	};
}