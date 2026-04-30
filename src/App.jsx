import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import Logo from './components/Logo';
import NumResults from './components/NumResults';
import Search from './components/Search';
import MoviesList from './components/MoviesList';
import Box from './components/Box';
import WatchedSummary from './components/WatchedSummary';
import WatchedMoviesList from './components/WatchedMoviesList';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import MovieDetail from './components/MovieDetail';

export const KEY = 'f82d5389';

export default function App() {
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [query, setQuery] = useState('');
	const [error, setError] = useState('');

	function handleSelectedMovie(id) {
		setSelectedId(id === selectedId ? null : id);
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie) {
		setWatched((s) => [...s, movie]);
	}
	function handleDeleteMovie(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
	}

	useEffect(
		function () {
			const controller = new AbortController();
			const getMovies = async function () {
				try {
					setError('');
					setIsLoading('');
					const res = await fetch(
						`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
						{ signal: controller.signal },
					);

					if (!res.ok)
						throw new Error('Something went wrong with the fetching of movies');

					const data = await res.json();

					if (data.Response === 'False')
						throw new Error(
							'We could not find any movies that matched your search',
						);
					setMovies(data.Search);
					setError('');
				} catch (err) {
					if (err.name !== 'AbortError') {
						setError(err.message);
					}
				} finally {
					setIsLoading(false);
				}
			};

			if (query.length < 3) {
				setMovies([]);
				setError('');
				return;
			}

			handleCloseMovie();
			getMovies();

			return function () {
				controller.abort();
			};
		},
		[query],
	);

	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>
			<main className='main'>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MoviesList movies={movies} onSelectedMovie={handleSelectedMovie} />
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetail
							id={selectedId}
							watched={watched}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteMovie={handleDeleteMovie}
							/>
						</>
					)}
				</Box>
			</main>
		</>
	);
}
