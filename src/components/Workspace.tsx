import "./Workspace.css"

import { useEffect, useState } from "react";
import { WireContext, WireContent, ConfigContext, ConfigContent } from "./Context";

import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

import MouseFollower from "./MouseFollower";
import WireRenderer from "./WireRenderer";
import { upgrade } from "./FileUpgrader"

import { component, input } from "../models/component";
import ComponentRenderer from "./ComponentRenderer";
import { pos } from "../models/pos";

function Workspace() {

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	const [config, setConfig] = useState({"hideDetails": false, "hideWireStates": false});
	const [resetWires, setResetWires] = useState(false);

	const [wires, setWires] = useState(("{}"));
	const [components, setComponents] = useState<component[]>([]);
	const [deleteHTML, setDeleteHTML] = useState<JSX.Element[]>([]);

	const [connectIn, setConnectIn] = useState("");
	const [connectOut, setConnectOut] = useState("");

	const updateXarrow = useXarrow();

	function create(type: string) {

		let newcomps = structuredClone(components);
		newcomps.push({
			type: type,
			init_pos: {x:0,y:0} as pos,
			inputs: []
		} as component)
		setComponents(newcomps);
		updateXarrow();
	}

	function remove(n: number) {
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
				if(id === connectIn) {setConnectIn(""); return;}
				else {setConnectIn(id)};
				break;
				case "out": 
				if(id === connectOut) {setConnectOut(""); return;}
				else {setConnectOut(id)};
				break;
		}
	}

	function setPos(pos: pos, id: string) {
		let newComponents = structuredClone(components);
		newComponents[parseInt(id)].init_pos = structuredClone(pos);
		setComponents(newComponents);
	}

	useEffect(() => {
		if(connectIn !== "" && connectOut != "") {
			let input = parseInt(connectIn.split(".")[0])
			let outputid = parseInt(connectOut.split(".")[0])
			let outputPort = alphabet.indexOf(connectOut.split(".")[1]);

			let newComponents = structuredClone(components);
			try {
				if (newComponents[outputid].inputs[outputPort].id === input) {
					newComponents[outputid].inputs[outputPort].id = -1;
				} else {
					newComponents[outputid].inputs[outputPort] = {id: input} as input;
				}
			} catch {
				newComponents[outputid].inputs[outputPort] = {id: input} as input;
			}
			setComponents(newComponents);
			
			setConnectIn("");
			setConnectOut("");
		}
	}, [connectIn, connectOut])

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {		
			if (event.key === 'Escape') {
				setConnectIn("");
				setConnectOut("");
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => { document.removeEventListener('keydown', handleKeyDown); };
	}, [])

	useEffect(() => {
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

	function save() {
		let fileContent = JSON.stringify({
			version: "0.0.2",
			components: components,
			wires: wires
		})

		const blob = new Blob([fileContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.download = "circuit.lcf";
		link.href = url;

		link.click();
	}
	
	function loadLCF(lcf: string) {
		let parsedFile = JSON.parse(upgrade(lcf));
		let comps, wrs;
		try {
			comps = parsedFile.components;
			wrs = parsedFile.wires;
		} catch {
			return;
		}

		let newComponents = comps as component[];
		let newWires = wrs as string[];
		setComponents(newComponents);
		setWires(newWires);
	}

	function handleFile(e: any) {
		e.preventDefault();
		const reader = new FileReader();
		reader.onload = async (e: any) => { 
			const text = (e.target.result);
			loadLCF(text);
		};
		reader.readAsText(e.target.files[0]);
	}


	return (
	<div>
		<table>
		<tbody>
			<tr>
				<td>Save</td>
				<td><button className="interactBtn" onClick={(e) => {save()}}>Save</button></td>
				<td>
					<label htmlFor="contained-button-file">
						<input type="file" id="contained-button-file" onChange={(e) => {handleFile(e)}} hidden/>
						<button className="interactBtn" onClick={(e) => {document.getElementById("contained-button-file")?.click()}}>Upload</button>
					</label>
				</td>
				<td><button className="interactBtn" onClick={(e) => {setComponents([]);setWires([])}}>Clear</button></td>
			</tr>
			<tr>
				<td>I/O</td>
				<td><button className="interactBtn" onClick={(e) => {create("SW")}}>SW</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("SWBUS")}}>SW [7:0]</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("LED")}}>LED</button></td>
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
			</tr>
			<tr>
				<td></td>
				<td><button className="interactBtn" onClick={(e) => {create("NOT")}}>NOT</button></td>
			</tr>
			<tr>
				<td>Busses</td>
				<td><button className="interactBtn" onClick={(e) => {create("BUS")}}>BUS</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("MUX")}}>MUX</button></td>
				<td><button className="interactBtn" onClick={(e) => {create("ADDER")}}>ADDER</button></td>
			</tr>
			<tr>
				<td>Config</td>
				<td><button className="interactBtn" onClick={(e) => {toggleConfig("hideDetails")}}>Details</button></td>
				<td><button className="interactBtn" onClick={(e) => {toggleConfig("hideWireStates")}}>Wires</button></td>
				<td><button className="interactBtn" onClick={(e) => {setResetWires(!resetWires)}}>Fix Wires</button></td>
			</tr>
		</tbody>
		</table>
		<div style={{left: "3.3em", position: 'absolute'}}>

		<select onChange={(e) => {remove(parseInt(e.target.value))}}>
			{deleteHTML}
		</select>
		</div>

		

		<Xwrapper>
			<ConfigContext.Provider value={{config, setConfig} as ConfigContent}>
			<WireContext.Provider value={{wires, setWires} as WireContent}>
				<WireRenderer components={components} connectIn={connectIn} connectOut={connectOut} resetWires={resetWires}/>
				<ComponentRenderer components={components} connect={(side, id) => connect(side, id)} setPos={(pos, id) => {setPos(pos, id)}}/>
				<MouseFollower />
			</WireContext.Provider>
			</ConfigContext.Provider>
		</Xwrapper>
	</div> )
}


export default Workspace;

