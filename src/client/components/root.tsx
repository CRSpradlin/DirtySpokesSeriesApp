import React from "react";
import FileUploadForm from "./fileUploadForm";
import RemoveUploadForm from "./removeUploadForm";
import GenerateForm from "./generateForm";
import DangerForm from "./dangerForm";

export type ChildComponentType = {
	loading: boolean,
	setLoading: (value: boolean) => void
}

export class Root extends React.Component {

	state = {
		activeTabName: 'fileUploadForm',
		loading: false
	}

	constructor(props) {
		super(props);
	}

	componentDidMount = () => {
		this.setLoading = this.setLoading.bind(this);
	}

	setLoading = (value: boolean) => {
		this.setState({loading: value})
	} 

	setActiveTab(tabName) {
		this.setState({
			activeTabName: tabName
		});
	}

	public render() {
		return (
			<div className="h-full">
				<div className="h-20 flex flex-row text-center justify-center">
					<ul className="flex border-b">
						<li className="-mb-px mr-1">
							<button className={`bg-white inline-block py-2 px-4 font-semibold ${this.state.activeTabName === 'fileUploadForm'?'border-l border-t border-r rounded-t text-dirtyspokes-dark':'text-gray-400 hover:text-dirtyspokes-light'}`} disabled={this.state.loading} onClick={() => this.setActiveTab('fileUploadForm')}>Upload</button>
						</li>
						<li className="mr-1">
							<button className={`bg-white inline-block py-2 px-4 font-semibold ${this.state.activeTabName === 'removeUploadForm'?'border-l border-t border-r rounded-t text-dirtyspokes-dark':'text-gray-400 hover:text-dirtyspokes-light'}`} disabled={this.state.loading} onClick={() => this.setActiveTab('removeUploadForm')}>Remove</button>
						</li>
						<li className="mr-1">
							<button className={`bg-white inline-block py-2 px-4 font-semibold ${this.state.activeTabName === 'generateForm'?'border-l border-t border-r rounded-t text-dirtyspokes-dark':'text-gray-400 hover:text-dirtyspokes-light'}`} disabled={this.state.loading} onClick={() => this.setActiveTab('generateForm')}>Generate</button>
						</li>
						<li className="mr-1">
							<button className={`bg-white inline-block py-2 px-4 font-semibold ${this.state.activeTabName === 'dangerForm'?'border-l border-t border-r rounded-t text-red-700':'text-gray-400 hover:text-red-300'}`} disabled={this.state.loading} onClick={() => this.setActiveTab('dangerForm')}>Danger</button>
						</li>
					</ul>
				</div>
				<div className="h-full mt-10 flex flex-col text-center">
					{ this.state.activeTabName === 'fileUploadForm' ? <FileUploadForm loading={this.state.loading} setLoading={this.setLoading} /> : null }
					{ this.state.activeTabName === 'removeUploadForm' ? <RemoveUploadForm loading={this.state.loading} setLoading={this.setLoading} /> : null }
					{ this.state.activeTabName === 'generateForm' ? <GenerateForm loading={this.state.loading} setLoading={this.setLoading} /> : null }
					{ this.state.activeTabName === 'dangerForm' ? <DangerForm loading={this.state.loading} setLoading={this.setLoading} /> : null }
				</div>
			</div>
		);
	}
}