import React, { useContext, useEffect, useState } from "react";

import { Component } from "./Component"
import { input } from "../../models/component";
import { WireContext } from "../Context";
import { pos } from "../../models/pos";

import AND_png from "../../images/AND.png"
import OR_png  from "../../images/OR.png"
import XOR_png from "../../images/XOR.png"
import NOT_png from "../../images/NOT.png"
import NAND_png from "../../images/NAND.png"
import NOR_png  from "../../images/NOR.png"
import XNOR_png from "../../images/XNOR.png"

interface buttonOffset {
	A_top: string,
	O_top: string,
	B_top: string,
}

const BaseGate = ({I, pos, comp, label, image, style, id, onClick, setPos}: { //the skeleton for a logic gate. Everything minus the image and logic.
	I: input[], pos: pos, label: string, image: string, style: buttonOffset, id: string,

	comp: (A: boolean, B: boolean) => boolean,
	onClick: (id: string) => void,
	setPos: (pos: pos, id: string) => void}) => {
	
	const {wires, setWires} = useContext(WireContext);
		
	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration

	useEffect(() => {
		let newValue: string | undefined;
		try {
			newValue = wires[I[0].id].split("").map((v, i) => {
				return comp(wires[I[0].id][i]==="1" ? true : false, wires[I[1].id][i]==="1" ? true : false) ? "1":"0"
			}).join()
		} catch {
			if(I.length === 1) {
				console.log("not");
				newValue = wires[I[0].id].split("").map((v, i) => {
					return comp(wires[I[0].id][i]==="1" ? true : false, false) ? "1":"0"
				}).join()
			}
		}
		
		console.log(newValue);
		console.log(wires[id as keyof []]);
		if(wires[id as keyof []] == newValue) {
			console.log("Same Result");
			return;
		}

		let newWires = structuredClone(wires);
		newWires[id] = newValue;
		setWires(newWires);
	}, [wires])


	return (
		<div>
			<Component defaultPos={pos} newPos={(pos) => {setPos(pos, id)}} setDisplay={(v, d) => {setDisplay(d)}}> 
				<div style={{userSelect: "none", position: "absolute", border: "0px solid red", width: "90px", height: "90px"}} >
			
					{display==="inline"?`${label} (${id})`:""} <br />

					<img src={image} style={{width: "90px", position: "absolute", transform: "translate(0%, 10%)"}} onDragStart={(e) => {e.preventDefault()}}/>

					<div id={`${id}.A`} style={{left: "0%", top: style.A_top, position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.A`)} style={{marginLeft: "1.3em", display: display}}>A</button><br /> 
					</div>

					<div id={`${id}.Y`} style={{right: "0%", top: style.O_top, position: "absolute", transform: "translate(0%, -50%)"}}>
						<label style={{display: display}}></label><button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: "1.3em", display: display}}>Y</button>
					</div>

					<div id={`${id}.B`} style={{left: "0%", top: style.B_top, display: style.B_top==="null"?"none":"inline", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.B`)} style={{marginLeft: "1.3em", display: display}}>B</button> <br/> 
					</div>
				</div>
			</Component>
		</div>



	)
}

export const Gate = ({I, id, pos, type, onClick, setPos}: {I: input[], pos: pos, id: string, type: string, onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) => {
	let style = {} as buttonOffset;
	let image = OR_png;
	let compare = (A: boolean, B: boolean) => {return A && B}

	
	switch(type) {
		case "AND":
			style = {A_top: "45px",O_top: "65px",B_top: "80px"} as buttonOffset,
			image = AND_png,
			compare = (A: boolean, B: boolean) => {return A && B}
			break;
		case "OR":
			style = {A_top: "40px",O_top: "60px",B_top: "80px"} as buttonOffset,
			image = OR_png,
			compare = (A: boolean, B: boolean) => {return A || B}
			break;
		case "XOR":
			style = {A_top: "40px",O_top: "55px",B_top: "75px"} as buttonOffset,
			image = XOR_png,
			compare = (A: boolean, B: boolean) => {return A !== B}
			break;

		case "NAND":
			style = {A_top: "45px",O_top: "60px",B_top: "75px"} as buttonOffset,
			image = NAND_png,
			compare = (A: boolean, B: boolean) => {return !(A && B)}
			break;
		case "NOR":
			style = {A_top: "40px",O_top: "55px",B_top: "70px"} as buttonOffset,
			image = NOR_png,
			compare = (A: boolean, B: boolean) => {return !(A || B)}
			break;
		case "XNOR":
			style = {A_top: "40px",O_top: "55px",B_top: "65px"} as buttonOffset,
			image = XNOR_png,
			compare = (A: boolean, B: boolean) => {return A === B}
			break;

		case "NOT":
			style = ({A_top: "75px",O_top: "75px",B_top: "null"} as buttonOffset),
			image = NOT_png,
			compare = (A: boolean, B: boolean) => {return !A}
			break;
		
		default:
			return <div>Incorrect Gate Type</div>
	}

	return <BaseGate id={id} I={I} pos={pos} comp={compare} label={type} image={image} onClick={(id) => onClick(id)} style={style} setPos={(pos, id) => {setPos(pos, id)}}/>
}