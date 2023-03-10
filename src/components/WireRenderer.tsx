import { useEffect, useState } from "react";

import Wire from "./Wire";

import { component } from "../models/component";

const WireRenderer = ({components, connectIn, connectOut, resetWires}: {components: component[], connectIn: string, connectOut: string, resetWires: boolean}) => {

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	const [wireHTML, setWireHTML] = useState<JSX.Element[]>([]);
	const [tempWire, setTempWire] = useState(<a></a>);
	const [rerenderWires, setRerenderWires] = useState(false);


	useEffect(() => {
		let newhtml: JSX.Element[] = []
		for(let i in components) {
			let c = components[i];

			for(let j in c.inputs) {
				if(c.inputs[j] === null) { continue; }
				if(c.inputs[j].id === -1) { continue; }

				newhtml.push(<Wire key={`${i}_${j}`} start={`${c.inputs[j].id}.Y`} end={`${i}.${alphabet[j]}`}/>)
			}
		}
		setWireHTML(newhtml);
	}, [components, rerenderWires])

	useEffect(() => {
		if(connectIn !== "") {
			setTempWire(<Wire start={connectIn} end={"mouse"} />);
		}
		else if(connectOut !== "") {
			setTempWire(<Wire start={"mouse"} end={connectOut} />);
		}
		else {
			setTempWire(<a></a>);
		}
	}, [connectIn, connectOut])

	useEffect(() => {
		setWireHTML([<div />]);
	}, [resetWires])
	
	useEffect(() => {
		if(JSON.stringify(wireHTML) === "[<div />]") {
			setRerenderWires(!rerenderWires);
		}
	}, [wireHTML])

	return (
		<div>
			{wireHTML}
			{tempWire}
		</div>
	);
}

export default WireRenderer;