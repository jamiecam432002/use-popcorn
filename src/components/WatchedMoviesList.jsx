import WatchedMovie from './WatchedMovie';

export default function WatchedMoviesList({ watched, onDeleteMovie }) {
	return (
		<ul className='list'>
			{watched.map((movie) => (
				<WatchedMovie
					key={movie.imdbId}
					movie={movie}
					onDeleteMovie={onDeleteMovie}
				/>
			))}
		</ul>
	);
}
