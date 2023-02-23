import { useEffect, useState } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";


export default function Render() {

	const [pos, setPos] = useState({"x": 0, "y": 0});
	const updateXarrow = useXarrow();

	useEffect(() => {
		const updateMousePosition = (ev: any) => {
		  setPos({ "x": ev.clientX, "y": ev.clientY });
		};

		updateXarrow();

		window.addEventListener('mousemove', updateMousePosition);
		return () => {
		  window.removeEventListener('mousemove', updateMousePosition);
		};

	  }, []);

	return (
		<div id="mouse" style={{width: "1px", height: "1px", position: "absolute", top: `${pos.y+2}px`, left: `${pos.x+2}px`, border: "0px solid red"}}>
		</div>
	)
}