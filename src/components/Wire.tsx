import { useContext, useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { WireContext } from "./WireContext";

const Render = ({start, end}: {start: string, end: string}) => {
	
	const {wires, setWires} = useContext(WireContext);

	return (
		<Xarrow path="grid" headSize={0} color={wires[parseInt(start.split(".")[0])] ? "red" : "white"} start={start.toString()} end={end.toString()} />
	)
}

export default Render;