import "./Memory.css"
import { useContext, useEffect, useState } from "react";

import { Component, Inputs } from "./Component";
import { ComponentDataContext, WireContext } from "../Context";
import { pos } from "../../models/pos";
import { input } from "../../models/component";

export const FSM = ({id, pos, I, setPos, onClick}: {id: string, pos: pos, I: input[], setPos: (pos: pos, id: string) => void, onClick: (id: string) => void}) => {

	const [display, setDisplay] = useState("inline");
	const [inputs, setInputs] = useState(2);


	return (
		<Component defaultPos={pos} newPos={(pos: pos) => setPos(pos, id)} setDisplay={(h,d) => setDisplay(d)}>
			<div style={{userSelect: "none", width: "90px", height: "200px", border: "5px solid white"}}>

				<Inputs inputCount={inputs} heights={[50, 80, 110, 50, 60, 70, 80, 90]} labelInputs componentID={id} onClick={(id) => onClick(id)}/>		
				
				
				<div id={`${id}.S`} className="clk">
					clk <button className="field" onClick={(e) => onClick(`${id}.S`)} style={{marginRight: ".3em", display: display}}>c</button>
				</div>

				<div id={`${id}.R`} className="rst">
					rst <button className="field" onClick={(e) => onClick(`${id}.R`)} style={{marginRight: ".3em", display: display}}>r</button>
				</div>

			</div>
		</Component>
	)
}