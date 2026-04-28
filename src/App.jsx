import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Logo from './components/Logo';
import NumResults from './components/NumResults';
import Search from './components/Search';
import MoviesList from './components/MoviesList';
import Box from './components/Box';
import WatchedSummary from './components/WatchedSummary';
import WatchedMoviesList from './components/WatchedMoviesList';

const KEY = 'f82d5389';

export default function App() {
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);

	useEffect(function () {
		const getMovies = async function () {
			const res = await fetch(
				`https://www.omdbapi.com/?apikey=${KEY}&s=castaway`,
			);
			const movies = await res.json();
			setMovies(movies.Search);
		};
		getMovies();
	}, []);

	return (
		<>
			<NavBar>
				<Logo />
				<Search />
				<NumResults movies={movies} />
			</NavBar>
			<main className='main'>
				<Box>
					<MoviesList movies={movies} />
				</Box>
				<Box>
					<WatchedSummary watched={watched} />
					<WatchedMoviesList watched={watched} />
				</Box>
			</main>
		</>
	);
}
