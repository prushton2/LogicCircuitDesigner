import { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";

const Render = ({start, end}: {state: boolean, start: string, end: string}) => {
	
	const [value, setValue] = useState(false);

	return (
		<Xarrow path="grid" headSize={0} color={value ? "red" : "white"} start={start} end={end} />
	)
}

export default Render;