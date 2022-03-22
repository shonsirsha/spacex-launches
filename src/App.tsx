import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import AllLaunches from "./AllLaunches";
function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/past-launches" element={<AllLaunches />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
