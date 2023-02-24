import React, { useContext, useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { ConfigContext, WireContext } from "./Context";

import AND_png from "../images/AND.png"
import OR_png  from "../images/OR.png"
import XOR_png from "../images/XOR.png"
import NOT_png from "../images/NOT.png"
import NAND_png from "../images/NAND.png"
import NOR_png  from "../images/NOR.png"
import XNOR_png from "../images/XNOR.png"

interface buttonOffset {
	A_top: string,
	O_top: string,
	B_top: string,
}

const Gate = ({A, B, comp, label, image, style, id, onClick}: {
	A: number, B: number, label: string, image: string, style: buttonOffset, id: string,

	comp: (A: boolean, B: boolean) => boolean,
	onClick: (id: string) => void}) => {
	
	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);
		
	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration

	const updateXarrow = useXarrow();



	useEffect(() => {
		let newValue = comp(wires[A], wires[B]);

		if(wires[id as keyof []] === newValue) {
			return;
		}

		let newWires = structuredClone(wires);
		newWires[id] = newValue;
		setWires(newWires);
	}, [wires])

	useEffect(() => {
		setDisplay(!config["hideDetails" as keyof object] ? "inline": "none");
	}, [config])

	return (


		<Draggable grid={[5, 5]} onDrag={updateXarrow} onStop={updateXarrow}>

			<div style={{position: "absolute", border: "0px solid red", width: "90px", height: "90px"}}>
				
				{display==="inline"?`${label} (${id})`:""} <br />

				<img src={image} style={{width: "90px", position: "absolute", transform: "translate(-50%, 10%)"}}/>

				<div id={`${id}.A`} style={{left: "0%", top: style.A_top, position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.A`)} style={{marginLeft: "1.3em", display: display}}>A</button><br /> 
				</div>

				<div id={`${id}.Y`} style={{right: "0%", top: style.O_top, position: "absolute", transform: "translate(0%, -50%)"}}>
					<label style={{display: display}}>{comp(wires[A], wires[B])?1:0}</label><button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: "1.3em", display: display}}>Y</button>
				</div>

				<div id={`${id}.B`} style={{left: "0%", top: style.B_top, display: style.B_top==="null"?"none":"inline", position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.B`)} style={{marginLeft: "1.3em", display: display}}>B</button> <br/> 
				</div>


			</div>
		</Draggable>

	)
}

export const AND = ({A, B, id, onClick}: {A: number, B: number, id: string, onClick: (id: string) => void}) => {	
	return (
		<Gate id={id} A={A} B={B} comp={(A, B) => { return A && B; }} label={"AND"} image={AND_png} onClick={(id) => onClick(id)}
		style={{
			A_top: "45px",
			O_top: "65px",
			B_top: "80px"
		} as buttonOffset}/>
	)
}

export const OR = ({A, B, id, onClick}: {A: number, B: number, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={B} comp={(A, B) => { return A || B; }} label={"OR"} image={OR_png} onClick={(id) => onClick(id)}
		style={{
			A_top: "40px",
			O_top: "60px",
			B_top: "80px",
		} as buttonOffset}/>
	)
}

export const XOR = ({A, B, id, onClick}: {A: number, B: number, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={B} comp={(A, B) => { return ( A !== B ) }} label={"XOR"} image={XOR_png} onClick={(id) => onClick(id)}
		style={{
			A_top: "40px",
			O_top: "55px",
			B_top: "75px",
		} as buttonOffset}/>
	)
}

export const NOT = ({A, id, onClick}: {A: number, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={-1} comp={(A, B) => { return !A }} label={"NOT"} image={NOT_png} onClick={(id) => onClick(id)}
		style={{
			A_top: "75px",
			O_top: "75px",
			B_top: "null",
		} as buttonOffset}/>
	)
}

export const NAND = ({A, B, id, onClick}: {A: number, B: number, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={B} comp={(A, B) => { return ( !(A&&B) ) }} label={"NAND"} image={NAND_png} onClick={(id) => onClick(id)}
		style={{
			A_top: "45px",
			O_top: "65px",
			B_top: "80px"
		} as buttonOffset}/>
	)
}

export const NOR = ({A, B, id, onClick}: {A: number, B: number, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={B} comp={(A, B) => { return ( !(A||B)) }} label={"NOR"} image={NOR_png} onClick={(id) => onClick(id)}
		style={{
			A_top: "40px",
			O_top: "60px",
			B_top: "80px",
		} as buttonOffset}/>
	)
}

export const XNOR = ({A, B, id, onClick}: {A: number, B: number, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={B} comp={(A, B) => { return (A === B) }} label={"XNOR"} image={XNOR_png} onClick={(id) => onClick(id)}
		style={{
			A_top: "40px",
			O_top: "55px",
			B_top: "75px",
		} as buttonOffset}/>
	)
}