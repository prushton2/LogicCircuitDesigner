import { useEffect, useState } from "react";

import { wire } from "../models/wire";

function Render({A, B, Y}: {A: wire, B: wire, Y: (Y: number) => void}) {
	
	useEffect(() => {
		Y(A.value + B.value % 2);
	}, [])
	
	return (
		<a>
			XOR GATE
		</a>
	)
}

export default Render;