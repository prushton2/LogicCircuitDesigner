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
	
				bus += wires[I[i].id as keyof {}];
			} catch {}
		}
	
		
		let newWires = structuredClone(wires)
		newWires[`${id}.Y`] = structuredClone(bus);

		if(JSON.stringify(wires) !== JSON.stringify(newWires)) {
			setWires(newWires);
		}
	}, [wires])

	return (
		<div>
			<Component defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
				<div style={{width: "90px", height: "205px", border: "5px solid white"}}>
					
					<Inputs inputCount={8} heights={[15,40,65,90,115,140,165,190]} labelInputs componentID={id} onClick={(id) => onClick(id)}/>
					
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
		setInputs(Math.min(Math.max(inputs, 2), 8))
		setHeight((inputs+2)*25 + (inputs+2)*3)
	}, [inputs])

	useEffect(() => {
		try {
			let newWires = structuredClone(wires);
			let i = parseInt(newWires[I[18].id as keyof []], 2)
			newWires[`${id}.Y`] = wires[I[i].id as keyof {}];

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
					

					<div style={{right: "0%", top: `10px`, position: "absolute", transform: "translate(0%, 0%)"}}>
						{'\u00A0'}<button onClick={(e) => {setInputs(inputs*2)}} style={{marginRight: ".3em", display: display}}>+</button>
						{'\u00A0'}<button onClick={(e) => {setInputs(inputs/2)}} style={{marginRight: ".3em", display: display}}>-</button>
					</div>
				</div>
			</Component>
		</div>
	)
}

export function ADDER({id, I, pos, onClick, setPos}: {id: string, I: input[], pos: pos, onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) {
	
	const [display, setDisplay] = useState("inline");
	const {wires, setWires} = useContext(WireContext);
	
	useEffect(() => {
		try {
			let A = parseInt(wires[I[0].id as keyof {}], 2)
			let B = parseInt(wires[I[1].id as keyof {}], 2)
			let Y = (A+B).toString(2);
			
			let overflowLength = Math.max((wires[I[0].id as keyof {}] as string).length, (wires[I[0].id as keyof {}] as string).length) + 1
			//get the length of the higher bitsize + 1 to keep track of overflow
			
			let newWires = structuredClone(wires)
			
			newWires[`${id}.Y`] = Y.slice(-(overflowLength-1)); //force cut off overflow bit to keep the bitsizes the same for input and output
			
			if(Y.length >= overflowLength) { //seperately return overflow
				newWires[`${id}.Z`] = Y[0];
			} else {
				newWires[`${id}.Z`] = 0;
			}

			if(JSON.stringify(newWires) !== JSON.stringify(wires)) {
				setWires(newWires);
			}

		} catch { return; }
	}, [wires])

	return(
		<Component defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(h, d) => {setDisplay(d)}}>
			<div style={{width: "90px", height: "90px", border: "5px solid white"}}>
				<Inputs inputCount={2} heights={[30, 60]} labelInputs componentID={id} onClick={(id) => onClick(id)}/>

				<div id={`${id}.Y`} style={{right: "0%", top: `30px`, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: ".3em", display: display}}>Y</button>Y{'\u00A0'}
				</div>

				<div id={`${id}.Z`} style={{right: "0%", top: `60px`, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.Z`)} style={{marginRight: ".3em", display: display}}>Z</button>Z{'\u00A0'}
				</div>
			</div>
		</Component>
	)
}
