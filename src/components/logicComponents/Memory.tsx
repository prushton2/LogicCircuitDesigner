import "./Memory.css"
import { useContext, useEffect, useState } from "react";

import { Component, Inputs, Outputs } from "./Component";
import { ComponentDataContext, WireContext } from "../Context";
import { pos } from "../../models/pos";
import { input } from "../../models/component";

export const REG = ({id, pos, I, setPos, onClick}: {id: string, pos: pos, I: input[], setPos: (pos: pos, id: string) => void, onClick: (id: string) => void}) => {

	let alphabet = "ABCDEFGHIJKLMNOPQRSTUVQXYZ";
	const {wires, setWires} = useContext(WireContext)
	const [display, setDisplay] = useState("inline");
	const [inputs, setInputs] = useState(2);
	const [height, setHeight] = useState(inputs*30+80)

	useEffect(() => {
		setInputs(Math.max(Math.min(8, inputs), 1));
		setHeight(inputs*30+80);
	}, [inputs])

	useEffect(() => {
		try {
			let newWires = structuredClone(wires)
		
			if(wires[I[18].id as keyof {}][0] === "1") {
				for(let i = 0; i<inputs; i++) {
					let letter = alphabet[i];
					newWires[`${id}.-${letter}`] = wires[I[i].id][0];
				}
			}

			if(wires[I[17].id][0] === "1") {
				for(let i = 0; i<inputs; i++) {
					let letter = alphabet[i];
					newWires[`${id}.-${letter}`] = "0";
				}
			}

			if(JSON.stringify(newWires) !== JSON.stringify(wires)) {
				setWires(newWires);
			}

		} catch {return;}
	}, [wires])


	return (
		<Component id={id} defaultPos={pos} newPos={(pos: pos) => setPos(pos, id)} setDisplay={(h,d) => setDisplay(d)}>
			<div style={{userSelect: "none", width: "90px", height: `${height}px`, border: "5px solid white"}}>

				<Inputs inputCount={inputs} heights={[50, 80, 110, 140, 170, 200, 230, 260]} labelInputs componentID={id} onClick={(id) => onClick(id)}/>		
				<Outputs outputCount={inputs} heights={[50, 80, 110, 140, 170, 200, 230, 260]} labelOutputs componentID={id} onClick={(id) => onClick(id)}/>		
				
				
				<div id={`${id}.+S`} className="clk">
					clk <button className="field" onClick={(e) => onClick(`${id}.+S`)} style={{marginRight: ".3em", display: display}}>c</button>
				</div>

				<div id={`${id}.+R`} className="rst">
					rst <button className="field" onClick={(e) => onClick(`${id}.+R`)} style={{marginRight: ".3em", display: display}}>r</button>
				</div>


				<div className="field" style={{top: `15px`, position: "absolute", transform: "translate(0%, 0%)"}}>
					{'\u00A0'}<button onClick={(e) => {setInputs(inputs+1)}} style={{marginRight: ".3em", display: display}}>+</button>
					{'\u00A0'}<button onClick={(e) => {setInputs(inputs-1)}} style={{marginRight: ".3em", display: display}}>-</button>
				</div>
			</div>
		</Component>
	)
}