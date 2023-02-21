import React, { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { pos } from "../models/pos";

const Gate = ({A, B, Y, comp, label, id, onClick}: 
	{
		A: boolean, B: boolean, label: string, id: string, 

		Y: (id: string, Y: boolean) => void, 
		comp: (A: boolean, B: boolean) => boolean,
		onClick: (id: string) => void}) => {
	
    const updateXarrow = useXarrow();

	useEffect(() => {
		Y(id, comp(A, B));
	}, [A, B])

	return (


		<Draggable onDrag={updateXarrow} onStop={updateXarrow}>

			<div style={{position: "absolute", border: "0px solid red", width: "90px", height: "90px"}}>
				
				{label} ({id}) <br />

				<div id={`${id}.A`} style={{left: "0%", position: "absolute"}}>
					<button onClick={(e) => onClick(`${id}.A`)}>A</button>: {A ? "1":"0"}<br /> 
				</div>

				<div id={`${id}.Y`} style={{right: "0%", top: "50%", position: "absolute"}}>
					<button onClick={(e) => onClick(`${id}.Y`)}>O</button>: {comp(A, B) ? "1":"0"}
				</div>

				<div id={`${id}.B`} style={{left: "0%", bottom: "0%", position: "absolute"}}>
					<button onClick={(e) => onClick(`${id}.B`)}>B</button>: {B ? "1":"0"} <br/> 
				</div>


			</div>
		</Draggable>

	)
}

export const AND = ({A, B, Y, id, onClick}: {A: boolean, B: boolean, Y: (id: string, Y: boolean) => void, id: string, onClick: (id: string) => void}) => {	
	return (
		<Gate id={id} A={A} B={B} Y={(id, v) => {Y(id, v)}} comp={(A, B) => { return A && B; }} label={"AND"} onClick={(id) => onClick(id)}/>
	)
}

export const OR = ({A, B, Y, id, onClick}: {A: boolean, B: boolean, Y: (id: string, Y: boolean) => void, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={B} Y={(id, v) => {Y(id, v)}} comp={(A, B) => { return A || B; }} label={"OR"} onClick={(id) => onClick(id)}/>
	)
}

export const XOR = ({A, B, Y, id, onClick}: {A: boolean, B: boolean, Y: (id: string, Y: boolean) => void, id: string, onClick: (id: string) => void}) => {
	return (
		<Gate id={id} A={A} B={B} Y={(id, v) => {Y(id, v)}} comp={(A, B) => { return ((A?1:0) + (B?1:0)) %2 == 1 }} label={"XOR"} onClick={(id) => onClick(id)}/>
	)
}