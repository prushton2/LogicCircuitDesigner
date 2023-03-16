import "../../App.css"
import "./IO.css"

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
		newWires[`${id}.-Y`] = value ? "1":"0";
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

		<Component id={id} defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
			<div className="wrapperDiv">
				
				<input className="nametag" style={{display: display}} defaultValue={componentData[id as keyof {}]["name"]} onChange={(e) => {setName(e.target.value)}}></input>
								
				<div className="field" style={{display: display}}>
					<button className="SWbtn" style={{width: `${display==="none"?"100%":"5.4em"}`}} defaultValue={componentData[id as keyof {}]["value"]} onClick={() => {setValue(!value)}}>{value ? "1":"0"}</button> <br />
				</div>

				<div id={`${id}.-Y`} style={{right: `0px`, top: "45px", position: 'absolute', transform: "translate(0%, -50%)", border: "0px solid red"}}>
					<button onClick={(e) => onClick(`${id}.-Y`)} style={{display: display}}>Y</button>
					<label className="nametag" style={{display: display == "none" ? "inline" : "none", marginRight: ".5em"}}>{name}</label>
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
		newWires[`${id}.-Y`] = value;
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

		<Component id={id} defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
			<div className="wrapperDiv">
				
				
				<input className="nametag" style={{display: display}} defaultValue={componentData[id as keyof {}]["name"]} onChange={(e) => {setName(e.target.value)}}></input>
								
				<input className="SWinput" style={{display: display}} type="string" pattern="[0-1]*" defaultValue={componentData[id as keyof {}]["value"]} onChange={(e) => {setValue(e.target.value)}} /> <br />

				<div id={`${id}.-Y`} className="field" style={{right: `0px`, top: "45px", position: 'absolute', transform: "translate(0%, -50%)", border: "0px solid red"}}>
					<button onClick={(e) => onClick(`${id}.-Y`)} style={{display: display}}>Y</button>
					<label className="nametag" style={{display: display == "none" ? "inline" : "none", marginRight: ".5em"}}>{name}</label>
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
		<Component id={id} defaultPos={pos} newPos={(pos) => setPos(pos, id)} setDisplay={(v, d) => setDisplay(d)}>
			<div className="wrapperDiv large">
				
				
				<input className="nametag" style={{display: display}} defaultValue={componentData[id as keyof {}]["name"]} onChange={(e) => {setName(e.target.value)}}></input>
				
				<label className="LEDoutput" style={{display: display, left: `20px`}}>{value}</label> <br />

				<div id={`${id}.+A`} className="field" style={{left: "0px", top: "45px", position: 'absolute', transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.+A`)} style={{marginRight: "1.3em", display: display}}>A</button>
					<label className="nametag" style={{display: display == "none" ? "inline" : "none", marginLeft: ".5em"}}>{name}</label>
				</div>
			</div>
		</Component>
	)
}