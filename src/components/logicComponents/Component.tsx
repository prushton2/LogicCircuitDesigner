import "./Component.css";
import { useEffect, useState, useContext, useSyncExternalStore, useDebugValue } from "react";

import Draggable, {DraggableCore, DraggableData, DraggableEvent} from 'react-draggable'; 
import { useXarrow } from "react-xarrows";

import { ConfigContext, WireContent } from "../Context";
import { pos } from "../../models/pos";
import { input } from "../../models/component";


export const Component = ({children, id, defaultPos, newPos, setDisplay}: {children: JSX.Element, id: string, defaultPos: pos, newPos: (pos: pos) => void, setDisplay: (hideDetails: boolean, display: string) => void}) => {
	
	const {config, setConfig} = useContext(ConfigContext);
	const [selectStyling, setSelectStyling] = useState("");
	const [position, setPosition] = useState(defaultPos as pos);
	const [mousePos, setMousePos] = useState(defaultPos as pos);
	const [offset, setOffset] = useState({x:0,y:0} as pos);

	const updateXarrow = useXarrow();
	
	const calcOffset = (e: DraggableEvent, data: DraggableData) => {
		setOffset({
			x: mousePos.x - position.x,
			y: mousePos.y - position.y,
		} as pos);
	}

	const dragHandler = (e: DraggableEvent, data: DraggableData) => {
		setPosition({
			x: data.x - offset.x, 
			y: data.y - offset.y
		} as pos);
		updateXarrow();
	}

	function select(id: string) {
		let newConfig = structuredClone(config);
		newConfig["selectedComponent"] = newConfig["selectedComponent"] === id ? -1 : id;
		setConfig(newConfig);
	}

	const savePos = (e: any, data: any) => {
		setPosition({
			x: data.x - offset.x, 
			y: data.y - offset.y
		} as pos);
		newPos(position);
		updateXarrow();
	}

	useEffect(() => {
		setDisplay(
			config["hideDetails" as keyof object], !config["hideDetails" as keyof object] ? "inline": "none");
		setSelectStyling(
			config["selectedComponent" as keyof {}] === id ? "selected" : ""
		)
	}, [config])

	return (
		<div >
			<DraggableCore cancel=".field" grid={[5,5]} onStart={calcOffset} onDrag={dragHandler} onStop={savePos}>
				<div className={`componentChildren ${selectStyling}`} onMouseMove={(e) => setMousePos({x: e.clientX, y: e.clientY} as pos)} style={{position: "absolute", left: position.x, top: position.y}} onContextMenu={(e) => {e.preventDefault();select(id)}}>
					{children}
				</div>
			</DraggableCore>
		</div>
	)
}

export const Inputs = ({inputCount, heights, labelInputs, componentID, onClick}: {inputCount: number, heights: number[], labelInputs: boolean, componentID:string, onClick: (id: string) => void}) => {

	const {config, setConfig} = useContext(ConfigContext);
	const [display, setDisplay] = useState("inline");
	const [inputHTML, setInputHTML] = useState<JSX.Element[]>([])
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
	const updateXarrow = useXarrow();

	useEffect(() => {
		setDisplay(!config["hideDetails" as keyof object] ? "inline": "none");
	}, [config])
	
	useEffect(() => {
		let newHTML = []
		for(let i = 0; i<inputCount; i++) {
			let letter = alphabet[i];
			newHTML[i] = 
			<div key={i} className="field" id={`${componentID}.+${letter}`} style={{left: "0%", top: `${heights[i]}px`, position: "absolute", transform: "translate(0%, -50%)"}}>
				{'\u00A0'}{labelInputs ? letter : ""}<button onClick={(e) => onClick(`${componentID}.+${letter}`)} style={{marginLeft: ".3em", display: display}}>{letter}</button><br /> 
			</div>
		}
		setInputHTML(newHTML);
		updateXarrow();
	}, [inputCount, display, heights])

	return (
		<>
			{inputHTML}
		</>
	)
}

export const Outputs = ({outputCount, heights, labelOutputs, componentID, onClick}: {outputCount: number, heights: number[], labelOutputs: boolean, componentID:string, onClick: (id: string) => void}) => {

	const {config, setConfig} = useContext(ConfigContext);
	const [display, setDisplay] = useState("inline");
	const [outputHTML, setOutputHTML] = useState<JSX.Element[]>([])
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
	const updateXarrow = useXarrow();

	useEffect(() => {
		setDisplay(!config["hideDetails" as keyof object] ? "inline": "none");
	}, [config])
	
	useEffect(() => {
		let newHTML = []
		for(let i = 0; i<outputCount; i++) {
			let letter = alphabet[i];
			newHTML[i] = 
			<div key={i} className="field" id={`${componentID}.-${letter}`} style={{right: "0%", top: `${heights[i]}px`, position: "absolute", transform: "translate(0%, -50%)"}}>
				{labelOutputs ? letter : ""}<button onClick={(e) => onClick(`${componentID}.-${letter}`)} style={{marginLeft: ".3em", display: display}}>{letter}</button>{'\u00A0'}<br /> 
			</div>
		}
		setOutputHTML(newHTML);
		updateXarrow();
	}, [outputCount, display, heights])

	return (
		<>
			{outputHTML}
		</>
	)
}

export function inputsHaveChanged(I: input[], wires: WireContent) {

}