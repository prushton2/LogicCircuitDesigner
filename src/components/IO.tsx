import "../App.css"

import { useState,useEffect, useContext } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { ConfigContext, WireContext } from "./Context";
import { input } from "../models/component";
import { pos } from "../models/pos";

export const SW = ({id, pos, onClick, setPos}: {id: any, pos: pos, onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) => {

	const [value, setValue] = useState(false);
	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);
	
	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration
	const [name, setName] = useState(id);

	const updateXarrow = useXarrow();

	const savePos = (e: any, element: any) => {
		setPos({x: element.x, y: element.y} as pos, id);
		updateXarrow();
	}

	useEffect(() => {
		let newWires = structuredClone(wires);
		newWires[id][0] = value;
		setWires(newWires);
	}, [value])

	useEffect(() => {
		setDisplay(!config["hideDetails" as keyof object] ? "inline": "none");
	}, [config])

	return (

		<Draggable grid={[5, 5]} defaultPosition={{x: pos.x, y: pos.y}} onDrag={savePos} onStop={savePos}>
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

export const LED = ({I, id, pos, onClick, setPos}: {I: input[], id: string, pos: pos ,onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) => {
    
	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);

	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration
	const [name, setName] = useState(id);
	const [value, setValue] = useState("0");

	const updateXarrow = useXarrow();
	
	const savePos = (e: any, element: any) => {
		setPos({x: element.x, y: element.y} as pos, id);
		updateXarrow();
	}

	useEffect(() => {
		setDisplay(!config["hideDetails" as keyof object] ? "inline": "none");
	}, [config])

	useEffect(() => {
		try {
			setValue(
				JSON.stringify(wires[I[0].id as keyof []])
				.replaceAll("[", "")
				.replaceAll("]", "")
				.replaceAll(",", "")
				.replaceAll("true", "1")
				.replaceAll("false", "0")
				.replaceAll("null", "")
			) 
		} catch {
			setValue("Z");
		}
	}, [wires])

	return (
		<Draggable grid={[5, 5]} defaultPosition={{x: pos.x, y: pos.y}} onDrag={savePos} onStop={savePos}>
			<div style={{position: "absolute", width: "50px", height: "70px", border: "0px solid red"}}>
				
				
				<input style={{ height: "20px", width: "20px", display: display}} onChange={(e) => {setName(e.target.value)}}></input>
				<label style={{display: display}}> ({id}) </label><br />
				
				<label className="invisButton" style={{width: "50px", height: "50px", position: 'absolute', top: "20px", left: "0px", border: "0px solid red"}}>{name}<br />{value}</label> <br />

				<div id={`${id}.A`} style={{left: "0px", top: "30px", width: "30%", height: "30%", position: 'absolute', transform: "translate(0%, -50%)", border: "0px solid red"}}>
					<button onClick={(e) => onClick(`${id}.A`)} style={{marginRight: "1.3em", display: display}}>A</button> <br /> 
				</div>
			</div>
		</Draggable>
	)
}