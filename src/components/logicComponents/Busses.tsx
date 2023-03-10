import { useContext, useEffect, useState } from "react";

import { Component, Inputs } from "./Component";
import { WireContext } from "../Context";
import { pos } from "../../models/pos";
import { input } from "../../models/component";

export function BUS({id, pos, I, onClick, setPos}: {id: string, pos: pos, I: input[], onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) {

	const {wires, setWires} = useContext(WireContext);

	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration	
	
	useEffect(() => {
		let bus = "";

		for(let i = 0; i<8; i++) {
			try {
				if(I[i].id === -1) {
					continue;
				}
	
				bus += wires[I[i].id][0];
			} catch {}
		}
	
		if(JSON.stringify(wires[id as keyof []]) === JSON.stringify(bus)) {
			return;
		}

		let newWires = structuredClone(wires)
		newWires[id as keyof []] = structuredClone(bus);
		setWires(newWires);
	}, [wires])

	return (
		<div>
			<Component defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
				<div style={{width: "90px", height: "205px", border: "5px solid white"}}>
					<div id={`${id}.A`} style={{left: "0%", top: "15px", position: "absolute", transform: "translate(0%, -50%)"}}>
						{'\u00A0'}A<button onClick={(e) => onClick(`${id}.A`)} style={{marginLeft: ".3em", display: display}}>A</button><br /> 
					</div>
					<div id={`${id}.B`} style={{left: "0%", top: "40px", position: "absolute", transform: "translate(0%, -50%)"}}>
						{'\u00A0'}B<button onClick={(e) => onClick(`${id}.B`)} style={{marginLeft: ".3em", display: display}}>B</button><br /> 
					</div>
					<div id={`${id}.C`} style={{left: "0%", top: "65px", position: "absolute", transform: "translate(0%, -50%)"}}>
						{'\u00A0'}C<button onClick={(e) => onClick(`${id}.C`)} style={{marginLeft: ".3em", display: display}}>C</button><br /> 
					</div>
					<div id={`${id}.D`} style={{left: "0%", top: "90px", position: "absolute", transform: "translate(0%, -50%)"}}>
						{'\u00A0'}D<button onClick={(e) => onClick(`${id}.D`)} style={{marginLeft: ".3em", display: display}}>D</button><br /> 
					</div>
					<div id={`${id}.E`} style={{left: "0%", top: "115px", position: "absolute", transform: "translate(0%, -50%)"}}>
						{'\u00A0'}E<button onClick={(e) => onClick(`${id}.E`)} style={{marginLeft: ".3em", display: display}}>E</button><br /> 
					</div>
					<div id={`${id}.F`} style={{left: "0%", top: "140px", position: "absolute", transform: "translate(0%, -50%)"}}>
						{'\u00A0'}F<button onClick={(e) => onClick(`${id}.F`)} style={{marginLeft: ".3em", display: display}}>F</button><br /> 
					</div>
					<div id={`${id}.G`} style={{left: "0%", top: "165px", position: "absolute", transform: "translate(0%, -50%)"}}>
						{'\u00A0'}G<button onClick={(e) => onClick(`${id}.G`)} style={{marginLeft: ".3em", display: display}}>G</button><br /> 
					</div>
					<div id={`${id}.H`} style={{left: "0%", top: "190px", position: "absolute", transform: "translate(0%, -50%)"}}>
						{'\u00A0'}H<button onClick={(e) => onClick(`${id}.H`)} style={{marginLeft: ".3em", display: display}}>H</button><br /> 
					</div>

					<div id={`${id}.Y`} style={{right: "0%", top: "95px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: ".3em", display: display}}>Y</button>Y{'\u00A0'}
					</div>

				</div>
			</Component>
		</div>
	);
}

export function MUX({id, pos, I, onClick, setPos}: {id: string, pos: pos, I: input[], onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) {

	const {wires, setWires} = useContext(WireContext);

	const [display, setDisplay] = useState("inline");
	const [height, setHeight] = useState(50);
	const [inputs, setInputs] = useState(4); //non-signal inputs

	useEffect(() => {
		setHeight((inputs+2)*25 + (inputs+2)*3)
	}, [inputs])

	useEffect(() => {
		try {
			let newWires = structuredClone(wires);
			let i = parseInt(newWires[I[18].id as keyof []], 2)
			newWires[parseInt(id) as keyof []] = wires[I[i].id];

			if(JSON.stringify(newWires) != JSON.stringify(wires)) {
				setWires(newWires);
			}
		} catch {
			return;
		}
	}, [wires])

	return (
		<div>
			<Component defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
				<div style={{width: "90px", height: `${height}px`, border: "5px solid white"}}>
					
					<div id={`${id}.S`} style={{left: "0%", top: `${20}px`, position: "absolute", transform: "translate(0%, -50%)"}}>
						{'\u00A0'}S <button onClick={(e) => onClick(`${id}.S`)} style={{marginRight: ".3em", display: display}}>S</button>
					</div>

					<Inputs inputCount={inputs} heights={[50, 80, 110, 140, 170, 200, 230, 260]} labelInputs componentID={id} onClick={(i: string) => {onClick(i)}}/>

					<div id={`${id}.Y`} style={{right: "0%", top: `${height/2}px`, position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: ".3em", display: display}}>Y</button>Y{'\u00A0'}
					</div>
				</div>
			</Component>
		</div>
	)
}