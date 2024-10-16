import { useContext, useEffect, useState } from "react";

import { Component, Inputs, Outputs } from "./Component";
import { ComponentDataContext, WireContext } from "../Context";
import { pos } from "../../models/pos";
import { input } from "../../models/component";

import ADDER_PNG from "../../images/adder.png"
import MUX_TOP_PNG from "../../images/mux_top.png"
import MUX_BOT_PNG from "../../images/mux_bot.png"
import Wire from "../Wire";

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
			let Cin = parseInt(wires[I[18].id as keyof {}], 2)
			let A   = parseInt(wires[I[0 ].id as keyof {}], 2)
			let B   = parseInt(wires[I[1 ].id as keyof {}], 2)
			let Y   = (A+B+Cin).toString(2);
			
			let overflowLength = Math.max((wires[I[0].id as keyof {}] as string).length, (wires[I[0].id as keyof {}] as string).length) + 1
			
			let newWires = structuredClone(wires)
			
			newWires[`${id}.-Y`] = Y.slice(-(overflowLength-1)); //force cut off overflow bit to keep the bitsizes the same for input and output
			
			if(Y.length >= overflowLength) { //seperately return overflow
				newWires[`${id}.-R`] = Y[0];
			} else {
				newWires[`${id}.-R`] = 0;
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
				<Inputs inputCount={2} heights={[40, 120]} labelInputs componentID={id} onClick={(id) => onClick(id)}/>

				<div id={`${id}.-Y`} className="field" style={{right: "0%", top: `65px`, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.-Y`)} style={{marginRight: ".3em", display: display}}>Y</button>Y{'\u00A0'}
				</div>

				<div id={`${id}.-R`} className="field" style={{right: "50%", bottom: `20px`, position: "absolute", transform: "translate(50%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.-R`)} style={{marginRight: ".3em", display: display}}>C</button>{display==="none"?"Cout":""}{'\u00A0'}
				</div>

				<div id={`${id}.+S`} className="field" style={{right: "50%", top: `31px`, position: "absolute", transform: "translate(50%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.+S`)} style={{marginRight: ".3em", display: display}}>C</button>{display==="none"?"Cin":""}{'\u00A0'}
				</div>
			</div>
		</Component>
	)
}

export function SPLITTER({id, I, pos, onClick, setPos}: {id: string, I: input[], pos: pos, onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) {

	const {wires, setWires} = useContext(WireContext);
	const {componentData, setComponentData} = useContext(ComponentDataContext);

	const [display, setDisplay] = useState("inline");
	const [height, setHeight] = useState(60);
	const [outputs, setOutputs] = useState(1);

	const [value, setValue] = useState<string>("");

	const [styleCode, setStyleCode] = useState(<a></a>)


	useEffect(() => {
		let newWires = structuredClone(wires);
		try {
			let input = newWires[I[0].id];

			let indices = value;

			if(indices === undefined || indices === "") {return;}

			let lowBit = parseInt(indices.split(":")[1]);
			let highBit = parseInt(indices.split(":")[0]);

			if(lowBit !== 0 && !lowBit) {lowBit = highBit;}

			newWires[`${id}.-A`] = input.substring(input.length-lowBit, input.length-highBit-1);
			
			// console.log(`${i}------------------------------`);
			// console.log(lowBit, highBit);

			// let newLeft  = input.length-lowBit;
			// let newRight = input.length-highBit-1;

			
			// console.log(newLeft, newRight);
			// console.log(input.substring(newLeft, newRight));
			

		} catch (e) {}
		if(JSON.stringify(newWires) !== JSON.stringify(wires)) {
			setWires(newWires);
		}
	}, [wires, value])

	useEffect(() => {
		let newComponentData = structuredClone(componentData);
		newComponentData[id]["outputs"] = outputs;
		newComponentData[id]["inputValues"] = value;
		setComponentData(newComponentData);
	}, [outputs, value]);

	useEffect(() => {
		setValue(componentData[id as keyof {}]["value"] as string || "");
		setOutputs(componentData[id as keyof {}]["outputs"] as number || 1);
	}, []);


	useEffect(() => {
		// console.log(value)
		if(display === "none") {
			setStyleCode(<div style={{height: "4em"}}>
				{/* <Wire start={`${id}.-A`} end={`${id}.+A`}/> */}
				<label style={{position: "absolute", bottom: "0px", right: "0px"}}>{value}</label>
			</div>)
		} else {
			setStyleCode(<div></div>)
		}
	}, [display])


	return (
		<Component id={id} defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(h,d) => setDisplay(d)}>
			<div style={{userSelect: "none", width: `130px`, height: `${height}px`, border: `${display==="none" ? "none" : "5px solid white"}` }}>

				<Inputs inputCount={1} heights={[height/2]} labelInputs={false} componentID={id} onClick={(id) => onClick(id)}/>
				<Outputs outputCount={1} heights={[30]} labelOutputs={false} componentID={id} onClick={(id) => onClick(id)}/>
				
				<input defaultValue={value} style={{display: display, position: "absolute", width:"50px", top: 20, right: "3em"}} onChange={(e) => setValue(e.target.value.toString())} />
				
				{styleCode}

			</div>
		</Component>
	)

}
