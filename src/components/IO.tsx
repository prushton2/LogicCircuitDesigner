import { useState,useEffect, useContext } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { pos } from "../models/pos";
import { WireContext } from "./Context";

export const Switch = ({id, onClick}: {id: any, onClick: (id: string) => void}) => {

	const [value, setValue] = useState(false);
	const {wires, setWires} = useContext(WireContext);

	const updateXarrow = useXarrow();

	useEffect(() => {
		let newWires = structuredClone(wires);
		newWires[id] = value;
		setWires(newWires);
	}, [value])


	return (

		<Draggable grid={[5, 5]} onDrag={updateXarrow} onStop={updateXarrow}>
			<div id={`${id}.Y`} style={{position: "absolute", width: "100px", height: "100px", border: "0px solid red"}}>
				<button onClick={() => {setValue(!value)}}>SW ({id})</button> <br />{value ? "1":"0"}

				<div id={`${id}.A`} style={{right: "0%", top: "50%", position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: "1.3em"}}>Y</button> <br /> 
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