import React, { useContext, useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { WireContext } from "./WireContext";

import AND_png from "../images/AND.png"
import OR_png  from "../images/OR.png"
import XOR_png from "../images/XOR.png"


const Gate = ({A, B, comp, label, id, onClick}: {
	A: number, B: number, label: string, id: string,

	comp: (A: boolean, B: boolean) => boolean,
	onClick: (id: string) => void}) => {
	
	const [image, setImage] = useState(AND_png);
	const [style, setStyle] = useState(JSON.parse("{}"));
	const {wires, setWires} = useContext(WireContext);
	const updateXarrow = useXarrow();


	useEffect(() => {
		switch(label) {
			case "AND":
				setImage(AND_png);
				setStyle({
					A_top: "45px",
					O_top: "65px",
					B_top: "80px",
				})
				break;
			case "OR":
				setImage(OR_png);
				setStyle({
					A_top: "40px",
					O_top: "60px",
					B_top: "80px",
				})
				break;
			case "XOR":
				setImage(XOR_png);
				setStyle({
					A_top: "40px",
					O_top: "55px",
					B_top: "75px",
				})
				break;
		}
	}, [])

	useEffect(() => {
		let newValue = comp(wires[A], wires[B]);

		if(wires[id as keyof []] === newValue) {
			return;
		}

		let newWires = structuredClone(wires);
		newWires[id] = newValue;
		setWires(newWires);
	}, [wires])

	return (


		<Draggable grid={[5, 5]} onDrag={updateXarrow} onStop={updateXarrow}>

			<div style={{position: "absolute", border: "0px solid red", width: "90px", height: "90px"}}>
				
				{label} ({id}) <br />

				<img src={image} style={{width: "90px", position: "absolute", transform: "translate(-50%, 10%)"}}/>

				<div id={`${id}.A`} style={{left: "0%", top: style.A_top, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.A`)} style={{marginLeft: "1.3em"}}>A</button><br /> 
				</div>

				<div id={`${id}.Y`} style={{right: "0%", top: style.O_top, position: "absolute", transform: "translate(0%, -50%)"}}>
					{comp(wires[A], wires[B])?1:0}<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: "1.3em"}}>Y</button>
				</div>

				<div id={`${id}.B`} style={{left: "0%", top: style.B_top, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.B`)} style={{marginLeft: "1.3em"}}>B</button> <br/> 
				</div>


			</div>
		</Draggable>

	)
}

export const AND = ({A, B, id, onClick}: {A: number, B: number, id: string, onClick: (id: string) => void}) => {	
	return (
		<Gate id={id} A={A} B={B} comp={(A, B) => { return A && B; }} label={"AND"} onClick={(id) => onClick(id)}/>
	)
}

export const OR = ({A, B, id, onClick}: {A: number, B: number, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={B} comp={(A, B) => { return A || B; }} label={"OR"} onClick={(id) => onClick(id)}/>
	)
}

export const XOR = ({A, B, id, onClick}: {A: number, B: number, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={B} comp={(A, B) => { return ((A?1:0) + (B?1:0)) %2 == 1 }} label={"XOR"} onClick={(id) => onClick(id)}/>
	)
}