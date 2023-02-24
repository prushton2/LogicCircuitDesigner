import "../App.css"

import { useState,useEffect, useContext } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { ConfigContext, WireContext } from "./Context";

export const Switch = ({id, onClick}: {id: any, onClick: (id: string) => void}) => {

	const [value, setValue] = useState(false);
	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);
	
	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration
	const [name, setName] = useState(id);

	const updateXarrow = useXarrow();

	useEffect(() => {
		let newWires = structuredClone(wires);
		newWires[id] = value;
		setWires(newWires);
	}, [value])

	useEffect(() => {
		setDisplay(!config["hideDetails" as keyof object] ? "inline": "none");
	}, [config])

	return (

		<Draggable grid={[5, 5]} onDrag={updateXarrow} onStop={updateXarrow}>
			<div style={{position: "absolute", width: "50px", height: "70px", border: "0px solid red"}}>
				
				
				<input style={{ height: "20px", width: "20px", display: display}} onChange={(e) => {setName(e.target.value)}}></input>
				<label style={{display: display}}> ({id}) </label><br />
				
				<button className="invisButton" style={{width: "50px", height: "50px", position: 'absolute', top: "20px", left: "0px", border: "0px solid red"}} onClick={() => {setValue(!value)}}>{name}</button> <br />

				<div id={`${id}.Y`} style={{right: "0px", top: "45px", width: "30%", height: "30%", position: 'absolute', transform: "translate(0%, -50%)", border: "0px solid red"}}>
					<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: "1.3em", display: display}}>Y</button> <br /> 
				</div>
			</div>
		</Draggable>

	)
}

export const LED = ({A, id, onClick}: {A: number, id: string, onClick: (id: string) => void}) => {
    
	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);

	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration
	const [name, setName] = useState(id);

	const updateXarrow = useXarrow();
	
	useEffect(() => {
		setDisplay(!config["hideDetails" as keyof object] ? "inline": "none");
	}, [config])
	return (
		<Draggable grid={[5, 5]} onDrag={updateXarrow} onStop={updateXarrow}>
			<div style={{position: "absolute", width: "50px", height: "70px", border: "0px solid red"}}>
				
				
				<input style={{ height: "20px", width: "20px", display: display}} onChange={(e) => {setName(e.target.value)}}></input>
				<label style={{display: display}}> ({id}) </label><br />
				
				<label className="invisButton" style={{width: "50px", height: "50px", position: 'absolute', top: "20px", left: "0px", border: "0px solid red"}}>{name}</label> <br />

				<div id={`${id}.A`} style={{left: "0px", top: "30px", width: "30%", height: "30%", position: 'absolute', transform: "translate(0%, -50%)", border: "0px solid red"}}>
					<button onClick={(e) => onClick(`${id}.A`)} style={{marginRight: "1.3em", display: display}}>A</button> <br /> 
				</div>
			</div>
		</Draggable>
	)
}