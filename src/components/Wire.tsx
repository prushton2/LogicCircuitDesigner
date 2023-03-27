import React, { useContext, useEffect, useState, useRef, useImperativeHandle } from "react";
import Xarrow, { anchorType, useXarrow, Xwrapper } from "react-xarrows";

const Wire = React.forwardRef(({start, end}: {start: string, end: string}, ref: any) => {
	
	const [sides, setSides] = useState<string[]>(["right", "left"]);
	const [color, setColor] = useState("white");

	useEffect(() => {
		if("+S".indexOf(end.split(".")[1]) !== -1) {
			setSides([sides[0],"top"])
		}

		if("+R".indexOf(end.split(".")[1]) !== -1) {
			setSides([sides[0],"bottom"])
		}


		if("-S".indexOf(start.split(".")[1]) !== -1) {
			setSides(["top",sides[1]])
		}

		if("-R".indexOf(start.split(".")[1]) !== -1) {
			setSides(["bottom",sides[1]])
		}
	}, [])

	return (
		<Xarrow path="grid" headSize={0} startAnchor={sides[0] as anchorType} endAnchor={sides[1] as anchorType} color={color} start={start.toString()} end={end.toString()} />
	)
})

export default Wire;