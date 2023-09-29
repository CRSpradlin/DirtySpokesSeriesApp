import React from "react";
import FileUploadForm from "./fileUploadForm";
import RemoveUploadForm from "./removeUploadForm";
import GenerateForm from "./generateForm";
import DangerForm from "./dangerForm";

export default class Root extends React.Component {

	state = {
		activeTabName: 'fileUploadForm',
		activeTabComponent: <FileUploadForm /> 
	}

	constructor(props) {
		super(props);
	}

	setActiveTab(tabName) {
		switch (tabName) {
			case 'fileUploadForm':
				this.setState({
					activeTabName: tabName,
					activeTabComponent: <FileUploadForm />
				});
				break;
			case 'removeUploadForm':
				this.setState({
					activeTabName: tabName,
					activeTabComponent: <RemoveUploadForm />
				});
				break;
			case 'generateForm':
				this.setState({
					activeTabName: tabName,
					activeTabComponent: <GenerateForm />
				});
				break;
			case 'dangerForm':
				this.setState({
					activeTabName: tabName,
					activeTabComponent: <DangerForm />
				});
				break;
			default:
				alert('Tab not found, please try again later');
		}
	}

	public render() {
		return (
			<div className="h-full">
				<div className="h-20 flex flex-row text-center justify-center">
					<ul className="flex border-b">
						<li className="-mb-px mr-1">
							<a className={`bg-white inline-block py-2 px-4 font-semibold ${this.state.activeTabName === 'fileUploadForm'?'border-l border-t border-r rounded-t text-blue-700':'text-gray-400 hover:text-blue-300'}`} href="#" onClick={() => this.setActiveTab('fileUploadForm')}>Upload</a>
						</li>
						<li className="mr-1">
							<a className={`bg-white inline-block py-2 px-4 font-semibold ${this.state.activeTabName === 'removeUploadForm'?'border-l border-t border-r rounded-t text-blue-700':'text-gray-400 hover:text-blue-300'}`} href="#" onClick={() => this.setActiveTab('removeUploadForm')}>Remove</a>
						</li>
						<li className="mr-1">
							<a className={`bg-white inline-block py-2 px-4 font-semibold ${this.state.activeTabName === 'generateForm'?'border-l border-t border-r rounded-t text-blue-700':'text-gray-400 hover:text-blue-300'}`} href="#" onClick={() => this.setActiveTab('generateForm')}>Generate</a>
						</li>
						<li className="mr-1">
							<a className={`bg-white inline-block py-2 px-4 font-semibold ${this.state.activeTabName === 'dangerForm'?'border-l border-t border-r rounded-t text-red-700':'text-gray-400 hover:text-red-300'}`} href="#" onClick={() => this.setActiveTab('dangerForm')}>Danger</a>
						</li>
					</ul>
				</div>
				<div className="h-full mt-10 flex flex-col text-center">
					{this.state.activeTabComponent}
				</div>
			</div>
		);
	}
}