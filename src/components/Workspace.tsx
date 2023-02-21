import { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

import { wire } from "../models/wire";

import { AND, OR, XOR } from "./gate"
import Switch from "./Switch";

function Render() {

	const [gates, setGates] = useState<JSX.Element[]>([]);
	const [wires, setWires] = useState<wire[]>([
		{value: false} as wire,
		{value: false} as wire,
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
    const updateXarrow = useXarrow();
	const [renderedWires, setRenderedWires] = useState<JSX.Element[]>([]);


	function wire(id: number, newValue: boolean) {
		if(wires[id].value == newValue) {
			return;
		}

		let newWires = structuredClone(wires);
		newWires[id].value = newValue;
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
			{/* {renderedWires} */}
			

			<Xwrapper>


				<XOR  id="X0" A={ wires[0] } B={ wires[1] } Y={(Y) => {wire(3, Y)}} />
				<XOR  id="X1" A={ wires[3] } B={ wires[2] } Y={(Y) => {wire(7, Y)}} />
				
				<AND id="A0" A={ wires[0] } B={ wires[1] } Y={(Y) => {wire(4, Y)}} />
				<AND id="A1" A={ wires[3] } B={ wires[2] } Y={(Y) => {wire(5, Y)}} />

				<OR  id="O0" A={ wires[4] } B={ wires[5] } Y={(Y) => {wire(11, Y)}} />


				<Switch id = "S0" Y={(y) => {wire(0, y)}}/>
				<Switch id = "S1" Y={(y) => {wire(1, y)}}/>
				<Switch id = "S2" Y={(y) => {wire(2, y)}}/>




				<Xarrow path="smooth" color={wires[0].value ? "red" : "blue"} curveness={0} start="S0.Y" end="X0.A" />
				<Xarrow path="smooth" color={wires[1].value ? "red" : "blue"} curveness={0} start="S1.Y" end="X0.B" />
				<Xarrow path="smooth" color={wires[3].value ? "red" : "blue"} curveness={0} start="X0.Y" end="X1.A" />
				<Xarrow path="smooth" color={wires[2].value ? "red" : "blue"} curveness={0} start="S2.Y" end="X1.B" />
 
				<Xarrow path="smooth" color={wires[0].value ? "red" : "blue"} curveness={0} start="S0.Y" end="A0.A" />
				<Xarrow path="smooth" color={wires[1].value ? "red" : "blue"} curveness={0} start="S1.Y" end="A0.B" />
 
				<Xarrow path="smooth" color={wires[2].value ? "red" : "blue"} curveness={0} start="S2.Y" end="A1.B" />
				<Xarrow path="smooth" color={wires[3].value ? "red" : "blue"} curveness={0} start="X0.Y" end="A1.A" />
 
				<Xarrow path="smooth" color={wires[4].value ? "red" : "blue"} curveness={0} start="A0.Y" end="O0.A" />
				<Xarrow path="smooth" color={wires[5].value ? "red" : "blue"} curveness={0} start="A1.Y" end="O0.B" />

			</Xwrapper>
	
	


		</div>
	)
}

export default Render;