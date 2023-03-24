import "./Gate.css"
import React, { useContext, useEffect, useState } from "react";

import { Component, Inputs } from "./Component"
import { connection } from "../../models/component";
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
	A_top: number,
	O_top: number,
	B_top: number,
}

const BaseGate = ({I, pos, comp, label, image, style, id, onClick, setPos}: { //the skeleton for a logic gate. Everything minus the image and logic.
	I: connection[], pos: pos, label: string, image: string, style: buttonOffset, id: string,

	comp: (A: boolean, B: boolean) => boolean,
	onClick: (id: string) => void,
	setPos: (pos: pos, id: string) => void}) => {
	
	const {wires, setWires} = useContext(WireContext);
		
	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration

	useEffect(() => {
		let newValue: string | undefined;
		try {

			if(I.length === 1) {
				newValue = (wires[I[0].id as keyof {}] as string).split("").map((v, i) => {
					return comp(wires[I[0].id as keyof {}][i]==="1" ? true : false, false) ? "1":"0"
				}).join("")
			}

			newValue = (wires[I[0].id as keyof {}] as string).split("").map((v, i) => {
				return comp(wires[I[0].id as keyof {}][i]==="1" ? true : false, wires[I[1].id as keyof {}][i]==="1" ? true : false) ? "1":"0"
			}).join("")
		} catch {}
		
		if(wires[id as keyof {}] == newValue) {
			return;
		}

		let newWires = structuredClone(wires);
		newWires[`${id}.-Y`] = newValue;
		if(JSON.stringify(wires) !== JSON.stringify(newWires)) {
			setWires(newWires);
		}
	}, [wires])


	return (
		<div>
			<Component id={id} defaultPos={pos} newPos={(pos) => {setPos(pos, id)}} setDisplay={(v, d) => {setDisplay(d)}}> 
				<div className="wrapperDiv">

					<img src={image} className="gateImage" onDragStart={(e) => {e.preventDefault()}}/>

					<Inputs labelInputs={false} inputCount={style.B_top == -1 ? 1 : 2} heights={[style.A_top, style.B_top]} componentID={id} onClick={(id) => onClick(id)} />

					<div id={`${id}.-Y`} className="field" style={{right: "0%", top: style.O_top, position: "absolute", transform: "translate(0%, -50%)"}}>
						<label style={{display: display}}></label><button onClick={(e) => onClick(`${id}.-Y`)} style={{marginRight: "1.3em", display: display}}>Y</button>
					</div>
				</div>
			</Component>
		</div>



	)
}

export const Gate = ({I, id, pos, type, onClick, setPos}: {I: connection[], pos: pos, id: string, type: string, onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) => {
	let style = {} as buttonOffset;
	let image = OR_png;
	let compare = (A: boolean, B: boolean) => {return A && B}

	
	switch(type) {
		case "AND":
			style = {A_top: 25,O_top: 45,B_top: 60} as buttonOffset,
			image = AND_png,
			compare = (A: boolean, B: boolean) => {return A && B}
			break;
		case "OR":
			style = {A_top: 20,O_top: 40,B_top: 60} as buttonOffset,
			image = OR_png,
			compare = (A: boolean, B: boolean) => {return A || B}
			break;
		case "XOR":
			style = {A_top: 20, O_top: 35, B_top: 55} as buttonOffset,
			image = XOR_png,
			compare = (A: boolean, B: boolean) => {return A !== B}
			break;

		case "NAND":
			style = {A_top: 25, O_top: 40, B_top: 55} as buttonOffset,
			image = NAND_png,
			compare = (A: boolean, B: boolean) => {return !(A && B)}
			break;
		case "NOR":
			style = {A_top: 20,O_top: 35,B_top: 50} as buttonOffset,
			image = NOR_png,
			compare = (A: boolean, B: boolean) => {return !(A || B)}
			break;
		case "XNOR":
			style = {A_top: 20,O_top: 35,B_top: 45} as buttonOffset,
			image = XNOR_png,
			compare = (A: boolean, B: boolean) => {return A === B}
			break;

		case "NOT":
			style = ({A_top: 55, O_top: 55, B_top: -1} as buttonOffset),
			image = NOT_png,
			compare = (A: boolean, B: boolean) => {return !A}
			break;
		
		default:
			return <div>Incorrect Gate Type</div>
	}

	return <BaseGate id={id} I={I} pos={pos} comp={compare} label={type} image={image} onClick={(id) => onClick(id)} style={style} setPos={(pos, id) => {setPos(pos, id)}}/>
}