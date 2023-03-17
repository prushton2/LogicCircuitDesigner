import { useContext, useEffect, useState } from "react";

import { Component, Inputs, Outputs } from "./Component";
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
		newWires[`${id}.-Y`] = structuredClone(bus);

		if(JSON.stringify(wires) !== JSON.stringify(newWires)) {
			setWires(newWires);
		}
	}, [wires])

	return (
		<div>
			<Component id={id} defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
				<div style={{width: "90px", height: "205px", border: "5px solid white"}}>
					
					<Inputs inputCount={8} heights={[15,40,65,90,115,140,165,190]} labelInputs componentID={id} onClick={(id) => onClick(id)}/>
					
					<div id={`${id}.-Y`} className="field" style={{right: "0%", top: "95px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.-Y`)} style={{marginRight: ".3em", display: display}}>Y</button>Y{'\u00A0'}
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
		setInputs(Math.min(Math.max(inputs, 2), 8))
		setHeight((inputs+1)*25 + (inputs+1)*3)
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
			newWires[`${id}.-Y`] = wires[I[i].id as keyof {}];

			if(JSON.stringify(newWires) != JSON.stringify(wires)) {
				setWires(newWires);
			}
		} catch {
			return;
		}
	}, [wires])

	return (
		<div>
			<Component id={id} defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
				<div style={{userSelect: "none", width: "90px", height: `${height+88}px`, borderLeft: "5px solid white"}}>
					
					<div style={{position: "absolute", top: "44px", right: "-4px", height: `${height}px`, borderRight: "5px solid white"}}></div>

					<img src={MUX_TOP_PNG} style={{position: "absolute", width: "100px", left: "0px", 	 top: "0px"}} onDragStart={(e) => {e.preventDefault()}}/>
					<img src={MUX_BOT_PNG} style={{position: "absolute", width: "100px", left: "0px", bottom: "0px"}} onDragStart={(e) => {e.preventDefault()}}/>

					<div id={`${id}.+S`} className="field" style={{left: "50%", top: `37px`, position: "absolute", transform: "translate(-50%, -50%)"}}>
						{'\u00A0'}S <button onClick={(e) => onClick(`${id}.+S`)} style={{marginRight: ".3em", display: display}}>S</button>
					</div>

					<Inputs inputCount={inputs} heights={[64, 94, 124, 154, 184, 214, 244, 274, 304]} labelInputs componentID={id} onClick={(i: string) => {onClick(i)}}/>

					<div id={`${id}.-Y`} className="field" style={{right: "0%", top: `${((height+68)/2)}px`, position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.-Y`)} style={{marginRight: ".3em", display: display}}>Y</button>Y{'\u00A0'}
					</div>
					

					<div className="field" style={{right: "0%", top: `0px`, position: "absolute", transform: "translate(0%, 0%)"}}>
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
			
			let newWires = structuredClone(wires)
			
			newWires[`${id}.-Y`] = Y.slice(-(overflowLength-1)); //force cut off overflow bit to keep the bitsizes the same for input and output
			
			if(Y.length >= overflowLength) { //seperately return overflow
				newWires[`${id}.-Z`] = Y[0];
			} else {
				newWires[`${id}.-Z`] = 0;
			}

			if(JSON.stringify(newWires) !== JSON.stringify(wires)) {
				setWires(newWires);
			}

		} catch { return; }
	}, [wires])

	return(
		<Component id={id} defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(h, d) => {setDisplay(d)}}>
			<div style={{userSelect: "none", width: "90px", height: "170px", border: "0px solid white"}}>

				<img src={ADDER_PNG} onDragStart={(e) => {e.preventDefault()}}/>
				<Inputs inputCount={2} heights={[40, 130]} labelInputs componentID={id} onClick={(id) => onClick(id)}/>

				<div id={`${id}.-Y`} className="field" style={{right: "0%", top: `65px`, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.-Y`)} style={{marginRight: ".3em", display: display}}>Y</button>Y{'\u00A0'}
				</div>

				<div id={`${id}.-Z`} className="field" style={{right: "0%", top: `100px`, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.-Z`)} style={{marginRight: ".3em", display: display}}>Z</button>Z{'\u00A0'}
				</div>
			</div>
		</Component>
	)
}

export function SPLITTER({id, I, pos, onClick, setPos}: {id: string, I: input[], pos: pos, onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) {

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const {wires, setWires} = useContext(WireContext);

	const [display, setDisplay] = useState("inline");
	const [height, setHeight] = useState(90);
	const [outputs, setOutputs] = useState(8);

	const [inputHTML, setInputHTML] = useState<JSX.Element[]>([]);
	const [inputValues, setInputValues] = useState<string[]>([]);

	const heights = [30, 60, 90, 120, 150, 180, 210, 240];

	function setValue(id: number, text: string) {
		let newInputValues = structuredClone(inputValues);
		newInputValues[id] = text;
		setInputValues(newInputValues);
	}

	useEffect(() => {
		setHeight((outputs+1)*30);
		
		let newInputHTML = []
		for(let i = 0; i<outputs; i++) {
			newInputHTML.push(<input style={{position: "absolute", width:"50px", top: heights[i]-10, right: "3em"}} onChange={(e) => setValue(i, e.target.value.toString())} />)
		}
		setInputHTML(newInputHTML);
	}, [outputs])

	useEffect(() => {
		let newWires = structuredClone(wires);
		let input = newWires[I[0].id];
		try {
			for(let i = 0; i<outputs; i++) {
				let indices = inputValues[i];
				if(indices === undefined || indices === "") {continue;}
				let left = parseInt(indices.split(":")[0]);
				let right = parseInt(indices.split(":")[1]) || left;
				newWires[`${id}.-${alphabet[i]}`] = input.substring(input.length-left, input.length-right-1);
			}

		} catch (e) { }
		if(JSON.stringify(newWires) !== JSON.stringify(wires)) {
			setWires(newWires);
		}
	}, [wires, inputValues])

	return (
		<Component id={id} defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(h,d) => setDisplay(d)}>
			<div style={{userSelect: "none", width: `130px`, height: `${height}px`, border: "5px solid white"}}>

				<Inputs inputCount={1} heights={[height/2]} labelInputs componentID={id} onClick={(id) => onClick(id)}/>
				<Outputs outputCount={outputs} heights={heights} labelOutputs componentID={id} onClick={(id) => onClick(id)}/>
				{inputHTML}
			</div>
		</Component>
	)

}
