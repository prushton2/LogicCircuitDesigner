import { useContext, useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { ConfigContext, WireContext } from "./Context";

const Render = ({start, end}: {start: string, end: string}) => {
	
	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);

	const [color, setColor] = useState("white");

	useEffect(() => {
		if(config["hideWireStates" as keyof object] || start === "mouse") {
			setColor("white");
		} else {
			setColor(wires[parseInt(start.split(".")[0])][0] ? "red" : "white")
		}
	}, [wires, config])

	return (
		<Xarrow path="grid" headSize={0} startAnchor={"right"} endAnchor={"left"} color={color} start={start.toString()} end={end.toString()} />
	)
}

export default Render;