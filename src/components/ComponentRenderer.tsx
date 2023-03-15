import React, { useContext, useEffect, useImperativeHandle, useState } from "react";
import { useXarrow } from "react-xarrows";

import { ComponentContext, ComponentDataContext } from "./Context";
import { pos } from "../models/pos";
import { component } from "../models/component";

import { Gate } from "./logicComponents/Gate";
import { SW,  SWBUS, LED } from "./logicComponents/IO";
import { BUS, MUX, ADDER } from "./logicComponents/Busses"
import { REG } from "./logicComponents/Memory";

const ComponentRenderer = React.forwardRef(({connect, setPos}: {connect: (side: string, id: string) => void, setPos: (pos: pos, id: string) => void}, ref: any) => {

	const [componentHTML, setComponentHTML] = useState<JSX.Element[]>([]);
	const {components, setComponents} = useContext(ComponentContext);
	const {componentData, setComponentData} = useContext(ComponentDataContext);

	const updateXarrow = useXarrow();

	function portToConnect(port: string) {
		return port.split(".")[1][0]==="+"?"out":"in";
	}

	useImperativeHandle(ref, () => ({
		create: (type: string) => {
			let newcomps = structuredClone(components);
			let newComponentData = structuredClone(componentData);
	
			newcomps.push({
				type: type,
				init_pos: {x:0,y:0} as pos,
				inputs: []
			} as component)
			newComponentData.push({});
	
			setComponentData(newComponentData);
			setComponents(newcomps);
			updateXarrow();
		},
		remove: (n: number) => {
			let newComponents = structuredClone(components);
			newComponents[n].type = "deleted_gate"; //mark it as deleted
			newComponents[n].inputs = []; //remove its inputs
			
			//remove references to deleted gates
			for(let i in newComponents) { //for each component
				let c = newComponents[i]; //cache component
				for(let j in c.inputs) { //for each input in component
					let input = c.inputs[j]; // cache input object
		
					if(input === null || input === undefined) { continue; } //Skip if the input isnt defined
					if(input.id.split(".")[0] === "-1") { continue; } //Skip if the reference is null
	
					if(newComponents[parseInt(input.id.split(".")[0])].type === "deleted_gate") { //check if the gate that the input references is dead
						try {
							newComponents[i].inputs[j].id = -1; //if it is dead, then remove the reference to it
						} catch {}
					}
				}
			}
			setComponents(newComponents);
			updateXarrow();
		}
	}))

	

	useEffect(() => {
		let newhtml: JSX.Element[] = [];
		let newComponents: component[] = structuredClone(components);
		
		for(let i in newComponents) {
			let c = newComponents[i];
			let pos = !c.init_pos ? {x:0,y:0} as pos : c.init_pos;
			
			if(c === null) { continue; }
			switch(c.type) {
				case "SW":
					newhtml[i] = <SW  key={i} pos={pos} id={i}              onClick={(id) => {connect("in", id)}} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;

				case "SWBUS":
					newhtml[i] = <SWBUS  key={i} pos={pos} id={i}           onClick={(id) => {connect("in", id)}} setPos={(pos, id) => {setPos(pos, id)}}/>
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
					newhtml[i] = <Gate key={i} pos={pos} id={i} I={c.inputs} type={c.type} onClick={(e) => connect(portToConnect(e), e)} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
				
				case "BUS":
					newhtml[i] = <BUS  key={i} pos={pos} id={i} I={c.inputs} onClick={(e) => connect(portToConnect(e), e)} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
				case "MUX":
					newhtml[i] = <MUX  key={i} pos={pos} id={i} I={c.inputs} onClick={(e) => connect(portToConnect(e), e)} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
				case "ADDER":
					newhtml[i] = <ADDER  key={i} pos={pos} id={i} I={c.inputs} onClick={(e) => connect(portToConnect(e), e)} setPos={(pos, id) => {setPos(pos, id)}}/>
					break;
				case "REG":
					newhtml[i] = <REG   key={i} pos={pos} id={i} I={c.inputs} onClick={(e) => connect(portToConnect(e), e)} setPos={(pos, id) => {setPos(pos, id)}}/>
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

})

export default ComponentRenderer;