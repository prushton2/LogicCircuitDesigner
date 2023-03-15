import React, { useContext, useEffect, useImperativeHandle, useState } from "react";

import Wire from "./Wire";

import { component, input } from "../models/component";
import { ComponentContext } from "./Context";

const WireRenderer = React.forwardRef(({}, ref) => {

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	const {components, setComponents} = useContext(ComponentContext)
	
	const [wireHTML, setWireHTML] = useState<JSX.Element[]>([]);
	const [tempWire, setTempWire] = useState(<a></a>);
	const [rerenderWires, setRerenderWires] = useState(false);
	
	const [connectIn, setConnectIn] = useState("");
	const [connectOut, setConnectOut] = useState("");

	useImperativeHandle(ref, () => ({
		resetWires: () => {
			setWireHTML([<div />]);
			setRerenderWires(true)
		},
		connect: (side: string, id: string) => {
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

	}))

	useEffect(() => {
		if(rerenderWires) {
			setRerenderWires(false);
		}
		let newhtml: JSX.Element[] = []
		let newComponents: component[] = structuredClone(components)

		for(let i in newComponents) {
			let c = newComponents[i];

			for(let j in c.inputs) {
				if(c.inputs[j] === null) { continue; }
				if(c.inputs[j].id === -1) { continue; }

				newhtml.push(<Wire key={`${i}_${j}`} start={`${c.inputs[j].id}`} end={`${i}.${alphabet[j]}`}/>)
			}
		}
		setWireHTML(newhtml);
	}, [components, rerenderWires])

	useEffect(() => {

		if(connectIn !== "" && connectOut != "") {
			let input = connectIn
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
			setTempWire(<a></a>);
			return;
		}
		else if(connectIn !== "") {
			setTempWire(<Wire start={connectIn} end={"mouse"} />);
		}
		else if(connectOut !== "") {
			setTempWire(<Wire start={"mouse"} end={connectOut} />);
		}
	}, [connectIn, connectOut])



	useEffect(() => { //for escaping wire placement
		const handleKeyDown = (event: KeyboardEvent) => {		
			if (event.key === 'Escape') {
				setConnectIn("");
				setConnectOut("");
				setTempWire(<a></a>);
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => { document.removeEventListener('keydown', handleKeyDown); };
	}, [])

	return (
		<div>
			{wireHTML}
			{tempWire}
		</div>
	);
})

export default WireRenderer;