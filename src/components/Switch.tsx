import { useState,useEffect } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

import { pos } from "../models/pos";

function Switch({Y, id}: {Y: (id: string, o: boolean) => void, id: any}) {

	const [value, setValue] = useState(false);

    const updateXarrow = useXarrow();

	useEffect(() => {
		Y(id, value);
	}, [value])


	return (

		<Draggable onDrag={updateXarrow} onStop={updateXarrow}>
			<div id={`${id}.Y`} style={{position: "absolute", width: "90px", height: "90px", border: "1px solid red"}}>
				<button onClick={() => {setValue(!value)}}>Toggle</button> <br /> {value ? "1":"0"}
			</div>
		</Draggable>

	)
}

export default Switch;