import { useEffect, useState } from "react";

import Wire from "./Wire";

import { component } from "../models/component";

const Render = ({components, connectIn, connectOut}: {components: component[], connectIn: string, connectOut: string}) => {

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	const [wireHTML, setWireHTML] = useState<JSX.Element[]>([]);
	const [tempWire, setTempWire] = useState(<a></a>);


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

	
	return (
		<div>
			{wireHTML}
			{tempWire}
		</div>
	);
}

export default Render;