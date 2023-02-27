import { useContext, useEffect, useState } from "react";
import { WireContext, ConfigContext } from "./Context";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";

export function Bus({id,A,B,C,D,E,F,G,H,onClick}: {id: string, A: number, B: number, C: number, D: number, E: number, F: number, G: number, H: number, onClick: (id: string) => void}) {

	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);

	const updateXarrow = useXarrow();



	return (
		<div>
			<Draggable grid={[5,5]} onDrag={updateXarrow} onStop={updateXarrow}>

			</Draggable>
		</div>
	);
}

