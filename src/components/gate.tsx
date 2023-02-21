import React, { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { pos } from "../models/pos";

const Gate = ({A, B, Y, comp, label, id}: {A: boolean, B: boolean, Y: (id: string, Y: boolean) => void, comp: (A: boolean, B: boolean) => boolean, label: string, id: string}) => {
	
    const updateXarrow = useXarrow();

	useEffect(() => {
		Y(id, comp(A, B));
	}, [A, B])


	
	return (


		<Draggable onDrag={updateXarrow} onStop={updateXarrow}>

			<div style={{position: "absolute", border: "1px solid red", width: "90px", height: "90px"}}>
				
				{label} ({id}) <br />

				<div id={`${id}.A`} style={{left: "0%", position: "absolute"}}>
					A: {A ? "1":"0"}<br /> 
				</div>

				<div id={`${id}.Y`} style={{right: "0%", top: "50%", position: "absolute"}}>
					O: {comp(A, B) ? "1":"0"}
				</div>

				<div id={`${id}.B`} style={{left: "0%", bottom: "0%", position: "absolute"}}>
					B: {B ? "1":"0"} <br/> 
				</div>


			</div>
		</Draggable>

	)
}

export const AND = ({A, B, Y, id}: {A: boolean, B: boolean, Y: (id: string, Y: boolean) => void, id: string}) => {	
	return (
		<Gate id={id} A={A} B={B} Y={(id, v) => {Y(id, v)}} comp={(A, B) => { return A && B; }} label={"AND"}/>
	)
}

export const OR = ({A, B, Y, id}: {A: boolean, B: boolean, Y: (id: string, Y: boolean) => void, id: string}) => {
	return (
		<Gate id={id} A={A} B={B} Y={(id, v) => {Y(id, v)}} comp={(A, B) => { return A || B; }} label={"OR"}/>
	)
}

export const XOR = ({A, B, Y, id}: {A: boolean, B: boolean, Y: (id: string, Y: boolean) => void, id: string}) => {
	return (
		<Gate id={id} A={A} B={B} Y={(id, v) => {Y(id, v)}} comp={(A, B) => { return ((A?1:0) + (B?1:0)) %2 == 1 }} label={"XOR"}/>
	)
}