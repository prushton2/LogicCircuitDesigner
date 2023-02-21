import React, { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { wire } from "../models/wire";
import { pos } from "../models/pos";

const Gate = ({A, B, Y, comp, label, id}: {A: wire, B: wire, Y: (Y: boolean) => void, comp: (A: boolean, B: boolean) => boolean, label: string, id: any}) => {
	
    const updateXarrow = useXarrow();

	useEffect(() => {
		Y(comp(A.value, B.value));
	}, [A, B])


	
	return (
		<div style={{position: "absolute", border: "1px solid red", width: "90px", height: "90px"}}>
			
			{label} GATE <br />

			<div id={`${id}.A`} style={{left: "0%", position: "absolute"}}>
				A: {A.value ? "1":"0"}<br /> 
			</div>

			<div id={`${id}.Y`} style={{right: "0%", top: "50%", position: "absolute"}}>
				O: {comp(A.value, B.value) ? "1":"0"}
			</div>

			<div id={`${id}.B`} style={{left: "0%", bottom: "0%", position: "absolute"}}>
				B: {B.value ? "1":"0"} <br/> 
			</div>


		</div>
	)
}

export const AND = ({A, B, Y, id}: {A: wire, B: wire, Y: (Y: boolean) => void, id: any}) => {
	
    const updateXarrow = useXarrow();
	
	return (
		<Draggable onDrag={updateXarrow} onStop={updateXarrow}>
			<div>
				<Gate id={id} A={A} B={B} Y={(o) => {Y(o)}} comp={(A, B) => { return A && B; }} label={"AND"}/>
			</div>
		</Draggable>
	)
}

export const OR = ({A, B, Y, id}: {A: wire, B: wire, Y: (Y: boolean) => void, id: any}) => {
	
	const updateXarrow = useXarrow();
	
	return (
		<Draggable onDrag={updateXarrow} onStop={updateXarrow}>
			<div>
				<Gate id={id} A={A} B={B} Y={(o) => {Y(o)}} comp={(A, B) => { return A || B; }} label={"OR"}/>
			</div>
		</Draggable>
	)
}

export const XOR = ({A, B, Y, id}: {A: wire, B: wire, Y: (Y: boolean) => void, id: any}) => {
	
	const updateXarrow = useXarrow();
	
	return (
		<Draggable onDrag={updateXarrow} onStop={updateXarrow}>
			<div>
				<Gate id={id} A={A} B={B} Y={(o) => {Y(o)}} comp={(A, B) => { return ((A ? 1 : 0) + (B ? 1 : 0)) % 2 !== 0; }} label={"XOR"}/>
			</div>
		</Draggable>
	)
}