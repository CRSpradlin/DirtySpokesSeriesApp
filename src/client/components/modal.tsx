import React from "react";
import { Transition } from '@headlessui/react'

type ModalComponentType = {
    modalTitle: string,
    visability: boolean,
    setVisability: (newVis:boolean, runSubmit:boolean) => void
}

export default class Modal extends React.Component<ModalComponentType> {
	
	constructor(props) {
		super(props);
	};

	public render() {
		return (
            <>
                <Transition
                    show={this.props.visability}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="flex justify-center transition-all w-full h-full text-dirtyspokes-dark bg-gray-800 bg-opacity-50 items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex flex-col items-center justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                    <h3 className="text-2xl font=semibold">{this.props.modalTitle}</h3>
                                    <div className="flex flex-row">
                                        <button onClick={() => this.props.setVisability(false, true)} className={'w-[10rem] m-5 bg-dirtyspokes-light hover:bg-dirtyspokes-dark px-5 py-2 text-sm rounded-full font-semibold text-white'}>Yes</button>
                                        <button onClick={() => this.props.setVisability(false, false)} className={'w-[10rem] m-5 bg-dirtyspokes-light hover:bg-dirtyspokes-dark px-5 py-2 text-sm rounded-full font-semibold text-white'}>No</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </>
        )
	};
}