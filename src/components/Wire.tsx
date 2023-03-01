import { useContext, useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { ConfigContext, WireContext } from "./Context";

const Wire = ({start, end}: {start: string, end: string}) => {
	
	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);

	const [color, setColor] = useState("white");

	useEffect(() => {
		if(config["hideWireStates" as keyof object] || start === "mouse") {
			setColor("white");
		} else {
			try {
				let index: number = parseInt(start.split(".")[0])
				let binary: string = JSON.stringify(wires[index]).replaceAll("[", "").replaceAll("]", "").replaceAll("null", "").replaceAll(",", "").replaceAll("false", "0").replaceAll("true", "1");
				let decimal: number = parseInt(binary, 2);
				
				setColor(decimal >= ((2**binary.length)/2) ? "red" : "white")
			} catch {
				setColor("white");
			}
		}
	}, [wires, config])

	return (
		<Xarrow path="grid" headSize={0} startAnchor={"right"} endAnchor={"left"} color={color} start={start.toString()} end={end.toString()} />
	)
}

export default Wire;