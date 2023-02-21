import { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

import { AND, OR, XOR } from "./Gate"
import Wire from "./Wire"
import { Switch, LED } from "./IO";

import { gate } from "../models/gate";

function Render() {

	const [gates, setGates] = useState<gate[]>([]);

	

	let wires = JSON.parse("{}");
	const [html, setHTML] = useState<JSX.Element>()

	useEffect(() => {
		updateHTML();
	}, [])

	function wire(id: string, newValue: boolean) {
		if(!!wires[id] == newValue) {
			return;
		}

		wires[id] = newValue;
		updateHTML();
	}
	
	function updateHTML() {
		setHTML(
			<div>
				<Xwrapper>

					<XOR  id="X0" A={ wires["S0"] } B={ wires["S1"] } Y={(id, Y) => {wire(id, Y)}} onClick={(id) => {console.log(id)}}/>
					<XOR  id="X1" A={ wires["X0"] } B={ wires["S2"] } Y={(id, Y) => {wire(id, Y)}} onClick={(id) => {console.log(id)}}/>
					
					<AND id="A0"  A={ wires["S0"] } B={ wires["S1"] } Y={(id, Y) => {wire(id, Y)}} onClick={(id) => {console.log(id)}}/>
					<AND id="A1"  A={ wires["X0"] } B={ wires["S2"] } Y={(id, Y) => {wire(id, Y)}} onClick={(id) => {console.log(id)}}/>

					<OR  id="O0"  A={ wires["A0"] } B={ wires["A1"] } Y={(id, Y) => {wire(id, Y)}} onClick={(id) => {console.log(id)}}/>

					<LED id="L0"  A={ wires["X1"] } onClick={(id) => {console.log(id)}}/>
					<LED id="L1"  A={ wires["O0"] } onClick={(id) => {console.log(id)}}/>


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

					<Wire start="X1.Y" end="L0.A" wires={wires}/>
					<Wire start="O0.Y" end="L1.A" wires={wires}/>

				</Xwrapper>
			</div>
		)
	}


	return (
		<div>
			{html}
		</div>
	)
}

export default Render;