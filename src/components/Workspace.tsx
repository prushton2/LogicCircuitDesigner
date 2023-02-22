import { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time

import { AND, OR, XOR } from "./Gate"
import Wire from "./Wire"
import { Switch, LED } from "./IO";

import { component, input } from "../models/component";

function Workspace() {

	const [updated, setUpdated] = useState(false);
	const [components, setComponents] = useState<component[]>([
		{
			type: "SW",
			inputs: []
		} as component,
		{
			type: "SW",
			inputs: []
		} as component,
		{
			type: "AND",
			inputs: [
				{name: "0"} as input,
				{name: "1"} as input
			]
		} as component
	]);

	const [componentHTML, setComponentHTML] = useState<JSX.Element[]>([]);

	function out(id: string, y: boolean) {

	}

	useEffect(() => {
		console.log("Updated");
	}, [updated])

	useEffect(() => {
		let newhtml: JSX.Element[] = [];

		for(let i in components) {
			let c = components[i];
			switch(c.type) {
				case "SW":
					newhtml[i] = <Switch key={i} id={i} Y={(id,y) => {out(id,y)}}/>
					break;
				
				case "AND":
					newhtml[i] = <AND key={i} id={i} tr={updated} A={"0"} B={"1"} Y={(id,y) => {out(id,y)}} onClick={(e) => console.log(e)}/>
					break;
			}
		}
		setComponentHTML(newhtml)
	}, [components])

	return (
	<div>
		<Xwrapper>

			{componentHTML}

		</Xwrapper>
	</div> )
}


export default Workspace;

