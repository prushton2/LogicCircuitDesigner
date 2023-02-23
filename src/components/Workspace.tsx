import { useEffect, useState } from "react";
import { WireContext, WireContent, ConfigContext, ConfigContent } from "./Context";

import { Xwrapper } from "react-xarrows";

import MouseFollower from "./MouseFollower";
import WireRenderer from "./WireRenderer";
import { AND, OR, XOR } from "./Gate";
import { Switch, LED } from "./IO";

import { component, input } from "../models/component";

function Workspace() {

	const [config, setConfig] = useState({"displayMode": "full"});
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	
	const [wires, setWires] = useState<boolean[]>([]);
	const [components, setComponents] = useState<component[]>([]);
	const [componentHTML, setComponentHTML] = useState<JSX.Element[]>([]);

	const [toRemove, setToRemove] = useState(-1);

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

	function remove(n: number) {
		let newComponents = structuredClone(components);
		newComponents[n] = null;
		setComponents(newComponents);
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
			}
		}
		setComponentHTML(newhtml)
	}, [components])

	

	return (
	<div>
		<button onClick={(e) => {create("SW")}}>SW</button>
		<button onClick={(e) => {create("LED")}}>LED</button>
		<button onClick={(e) => {create("AND")}}>AND</button>
		<button onClick={(e) => {create("OR")}}>OR</button>
		<button onClick={(e) => {create("XOR")}}>XOR</button>
		<button onClick={(e) => {remove(toRemove)}}>Delete</button><input onChange={(e) => {setToRemove(parseInt(e.target.value))}}></input>
		<button onClick={(e) => {setConfig({"displayMode": "full"})}}>Show</button>
		<button onClick={(e) => {setConfig({"displayMode": "clean"})}}>Hide</button>
		<Xwrapper>
			<ConfigContext.Provider value={{config, setConfig} as ConfigContent}>
			<WireContext.Provider value={{wires, setWires} as WireContent}>
				{componentHTML}
				<WireRenderer components={components} connectIn={connectIn} connectOut={connectOut}/>
				<MouseFollower />
			</WireContext.Provider>
			</ConfigContext.Provider>
		</Xwrapper>
	</div> )
}


export default Workspace;

