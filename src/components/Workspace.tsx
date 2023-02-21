import { useEffect, useState } from "react";

import { wire } from "../models/wire";

import { AND, OR } from "./gate"

function Render() {

	const [gates, setGates] = useState<JSX.Element[]>([]);
	const [wires, setWires] = useState<wire[]>([
		{value: true} as wire,
		{value: true} as wire,
		{value: false} as wire,
		{value: false} as wire,
		{value: false} as wire,
		{value: false} as wire,
		{value: false} as wire,
		{value: false} as wire,
		{value: false} as wire,
		{value: false} as wire,
		{value: false} as wire,
		{value: false} as wire
	]);

	const [renderedWires, setRenderedWires] = useState<JSX.Element[]>([]);


	function wire(id: number, newValue: boolean) {
		if(wires[id].value == newValue) {
			return;
		}

		let newWires = structuredClone(wires);
		console.log(`${id}--------------`);
		console.log(newWires[id]);
		newWires[id].value = newValue;
		console.log(newWires[id]);
		setWires(newWires);
	}


	useEffect(() => {

		let wireArray: JSX.Element[] = [];
	
		for(let i in wires) {
			wireArray[i] = <a key={i} >Wire {i}: {wires[i].value ? "1": "0"} <br /></a>
		}
		setRenderedWires(wireArray);


	}, [wires])
	

	return (
		<div>
			{renderedWires}a<br />
			<button onClick={(e) => wire(0, !wires[0].value)}>invert</button>
			
			<AND A={ wires[0] } B={ wires[1] } Y={(Y) => {wire(2, Y)}}/>
			<OR A={ wires[3] } B={ wires[2] } Y={(Y) => {wire(7, Y)}} />
		</div>
	)
}

export default Render;