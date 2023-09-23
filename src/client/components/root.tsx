import React from "react";
import FileUploadForm from "./fileUploadForm";

export default class Root extends React.Component {

	constructor(props) {
		super(props);
	}

	public render() {
		return (
			<div className="h-full flex flex-col justify-center text-center">
                <FileUploadForm />
			</div>
		);
	}
}