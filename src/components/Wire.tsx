import { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

const Render = ({start, end, wires}: {start: string, end: string, wires: Object}) => {

	const [color, setColor] = useState("black");
		
	useEffect(() => {
		setColor(
			wires[start.split(".")[0] as keyof Object] ? "red" : "black"
		)
	}, [wires])

	return (
		<Xarrow path="smooth" headSize={0} color={color} curveness={0} start={start} end={end} />
	)
}

export default Render;