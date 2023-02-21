import { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

const Render = ({start, end, wires}: {start: string, end: string, wires: Object}) => {
	
	return (
		<Xarrow path="grid" headSize={0} color={wires[start.split(".")[0] as keyof Object] ? "red" : "white"} start={start} end={end} />
	)
}

export default Render;