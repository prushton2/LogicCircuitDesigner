import { useContext, useEffect, useState } from "react";

import { Component, Inputs } from "./Component";
import { ComponentDataContext, WireContext } from "../Context";
import { pos } from "../../models/pos";
import { input } from "../../models/component";

import ADDER_PNG from "../../images/adder.png"
import MUX_TOP_PNG from "../../images/mux_top.png"
import MUX_BOT_PNG from "../../images/mux_bot.png"

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
					
					<label style={{display: display, position: "absolute", top: "-30px"}}> BUS ({id})  </label><br />


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
	const {componentData, setComponentData} = useContext(ComponentDataContext);

	const [display, setDisplay] = useState("inline");
	const [height, setHeight] = useState(50);
	const [inputs, setInputs] = useState(4); //non-signal inputs

	useEffect(() => {
		console.log("updating inputs")
		setInputs(Math.min(Math.max(inputs, 2), 8))
		setHeight((inputs+2)*25 + (inputs+2)*3)
	}, [inputs])

	useEffect(() => {
		let newComponentData = structuredClone(componentData);

		newComponentData[id as keyof []].inputs = inputs;
		
		if(JSON.stringify(componentData) !== JSON.stringify(newComponentData)) {
			setComponentData(newComponentData);
		}
	}, [inputs])

	useEffect(() => {
		try {
			if(componentData[id as keyof {}]["inputs"] === undefined) {
				setInputs(4);
				return
			}

			setInputs(parseInt(componentData[id as keyof {}]["inputs"]));
		} catch {}
	}, [])

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
				<div style={{userSelect: "none", width: "90px", height: `${height-20}px`, borderLeft: "5px solid white", borderRight: "5px solid white"}}>
					
					<label style={{display: display, position: "absolute", top: "-70px"}}> MUX ({id})  </label><br />


					<img src={MUX_TOP_PNG} style={{position: "absolute", width: "100px", left: "-5px", 	 top: "-44px"}} onDragStart={(e) => {e.preventDefault()}}/>
					<img src={MUX_BOT_PNG} style={{position: "absolute", width: "100px", left: "-5px", bottom: "-44px"}} onDragStart={(e) => {e.preventDefault()}}/>

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
			<div style={{userSelect: "none", width: "90px", height: "90px", border: "0px solid white"}}>

				{display==="inline"?`ADDER (${id})`:""} <br />

				<img src={ADDER_PNG} onDragStart={(e) => {e.preventDefault()}}/>
				<Inputs inputCount={2} heights={[60, 150]} labelInputs componentID={id} onClick={(id) => onClick(id)}/>

				<div id={`${id}.Y`} style={{right: "0%", top: `85px`, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: ".3em", display: display}}>Y</button>Y{'\u00A0'}
				</div>

				<div id={`${id}.Z`} style={{right: "0%", top: `120px`, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.Z`)} style={{marginRight: ".3em", display: display}}>Z</button>Z{'\u00A0'}
				</div>
			</div>
		</Component>
	)
}
