import { useEffect, useState } from "react";

import { wire } from "../models/wire";

function Render({A, B, Y}: {A: wire, B: wire, Y: (Y: number) => void}) {
	
	useEffect(() => {
		Y(A.value || B.value);
	}, [])
	
	return (
		<a>
			OR GATE
		</a>
	)
}

export default Render;