import { useState } from 'react';
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
import { useMovies } from './components/useMovies';
import { useLocalStorage } from './components/useLocalStorage';

export default function App() {
	const [query, setQuery] = useState('');
	const { movies, isLoading, error } = useMovies(query);
	const [watched, setWatched] = useLocalStorage([], 'watched');

	const [selectedId, setSelectedId] = useState(null);

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
