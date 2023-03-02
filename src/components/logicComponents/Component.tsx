import { useEffect, useState, useContext } from "react";

import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";

import { ConfigContext } from "../Context";
import { pos } from "../../models/pos";



const Component = ({children, defaultPos, newPos, setDisplay}: {children: JSX.Element, defaultPos: pos, newPos: (pos: pos) => void, setDisplay: (hideDetails: boolean, display: string) => void}) => {

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
			<Draggable grid={[5,5]} defaultPosition={{x: defaultPos.x, y: defaultPos.y}} onDrag={updateXarrow} onStop={savePos}>
				{children}
			</Draggable>
		</div>
	)
}

export default Component;