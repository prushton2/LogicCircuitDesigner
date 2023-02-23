import { useEffect, useState } from "react";
import { WireContext, WireContent } from "./WireContext";

import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

import { AND, OR, XOR } from "./Gate"
import Wire from "./Wire"
import { Switch, LED } from "./IO";

import { component, input } from "../models/component";

function Workspace() {

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	const [wires, setWires] = useState<boolean[]>([]);
	const [components, setComponents] = useState<component[]>([]);

	const [componentHTML, setComponentHTML] = useState<JSX.Element[]>([]);
	const [wireHTML, setWireHTML] = useState<JSX.Element[]>([]);

	const [connectIn, setConnectIn] = useState("");
	const [connectOut, setConnectOut] = useState("");

	function create(type: string) {
		let inputs: input[] = []
		switch(type) {
			case "SW":
				break;
			case "LED":
				inputs = [{id: -1} as input];
				break;
			case "AND":
			case  "OR":
			case "XOR":
				inputs = [{id: -1} as input, {id: -1} as input];
				break;
		}

		let newcomps = structuredClone(components);
		newcomps.push({
			type: type,
			inputs: inputs
		} as component)
		setComponents(newcomps);
	}

	function connect(side: string, id: string) {
		switch(side) {
			case "in": 
				setConnectIn(id);
				break;
			case "out": 
				setConnectOut(id);
				break;
		}
	}

	useEffect(() => {
		if(connectIn !== "" && connectOut != "") {
			let input = parseInt(connectIn.split(".")[0])
			let outputid = parseInt(connectOut.split(".")[0])
			let outputPort = alphabet.indexOf(connectOut.split(".")[1]);

			let newComponents = structuredClone(components);
			newComponents[outputid].inputs[outputPort].id = input;
			setComponents(newComponents);
			
			setConnectIn("");
			setConnectOut("");
		}
	}, [connectIn, connectOut])

	useEffect(() => {
		let newhtml: JSX.Element[] = [];

		for(let i in components) {
			let c = components[i];
			switch(c.type) {
				case "SW":
					newhtml[i] = <Switch key={i} id={i} onClick={(id) => {connect("in", id)}}/>
					break;
				
				case "LED":
					newhtml[i] = <LED key={i} id={i} A={0} onClick={(id) => {connect("out", id)}}/>
					break;
				
				case "AND":
					newhtml[i] = <AND key={i} id={i.toString()} A={0} B={0} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;
				
				case "OR":
					newhtml[i] = <OR  key={i} id={i.toString()} A={0} B={0} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;

				case "XOR":
					newhtml[i] = <XOR key={i} id={i.toString()} A={0} B={0} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;
			}
		}
		setComponentHTML(newhtml)
	}, [components])

	useEffect(() => {
		let newhtml: JSX.Element[] = []
		for(let i in components) {
			let c = components[i];
			for(let j in c.inputs) {
				if(c.inputs[j].id === -1) {
					continue;
				}
				newhtml.push(<Wire key={`${i}_${j}`} start={`${c.inputs[j].id}.Y`} end={`${i}.${alphabet[j]}`}/>)
			}
		}
		setWireHTML(newhtml);
	}, [components])

	return (
	<div>
		<button onClick={(e) => {create("SW")}}>SW</button>
		<button onClick={(e) => {create("LED")}}>LED</button>
		<button onClick={(e) => {create("AND")}}>AND</button>
		<button onClick={(e) => {create("OR")}}>OR</button>
		<button onClick={(e) => {create("XOR")}}>XOR</button>
		<Xwrapper>
			<WireContext.Provider value={{wires, setWires} as WireContent}>
				{componentHTML}
				{wireHTML}
			</WireContext.Provider>
		</Xwrapper>
	</div> )
}


export default Workspace;

