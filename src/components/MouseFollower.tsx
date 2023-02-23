import { useEffect, useState } from "react";

export default function Render({}: {})  {

	const [pos, setPos] = useState(JSON.parse("{x:0,y:0}"));

	const handleWindowMouseMove = (event: any )=> {
		setPos({
		  x: event.clientX,
		  y: event.clientY,
		});
	  };

	window.addEventListener('mousemove', handleWindowMouseMove);

	return (
		<div style={{position: 'absolute', top: `${pos.x}px`, left: `${pos.y}px`, border: "1px solid red"}}>
			
		</div>
	)
}