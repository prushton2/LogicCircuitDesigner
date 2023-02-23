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
		setDisplay(config["displayMode" as keyof object] === "full" ? "inline": "none");
	}, [config])

	return (

		<Draggable grid={[5, 5]} onDrag={updateXarrow} onStop={updateXarrow}>
			<div id={`${id}.Y`} style={{position: "absolute", width: "100px", height: "100px", border: "0px solid red"}}>
				
				<input style={{ height: "20px", width: "30px", display: display}} onChange={(e) => {setName(e.target.value)}}></input><br />
				
				<button className="invisButton" style={{width: "50px", height: "50px", position: 'absolute', top: "25px", left: "25px"}} onClick={() => {setValue(!value)}}>{name}</button> <br />

				<div id={`${id}.A`} style={{right: "0px", top: "50%", position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: "1.3em", display: display}}>Y</button> <br /> 
				</div>
			</div>
		</Draggable>

	)
}

export const LED = ({A, id, onClick}: {A: number, id: string, onClick: (id: string) => void}) => {
    
	const {wires, setWires} = useContext(WireContext);
	
	const updateXarrow = useXarrow();
	
	return (
		<Draggable grid={[5, 5]} onDrag={updateXarrow} onStop={updateXarrow}>
			<div style={{width: "90px", height: "90px"}}>
				LED ({id})
				<div id={`${id}.A`} style={{left: "0%", top: "50%", position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.A`)} style={{marginLeft: "1.3em"}}>A</button> {wires[A]?1:0} <br /> 
				</div>
			</div>
		</Draggable>
	)
}