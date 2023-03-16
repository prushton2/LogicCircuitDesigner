import "./Component.css";
import { useEffect, useState, useContext, useRef } from "react";


import { useDrag } from "react-dnd";
import { useXarrow } from "react-xarrows";

import { ConfigContext } from "../Context";
import { pos } from "../../models/pos";

export const Draggable = ({children, grid, defaultPosition, onDrag, onStop}: {children: JSX.Element, grid: number[], defaultPosition: pos, onDrag: (position: pos) => void, onStop: (position: pos) => void}) => {
	
	const [position, setPosition] = useState<pos>(defaultPosition);
	const [newPosition, setNewPosition] = useState<pos>({x:0,y:500} as pos);
	const [isDragging, setIsDragging] = useState(false);
	
	const dragRef = useRef<any>(null);

	useEffect(() => {
		const handleWindowMouseMove = (e: any) => {	
			setNewPosition({ 
				x: e.pageX - dragRef.current?.getBoundingClientRect().width/2, 
				y: e.pageY - dragRef.current?.getBoundingClientRect().height/2
			});
		};
		window.addEventListener('mousemove', handleWindowMouseMove);
	
		return () => {
			window.removeEventListener(
				'mousemove', handleWindowMouseMove,
			);
		};
	  }, []);

	  useEffect(() => {
		if(isDragging) {
			setPosition({
				x: newPosition.x - (newPosition.x % grid[0]),
				y: newPosition.y - (newPosition.y % grid[1])
			} as pos);
		}
	  }, [newPosition])

	return (
		<div ref={dragRef} style={{width: "fit-content", height: "fit-content", position: "absolute", left: position.x, top: position.y}} 
				onDragStart={(e) => {setIsDragging(true); onDrag(position)}} 
				onPointerUpCapture={(e) => {setIsDragging(false); onStop(position)}}>
			{children}
		</div>
	)
}

export const Component = ({children, id, defaultPos, newPos, setDisplay}: {children: JSX.Element, id: string, defaultPos: pos, newPos: (pos: pos) => void, setDisplay: (hideDetails: boolean, display: string) => void}) => {
	
	const {config, setConfig} = useContext(ConfigContext);
	const [selectStyling, setSelectStyling] = useState("");
	
	const updateXarrow = useXarrow();
	
	function select(id: string) {
		let newConfig = structuredClone(config);
		newConfig["selectedComponent"] = newConfig["selectedComponent"] === id ? -1 : id;
		setConfig(newConfig);
	}

	const savePos = (e: any) => {
		newPos({x: e.x, y: e.y} as pos);
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
		<div>
			<Draggable grid={[5,5]} defaultPosition={defaultPos} onDrag={(e) => {}} onStop={savePos}>
				<div className={`componentChildren ${selectStyling}`} onClick={(e) => select(id)}>
					{children}
				</div>
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