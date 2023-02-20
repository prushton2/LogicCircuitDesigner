import { useEffect, useState } from "react";

import { wire } from "../models/wire";
import { pos } from "../models/pos";

function Gate({A, B, Y, comp}: {A: wire, B: wire, Y: (Y: number) => void, comp: (A: number, B: number) => number}) {
	
	const [pos, setPos] = useState({x: 0, y: 0} as pos);

	useEffect(() => {
		Y(comp(A.value, B.value));
	}, [])
	
	return (
		<div style={{position: "absolute", top: `${pos.y}px`, left: `${pos.x}px`}}>
			AND GATE
		</div>
	)
}

export function AND({A, B, Y}: {A: wire, B: wire, Y: (Y: number) => void}) {
	return <Gate A={A} B={B} Y={(o) => {Y(o)}} comp={(A, B) => { return A && B; }} />
}