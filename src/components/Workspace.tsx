import { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

import Wire from "./Wire"

import { AND, OR, XOR } from "./gate"
import Switch from "./Switch";

function Render() {

	const [gates, setGates] = useState<JSX.Element[]>([]);
	const [wires, setWires] = useState(JSON.parse("{}"))
    const updateXarrow = useXarrow();

	function wire(id: string, newValue: boolean) {
		if(!!wires[id as keyof JSON] == newValue) {
			return;
		}
		let newWires = structuredClone(wires);
		newWires[id] = newValue;
		setWires(newWires);
	}
	

	return (
		<div>
			<Xwrapper>

				<XOR  id="X0" A={ wires["S0"] } B={ wires["S1"] } Y={(id, Y) => {wire(id, Y)}} />
				<XOR  id="X1" A={ wires["X0"] } B={ wires["S2"] } Y={(id, Y) => {wire(id, Y)}} />
				
				<AND id="A0"  A={ wires["S0"] } B={ wires["S1"] } Y={(id, Y) => {wire(id, Y)}} />
				<AND id="A1"  A={ wires["X0"] } B={ wires["S2"] } Y={(id, Y) => {wire(id, Y)}} />

				<OR  id="O0"  A={ wires["A0"] } B={ wires["A1"] } Y={(id, Y) => {wire(id, Y)}} />


				<Switch id = "S0" Y={(id, y) => {wire(id, y)}}/>
				<Switch id = "S1" Y={(id, y) => {wire(id, y)}}/>
				<Switch id = "S2" Y={(id, y) => {wire(id, y)}}/>


				<Wire start="S0.Y" end="X0.A" wires={wires}/>
				<Wire start="S1.Y" end="X0.B" wires={wires}/>

				<Wire start="X0.Y" end="X1.A" wires={wires}/>
				<Wire start="S2.Y" end="X1.B" wires={wires}/>

				<Wire start="S0.Y" end="A0.A" wires={wires}/>
				<Wire start="S1.Y" end="A0.B" wires={wires}/>

				<Wire start="X0.Y" end="A1.A" wires={wires}/>
				<Wire start="S2.Y" end="A1.B" wires={wires}/>

				<Wire start="A0.Y" end="O0.A" wires={wires}/>
				<Wire start="A1.Y" end="O0.B" wires={wires}/>

			</Xwrapper>
		</div>
	)
}

export default Render;