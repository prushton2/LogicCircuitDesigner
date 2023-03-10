import { useEffect, useState } from "react";
import { component, input } from "../models/component";

import { pos } from "../models/pos";

import { Gate } from "./logicComponents/Gate";
import { SW,  SWBUS, LED } from "./logicComponents/IO";
import { BUS, MUX, ADDER } from "./logicComponents/Busses"

const ComponentRenderer = ({components, connect, setPos}: {components: component[], connect: (side: string, id: string) => void, setPos: (pos: pos, id: string) => void}) => {

	const [componentHTML, setComponentHTML] = useState<JSX.Element[]>([]);

	useEffect(() => {
		let newhtml: JSX.Element[] = [];

		for(let i in components) {
			let c = components[i];
			let pos = !c.init_pos ? {x:0,y:0} as pos : c.init_pos;
			
			if(c === null) { continue; }
			switch(c.type) {
				case "SW":
					newhtml[i] = <SW  key={i} pos={pos} id={i}              onClick={(id) => {connect("in", id)}} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;

				case "SWBUS":
					newhtml[i] = <SWBUS  key={i} pos={pos} id={i}              onClick={(id) => {connect("in", id)}} setPos={(pos, id) => {setPos(pos, id)}}/>
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
					newhtml[i] = <BUS  key={i} pos={pos} id={i} I={c.inputs} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
				case "MUX":
					newhtml[i] = <MUX  key={i} pos={pos} id={i} I={c.inputs} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
				case "ADDER":
					newhtml[i] = <ADDER  key={i} pos={pos} id={i} I={c.inputs} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)} setPos={(pos, id) => {setPos(pos, id)}}/>
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