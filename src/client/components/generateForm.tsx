import React from "react";
import { ChildComponentType } from "./root";

export default class GenerateForm extends React.Component<ChildComponentType> {

	state = {
        selectedRaceType: 'long',
		minReqRaces: 5,
		numberPerSeries: 50
	};
	
	constructor(props) {
		super(props);
	};

	public handleFailure = (error) => {
		alert('Error Occured: ' + error.message);
		this.props.setLoading(false);
	}

	public successfullyGeneratedReport = (data) => {

		// Create a link element
		const link = document.createElement("a");

		//const blob = new Blob(bytes, {type: "application/msexcel"});
    	//const url = window.URL.createObjectURL(blob);
	  
		// Set link's href to point to the Blob URL
		link.href = data;
		link.download = 'GeneratedReport.xlsx'
	  
		// Append link to the body
		document.getElementById('generateForm')?.appendChild(link);
	  
		// Dispatch click event on the link
		// This is necessary as link.click() does not work on the latest firefox
		link.dispatchEvent(
		  new MouseEvent('click', { 
			bubbles: true, 
			cancelable: true, 
			view: window 
		  })
		);
	  
		// Remove link from body
		document.getElementById('generateForm')?.removeChild(link);

		this.props.setLoading(false);
	}

	public handleSubmit = (e) => {
		e.preventDefault();
		this.props.setLoading(true);

		 // @ts-ignore
		 google.script.run
		 	.withSuccessHandler(this.successfullyGeneratedReport)
			.withFailureHandler(this.handleFailure)
			.generateReport(document.getElementById('generateForm'));
	};

	public render() {
		return (
			<div className="content-center">
				<h1 className="text-dirtyspokes-dark text-2xl p-6">Generate Series Report</h1>
				<form id="generateForm" onSubmit={this.handleSubmit}>
					<div className="m-3">
						<span className="text-dirtyspokes-dark">Race Type: </span>
						<select name="raceType" value={this.state.selectedRaceType} id="raceType" onChange={e => this.setState({ selectedRaceType: e.target.value })}>
							<option key="0" value="long">Long Course</option>
							<option key="1" value="short">Short Course</option>
						</select>
					</div>
                    <div className="m-3">
						<span className="text-dirtyspokes-dark">Minimum Number of Race Entries Required: </span>
						<input name="minReqRaces" type="number" min="0" max="10" value={this.state.minReqRaces} onChange={e => this.setState({ minReqRaces: e.target.value })} />
					</div>
                    <div className="m-3">
						<span className="text-dirtyspokes-dark">Number of Racers per Series Age Group: </span>
						<input name="numberPerSeries" type="number" min="1" max="50" value={this.state.numberPerSeries} onChange={e => this.setState({ numberPerSeries: e.target.value })} />
					</div>
					<div className="m-10">
						<input type="submit" value={this.props.loading?"Generating...":"Submit"} disabled={this.props.loading} className={`w-[10rem] ${this.props.loading ? 'bg-dirtyspokes-dark' : ' bg-dirtyspokes-light hover:bg-dirtyspokes-dark'} px-5 py-2 text-sm rounded-full font-semibold text-white`}/>
					</div>
				</form>
			</div>
		);
	};
}