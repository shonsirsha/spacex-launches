import { useEffect, useState } from "react";
import { Launch } from "../types/index";
import { Link } from "react-router-dom";

function Home() {
	const [launches, setLaunches] = useState<Launch[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function fetchMyAPI() {
			const res = await fetch(
				"https://api.spacexdata.com/v4/launches/upcoming"
			);
			const allLaunches = await res.json();
			setLaunches(allLaunches);
			setLoading(false);
		}

		fetchMyAPI();
	}, []);

	return (
		<div className="App">
			<h1>SpaceX Launches</h1>
			<hr />
			<h2>Upcoming Launches</h2>
			<div className="flight-card-container">
				{loading
					? "Loading..."
					: [...launches]
							.splice(0, 10)
							.reverse()
							.map((launch) => (
								<div className="card">
									<h2>{launch.name}</h2>
									<p>
										<kbd>Flight Num: {launch.flight_number}</kbd>
									</p>

									<kbd>{launch.date_local}</kbd>
								</div>
							))}
			</div>
			<Link to={"/past-launches"}>See all past launches</Link>
			<br />
			<br />
			<a href="https://spacex.org">Go to SpaceX Website</a>
		</div>
	);
}

export default Home;
