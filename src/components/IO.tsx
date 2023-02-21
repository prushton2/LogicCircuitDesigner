import { useState,useEffect } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { pos } from "../models/pos";

export const Switch = ({Y, id}: {Y: (id: string, o: boolean) => void, id: any}) => {

	const [value, setValue] = useState(false);

    const updateXarrow = useXarrow();

	useEffect(() => {
		Y(id, value);
	}, [value])


	return (

		<Draggable onDrag={updateXarrow} onStop={updateXarrow}>
			<div id={`${id}.Y`} style={{position: "absolute", width: "90px", height: "90px", border: "0px solid red"}}>
				<button onClick={() => {setValue(!value)}}>Toggle</button> <br /> ({id}) <br />{value ? "1":"0"}
			</div>
		</Draggable>

	)
}

export const LED = ({A, id, onClick}: {A: boolean, id: string, onClick: (id: string) => void}) => {
    const updateXarrow = useXarrow();
	
	return (
		<Draggable onDrag={updateXarrow} onStop={updateXarrow}>
			<div style={{width: "90px", height: "90px"}}>
				LED ({id})
				<div id={`${id}.A`} style={{left: "0%", top: "50%", position: "absolute", transform: "translate(0%, -50%)"}}>
					<button onClick={(e) => onClick(`${id}.A`)} style={{marginLeft: "1.3em"}}>A</button> {A?1:0} <br /> 
				</div>
			</div>
		</Draggable>
	)
}