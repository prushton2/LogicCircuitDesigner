import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import Workspace from "./components/Workspace"

function App() {

	useEffect(() => {
		document.title="Logic Circuit Designer"
	}, [])

	return (
		<div className="App">
			<Workspace />
		</div>
	);
}

export default App;
