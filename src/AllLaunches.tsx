import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Launch } from "../types/index";

function AllLaunches() {
	const [launches, setLaunches] = useState({
		allLaunches: [] as Launch[],
		filteredLaunches: [] as Launch[],
		renderedLaunches: [] as Launch[],
	});
	const [oldestToNewest, setOldestToNewest] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);
	const { allLaunches, filteredLaunches, renderedLaunches } = launches;

	useEffect(() => {
		async function fetchAllLaunches() {
			const res = await fetch("https://api.spacexdata.com/v4/launches/past");
			const allLaunches = await res.json();
			setLaunches({ ...launches, allLaunches, renderedLaunches: allLaunches });
			setLoading(false);
		}

		fetchAllLaunches();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const filteredLaunches = allLaunches.filter(
			(launch) =>
				launch.flight_number.toString().includes(searchTerm.trim()) ||
				launch.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
		);
		setLaunches({
			...launches,
			filteredLaunches,
			renderedLaunches:
				filteredLaunches.length > 0 ? filteredLaunches : allLaunches,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm]);

	useEffect(() => {
		if (searchTerm.trim().length > 0 && filteredLaunches.length < 1)
			setNotFound(true);
		else setNotFound(false);
	}, [filteredLaunches, searchTerm]);

	useEffect(() => {
		setLaunches({
			...launches,
			renderedLaunches: [...renderedLaunches].reverse(),
		}); // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [oldestToNewest]);

	// const renderedLaunches =
	// 	filteredLaunches.length > 0 ? filteredLaunches : allLaunches;
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleClick = () => {
		setOldestToNewest(!oldestToNewest);
	};

	return (
		<div className="App">
			<Link to={"/"}> {"<"} Go back home </Link>

			<h2 className="mt-1">Past Launches</h2>
			<div className="d-flex flex-column">
				<label htmlFor="searchBox">Search by Flight Number or Name</label>
				<input
					autoComplete={"false"}
					className="mt-1"
					placeholder="Falcon"
					id="searchBox"
					onChange={handleChange}
					value={searchTerm}
				/>
			</div>
			<p className="mt-1" id="num-of-launches-display-paragraph">
				Displaying {renderedLaunches.length} launches | Displaying{" "}
				{oldestToNewest ? "Oldest to Newest" : "Newest to Oldest"}
			</p>

			<button onClick={handleClick}>Toggle Sort</button>

			{notFound ? (
				<div className="flight-card-container">
					No launch with Flight Nr / Name {searchTerm} can be found
				</div>
			) : (
				<div className="flight-card-container">
					{loading
						? "Loading..."
						: renderedLaunches.map((launch) => (
								<div className="card">
									<h2>{launch.name}</h2>
									<p>
										<kbd>Flight Num: {launch.flight_number}</kbd>
									</p>

									<kbd>{launch.date_local}</kbd>
									<div
										className={`status ${
											launch.success ? `success` : `failed`
										} mt-1`}
									>
										{launch.success ? "SUCCESSFUL" : "FAILED"}
									</div>
								</div>
						  ))}
				</div>
			)}
		</div>
	);
}

export default AllLaunches;
