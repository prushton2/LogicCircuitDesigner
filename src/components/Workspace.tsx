import "./Workspace.css"

import { useEffect, useState } from "react";
import { WireContext, WireContent, ConfigContext, ConfigContent } from "./Context";

import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

import MouseFollower from "./MouseFollower";
import WireRenderer from "./WireRenderer";
import { AND, OR, XOR, NOT, NAND, NOR, XNOR } from "./Gate";
import { Switch, LED } from "./IO";

import { component, input } from "../models/component";

function Workspace() {

	const [config, setConfig] = useState({"hideDetails": false, "hideWireStates": false});
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	
	const [wires, setWires] = useState<boolean[][]>([[]]);
	const [components, setComponents] = useState<component[]>([]);
	const [componentHTML, setComponentHTML] = useState<JSX.Element[]>([]);
	const [deleteHTML, setDeleteHTML] = useState<JSX.Element[]>([]);

	const [toRemove, setToRemove] = useState(-1);

	const [connectIn, setConnectIn] = useState("");
	const [connectOut, setConnectOut] = useState("");

	const updateXarrow = useXarrow();

	function create(type: string) {
		let newWires = structuredClone(wires);
		newWires.push([]);
		setWires(newWires);

		
		let inputs: input[] = []
		switch(type) {
			case "SW":
				break;
			case "BUS":
				inputs = [];
				break;
			case "LED":
			case "NOT":
				inputs = [{id: -1} as input];
				break;
			case "AND":
			case  "OR":
			case "XOR":
			case "NAND":
			case "NOR":
			case "XNOR":
				inputs = [{id: -1} as input, {id: -1} as input];
				break;
		}

		let newcomps = structuredClone(components);
		newcomps.push({
			type: type,
			inputs: inputs
		} as component)
		setComponents(newcomps);
		updateXarrow();
	}

	function remove(n: number) {
		console.log(n)
		let newComponents = structuredClone(components);

		newComponents[n].type = "deleted_gate";
		for(let i in newComponents[n].inputs) {
			newComponents[n].inputs[i].id = -1;
		}
		
		//remove references to deleted gates
		for(let i in newComponents) { //for each component
			let c = newComponents[i]; //cache component
			for(let j in c.inputs) { //for each input in component
				let input = c.inputs[j]; // cache input object

				if(input.id === -1) { continue; } //Skip if the reference is null

				if(newComponents[input.id].type === "deleted_gate") { //check if the gate that the input references is dead
					newComponents[i].inputs[j].id = -1; //if it is dead, then remove the reference to it
				}
			}
		}


		setComponents(newComponents);
		updateXarrow();
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
			if (newComponents[outputid].inputs[outputPort].id === input) {
				newComponents[outputid].inputs[outputPort].id = -1;
			} else {
				newComponents[outputid].inputs[outputPort].id = input;
			}
			setComponents(newComponents);
			
			setConnectIn("");
			setConnectOut("");
		}
	}, [connectIn, connectOut])

	useEffect(() => {
		let newhtml: JSX.Element[] = [];

		for(let i in components) {
			let c = components[i];
			if(c === null) { continue; }
			switch(c.type) {
				case "SW":
					newhtml[i] = <Switch key={i} id={i} onClick={(id) => {connect("in", id)}}/>
					break;
				
				case "LED":
					newhtml[i] = <LED key={i} id={i} A={structuredClone(c.inputs[0].id)} onClick={(id) => {connect("out", id)}}/>
					break;
				
				case "AND":
					newhtml[i] = <AND key={i} id={i.toString()} A={structuredClone(c.inputs[0].id)} B={structuredClone(c.inputs[1].id)} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;
				
				case "OR":
					newhtml[i] = <OR  key={i} id={i.toString()} A={structuredClone(c.inputs[0].id)} B={structuredClone(c.inputs[1].id)} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;

				case "XOR":
					newhtml[i] = <XOR key={i} id={i.toString()} A={structuredClone(c.inputs[0].id)} B={structuredClone(c.inputs[1].id)} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;

				case "NOT":
					newhtml[i] = <NOT key={i} id={i.toString()} A={structuredClone(c.inputs[0].id)} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;
				case "NAND":
					newhtml[i] = <NAND key={i} id={i.toString()} A={structuredClone(c.inputs[0].id)} B={structuredClone(c.inputs[1].id)} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;
				case "NOR":
					newhtml[i] = <NOR key={i} id={i.toString()} A={structuredClone(c.inputs[0].id)} B={structuredClone(c.inputs[1].id)} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;
				case "XNOR":
					newhtml[i] = <XNOR key={i} id={i.toString()} A={structuredClone(c.inputs[0].id)} B={structuredClone(c.inputs[1].id)} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;
			}
		}
		setComponentHTML(newhtml)


		let newDeleteHTML: JSX.Element[] = [<option value={-1}>Delete Component</option>];

		for(let i in components) {
			if(components[i].type === "deleted_gate") { continue; }
			newDeleteHTML.push(<option value={i}>Delete: ID: {i} ({components[i].type})</option>)
		}
		setDeleteHTML(newDeleteHTML);

	}, [components])

	function toggleConfig(param: string) {
		let newConfig = structuredClone(config);
		newConfig[param] = !newConfig[param];
		setConfig(newConfig);
	}

	return (
	<div>

		<table>
		<tbody>
			<tr>
				<td>I/O</td>
				<td><button className="interactBtn" onClick={(e) => {create("SW")}}>SW</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("LED")}}>LED</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("NOT")}}>NOT</button></td>

			
			</tr>
			<tr>
				<td>Gates</td>
				<td><button className="interactBtn" onClick={(e) => {create("AND")}}>AND</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("OR")}}>OR</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("XOR")}}>XOR</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button className="interactBtn" onClick={(e) => {create("NAND")}}>NAND</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("NOR")}}>NOR</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("XNOR")}}>XNOR</button></td>
				<td></td>
			</tr>
			<tr>
				<td>Busses</td>
				<td><button className="interactBtn" onClick={(e) => {create("BUS")}}>BUS</button></td>
			</tr>
			<tr>
				<td>Config</td>
				<td><button className="interactBtn" onClick={(e) => {toggleConfig("hideDetails")}}>Details</button></td>
				<td><button className="interactBtn" onClick={(e) => {toggleConfig("hideWireStates")}}>Wires</button></td>
			</tr>
		</tbody>
		</table>
		<div style={{left: "3.3em", position: 'absolute'}}>

		<select onChange={(e) => {remove(parseInt(e.target.value))}}>
			{deleteHTML}
		</select>
		</div>

		

		{/* <button onClick={(e) => {remove(toRemove)}}>Delete</button><input onChange={(e) => {setToRemove(parseInt(e.target.value))}}></input> */}
		<Xwrapper>
			<ConfigContext.Provider value={{config, setConfig} as ConfigContent}>
			<WireContext.Provider value={{wires, setWires} as WireContent}>
				<WireRenderer components={components} connectIn={connectIn} connectOut={connectOut}/>
				{componentHTML}
				<MouseFollower />
			</WireContext.Provider>
			</ConfigContext.Provider>
		</Xwrapper>
	</div> )
}


export default Workspace;

