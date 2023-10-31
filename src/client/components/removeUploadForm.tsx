import React from "react";
import { ChildComponentType } from "./root";
import Modal from "./modal";

export default class RemoveUploadForm extends React.Component<ChildComponentType> {

	state = {
		modalVisability: false,
		racesLoading: true,
		raceNames: {},
		selectedRaceType: 'long',
		selectedRaceNames: ["Loading..."]
	};
	
	constructor(props) {
		super(props);
	};

	public setModalVis = (newVis: boolean, runSubmit: boolean) => {
		this.props.setLoading(true);
		this.setState({ 
			modalVisability: newVis,
			raceLoading: true
		 });
		if (runSubmit) {
			// @ts-ignore
			google.script.run
				.withSuccessHandler(this.successfullyRemovedRace)
				.withFailureHandler(this.handleFailure)
				.removeRaceHandler(document.getElementById("removeForm"));
		} else {
			this.props.setLoading(false);
			this.setState({
				raceLoading: false
			 });
		}
	}

	public handleFailure = (error) => {
		alert('Error Occured: ' + error.message);
		this.props.setLoading(false);
		this.setState({
			racesLoading: false
		});
	}

	public setRaceNames = (raceNames) => {
		this.props.setLoading(false);
		this.setState({
			raceNames,
			selectedRaceType: 'long',
			racesLoading: false
		});
		this.selectedRaceChanged({ target: { value: 'long' }});
	};

	public successfullyRemovedRace = (raceNames) => {
		this.setRaceNames(raceNames);
		alert("Successfully Removed Race");
	}

	public selectedRaceChanged = (event) => {
		this.setState({
			selectedRaceType: event.target.value,
			selectedRaceNames: this.state.raceNames[event.target.value]
		});
	};
	
	public componentDidMount = () => {
		// @ts-ignore
		google.script.run
			.withSuccessHandler(this.setRaceNames)
			.withFailureHandler(this.handleFailure)
			.getRaceNames();
	};

	public handleSubmit = (e) => {
		e.preventDefault();
		this.setModalVis(true, false);
	};

	public render() {
		return (
			<div className="content-center">
				<h1 className="text-dirtyspokes-dark text-2xl p-6">Select Race Type and Race Name to Remove</h1>
				<form id="removeForm" onSubmit={this.handleSubmit}>
					<div className="m-3">
						<span className="text-dirtyspokes-dark">Race Type: </span>
						<select name="raceType" value={this.state.selectedRaceType} id="raceType" onChange={this.selectedRaceChanged}>
							<option key="0" value="long">Long Course</option>
							<option key="1" value="short">Short Course</option>
						</select>
					</div>
					<div className="m-3">
						<span className="text-dirtyspokes-dark">Race Name: </span>
						<select name="raceName" disabled={this.state.racesLoading}>
							{this.state.selectedRaceNames.map((option, index) => (
								<option key={index} value={option}>{option}</option>
							))}
						</select>
					</div>
					<div className="m-10">
						<input type="submit" value={this.props.loading?"Removing...":"Submit"} disabled={this.props.loading} className={`w-[10rem] ${this.state.racesLoading || this.props.loading ? 'bg-dirtyspokes-dark' : ' bg-dirtyspokes-light hover:bg-dirtyspokes-dark'} px-5 py-2 text-sm rounded-full font-semibold text-white`}/>
					</div>
				</form>
				<Modal modalTitle={'Are you sure you want to remove the selected race?'} visability={ this.state.modalVisability } setVisability={ this.setModalVis } />
			</div>
		);
	};
}