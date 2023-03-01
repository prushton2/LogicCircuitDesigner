import { useEffect, useState } from "react";
import { component, input } from "../models/component";

import { pos } from "../models/pos";

import { Gate } from "./Gate";
import { SW, LED } from "./IO";
import { BUS } from "./Components"

const ComponentRenderer = ({components, positions, connect, setPos}: {components: component[], positions: pos[], connect: (side: string, id: string) => void, setPos: (pos: pos, id: string) => void}) => {

	const [componentHTML, setComponentHTML] = useState<JSX.Element[]>([]);

	useEffect(() => {
		let newhtml: JSX.Element[] = [];

		for(let i in components) {
			let c = components[i];
			let pos = positions[i] === undefined ? {x:0,y:0} as pos : positions[i];
			
			if(c === null) { continue; }
			switch(c.type) {
				case "SW":
					newhtml[i] = <SW  key={i} pos={pos} id={i}              onClick={(id) => {connect("in", id)}} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
				
				case "LED":
					newhtml[i] = <LED key={i} pos={pos} id={i} I={c.inputs} onClick={(id) => {connect("out", id)}} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
				
				case "AND":
				case "OR":
				case "XOR":
				case "NAND":
				case "NOR":
				case "XNOR":
				case "NOT":
					newhtml[i] = <Gate key={i} pos={pos} id={i} I={c.inputs} type={c.type} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
				
				case "BUS":
					newhtml[i] = <BUS  key={i} pos={pos} id={i} A={c.inputs[0].id} B={c.inputs[1].id} C={c.inputs[2].id} D={c.inputs[3].id} E={c.inputs[4].id} F={c.inputs[5].id} G={c.inputs[6].id} H={c.inputs[7].id} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
			}
		}
		setComponentHTML(newhtml)

	}, [components])

	return (
		<div>
			{componentHTML}
		</div>
	)

}

export default ComponentRenderer;