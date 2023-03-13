import "../../App.css"

import React, { useState, useEffect, useContext } from "react";

import { Component } from "./Component";
import { WireContext, ComponentDataContext } from "../Context";
import { input } from "../../models/component";
import { pos } from "../../models/pos";

export const SW = ({id, pos, onClick, setPos}: {id: any, pos: pos, onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) => {

	const [value, setValue] = useState(false);
	const {wires, setWires} = useContext(WireContext);
	const {componentData, setComponentData} = useContext(ComponentDataContext);
	
	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration
	const [name, setName] = useState(id);

	useEffect(() => {
		let newWires = structuredClone(wires);
		newWires[`${id}.Y`] = value ? "1":"0";
		setWires(newWires);
	}, [value])
	
	useEffect(() => {
		let newComponentData = structuredClone(componentData);

		newComponentData[id as keyof []].value = value;
		newComponentData[id as keyof []].name = name;
		
		if(JSON.stringify(componentData) !== JSON.stringify(newComponentData)) {
			setComponentData(newComponentData);
		}
	}, [name, value])

	useEffect(() => {
		try {
			setName(componentData[id as keyof {}]["name"]);
			setValue(componentData[id as keyof {}]["value"]);
		} catch {}
	}, [])

	return (

		<Component defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
			<div style={{position: "absolute", width: "50px", height: "70px", border: "0px solid red"}}>
				
				
				<input style={{ height: "20px", width: "20px", display: display}} onChange={(e) => {setName(e.target.value)}}></input>
				<label style={{display: display}}> ({id}) </label><br />
				
				<button className="invisButton" style={{width: "50px", height: "50px", position: 'absolute', top: "20px", left: "0px", border: "0px solid red"}} onClick={() => {setValue(!value)}}>{name}</button> <br />

				<div id={`${id}.Y`} style={{right: "0px", top: "45px", width: "30%", height: "30%", position: 'absolute', transform: "translate(0%, -50%)", border: "0px solid red"}}>
					<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: "1.3em", display: display}}>Y</button> <br /> 
				</div>
			</div>
		</Component>

	)
}

export const SWBUS = ({id, pos, onClick, setPos}: {id: any, pos: pos, onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) => {

	const [value, setValue] = useState<string>("0");
	const {componentData, setComponentData} = useContext(ComponentDataContext);
	const {wires, setWires} = useContext(WireContext);
	
	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration
	const [name, setName] = useState(id);

	useEffect(() => {
		let newWires = structuredClone(wires);
		newWires[`${id}.Y`] = value;
		setWires(newWires);
	}, [value])


	useEffect(() => {
		let newComponentData = structuredClone(componentData);

		newComponentData[id as keyof []].value = value;
		newComponentData[id as keyof []].name = name;
		
		if(JSON.stringify(componentData) !== JSON.stringify(newComponentData)) {
			setComponentData(newComponentData);
		}
	}, [name, value])

	useEffect(() => {
		try {
			setName(componentData[id as keyof {}]["name"]);
			setValue(componentData[id as keyof {}]["value"]);
		} catch {}
	}, [])

	return (

		<Component defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
			<div style={{position: "absolute", width: "90px", height: "70px", border: "0px solid red"}}>
				
				
				<input style={{ height: "20px", width: "20px", display: display}} onChange={(e) => {setName(e.target.value)}}></input>
				<label style={{display: display}}> ({id}) </label><br />
				
				<input type="string" pattern="[0-1]*" onChange={(e) => {setValue(e.target.value)}} style={{position: "absolute", left: "-3px", top: "35px", width: "4.3em"}}/> <br />

				<div id={`${id}.Y`} style={{right: "0px", top: "45px", width: "30%", height: "30%", position: 'absolute', transform: "translate(0%, -50%)", border: "0px solid red"}}>
					<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: "1.3em", display: display}}>Y</button> <br /> 
				</div>
			</div>
		</Component>

	)
}

export const LED = ({I, id, pos, onClick, setPos}: {I: input[], id: string, pos: pos ,onClick: (id: string) => void, setPos: (pos: pos, id: string) => void}) => {
    
	const {wires, setWires} = useContext(WireContext);
	const {componentData, setComponentData} = useContext(ComponentDataContext);

	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration
	const [name, setName] = useState(id);
	const [value, setValue] = useState("0");

	useEffect(() => {
		try {
			setValue(wires[I[0].id as keyof {}] as string) 
		} catch {
			setValue("Z");
		}
	}, [wires])

	useEffect(() => {
		let newComponentData = structuredClone(componentData);

		newComponentData[id as keyof []].name = name;
		
		if(JSON.stringify(componentData) !== JSON.stringify(newComponentData)) {
			setComponentData(newComponentData);
		}
	}, [name, value])

	useEffect(() => {
		try {
			setName(componentData[id as keyof {}]["name"]);
		} catch {}
	}, [])

	return (
		<Component defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
			<div style={{position: "absolute", width: "50px", height: "70px", border: "0px solid red"}}>
				
				
				<input style={{ height: "20px", width: "20px", display: display}} onChange={(e) => {setName(e.target.value)}}></input>
				<label style={{display: display}}> ({id}) </label><br />
				
				<label className="invisButton" style={{width: "50px", height: "50px", position: 'absolute', top: "20px", left: "0px", border: "0px solid red"}}>{name}<br />{value}</label> <br />

				<div id={`${id}.A`} style={{left: "0px", top: "30px", width: "30%", height: "30%", position: 'absolute', transform: "translate(0%, -50%)", border: "0px solid red"}}>
					<button onClick={(e) => onClick(`${id}.A`)} style={{marginRight: "1.3em", display: display}}>A</button> <br /> 
				</div>
			</div>
		</Component>
	)
}