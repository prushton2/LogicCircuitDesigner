import { useEffect, useState, useContext, useSyncExternalStore, useDebugValue } from "react";

import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";

import { ConfigContext } from "../Context";
import { pos } from "../../models/pos";



export const Component = ({children, defaultPos, newPos, setDisplay}: {children: JSX.Element, defaultPos: pos, newPos: (pos: pos) => void, setDisplay: (hideDetails: boolean, display: string) => void}) => {

	const {config, setConfig} = useContext(ConfigContext);

	const updateXarrow = useXarrow();

	const savePos = (e: any, element: any) => {
		newPos({x: element.x, y: element.y} as pos);
		updateXarrow();
	}

	useEffect(() => {
		setDisplay(config["hideDetails" as keyof object], !config["hideDetails" as keyof object] ? "inline": "none");
	}, [config])

	return (
		<div>
			<Draggable cancel=".field" grid={[5,5]} defaultPosition={{x: defaultPos.x, y: defaultPos.y}} onDrag={updateXarrow} onStop={savePos}>
				{children}
			</Draggable>
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
			<div key={i} className="field" id={`${componentID}.${letter}`} style={{left: "0%", top: `${heights[i]}px`, position: "absolute", transform: "translate(0%, -50%)"}}>
				{'\u00A0'}{labelInputs ? letter : ""}<button onClick={(e) => onClick(`${componentID}.${letter}`)} style={{marginLeft: ".3em", display: display}}>{letter}</button><br /> 
			</div>
		}
		setInputHTML(newHTML);
		updateXarrow();
	}, [inputCount, display])

	return (
		<>
			{inputHTML}
		</>
	)
}