import { useEffect, useState } from "react";
import { component, input } from "../models/component";

import { Gate } from "./Gate";
import { Switch, LED } from "./IO";
import { BUS } from "./Components"

const ComponentRenderer = ({components, connect}: {components: component[], connect: (side: string, id: string) => void}) => {

	const [componentHTML, setComponentHTML] = useState<JSX.Element[]>([]);

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
					newhtml[i] = <LED key={i} id={i} A={c.inputs[0].id} onClick={(id) => {connect("out", id)}}/>
					break;
				
				case "AND":
					newhtml[i] = <Gate key={i} I={c.inputs} id={i.toString()} type={c.type} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
					break;
				
				
				case "BUS":
					newhtml[i] = <BUS key={i} id={i.toString()} A={c.inputs[0].id} B={c.inputs[1].id} C={c.inputs[2].id} D={c.inputs[3].id} E={c.inputs[4].id} F={c.inputs[5].id} G={c.inputs[6].id} H={c.inputs[7].id} onClick={(e) => connect(e.split(".")[1]=="Y"?"in":"out", e)}/>
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