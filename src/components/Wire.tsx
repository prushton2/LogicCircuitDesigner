import { useContext, useEffect, useState } from "react";
import Xarrow, { anchorType, useXarrow, Xwrapper } from "react-xarrows";
import { ConfigContext, WireContext } from "./Context";

const Wire = ({start, end}: {start: string, end: string}) => {
	
	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);
	const [sides, setSides] = useState<string[]>(["right", "left"]);

	const [color, setColor] = useState("white");

	useEffect(() => {
		if(config["hideWireStates" as keyof object] || start === "mouse") {
			setColor("white");
		} else {
			try {
				let binary: string = wires[start as keyof {}]
				
				setColor(binary.charAt(0) === "1" ? "red" : "white")
			} catch {
				setColor("white");
			}
		}

		if("+S".indexOf(end.split(".")[1]) !== -1) {
			setSides([
				sides[0],
				"top"
			])
		}

		if("+R".indexOf(end.split(".")[1]) !== -1) {
			setSides([
				sides[0],
				"bottom"
			])
		}


		if("-S".indexOf(start.split(".")[1]) !== -1) {
			setSides([
				"top",
				sides[1]
			])
		}

		if("-R".indexOf(start.split(".")[1]) !== -1) {
			setSides([
				"bottom",
				sides[1]
			])
		}



	}, [wires, config])

	return (
		<Xarrow path="grid" headSize={0} startAnchor={sides[0] as anchorType} endAnchor={sides[1] as anchorType} color={color} start={start.toString()} end={end.toString()} />
	)
}

export default Wire;