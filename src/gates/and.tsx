import { useEffect, useState } from "react";

import { wire } from "../models/wire";
import { pos } from "../models/pos";

function AND({A, B, Y}: {A: wire, B: wire, Y: (Y: number) => void}) {
	
	const [pos, setPos] = useState({x: 0, y: 0} as pos);

	useEffect(() => {
		Y(A.value && B.value);
	}, [])
	
	return (
		<div style={{position: "absolute", top: `${pos.y}px`, left: `${pos.x}px`}}>
			AND GATE
		</div>
	)
}

export default AND;