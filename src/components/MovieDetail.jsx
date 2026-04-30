import { useEffect, useState } from 'react';
import { KEY } from '../App';
import StarRating from './StarRating';
import Loader from './Loader';

export default function MovieDetail({
	id,
	watched,
	onCloseMovie,
	onAddWatched,
}) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');
	const isWatched = watched.map((movie) => movie.imdbId).includes(id);
	const yourRating = watched.find((movie) => movie.imdbId === id)?.userRating;

	const {
		Title: title,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	function handleAdd() {
		const newMovie = {
			imdbId: id,
			title,
			released,
			poster,
			runtime: Number(runtime.split(' ')[0]),
			imdbRating: Number(imdbRating),
			userRating,
		};
		onAddWatched(newMovie);
		onCloseMovie();
	}

	useEffect(
		function () {
			if (!title) return;
			document.title = `Movie | ${title}`;

			return () => (document.title = 'usePopcorn');
		},
		[title],
	);

	useEffect(
		function () {
			async function getMovieDetails() {
				setIsLoading(true);
				try {
					const res = await fetch(
						`https://www.omdbapi.com/?apikey=${KEY}&i=${id}`,
					);
					const data = await res.json();
					setMovie(data);
				} catch (err) {
					console.log(err.message);
				} finally {
					setIsLoading(false);
				}
			}
			getMovieDetails();
		},
		[id],
	);

	return (
		<div className='details'>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className='btn-back' onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${title}`} />
						<div className='details-overview'>
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐️</span> {imdbRating} IMDb rating
							</p>
						</div>
					</header>
					<section>
						<div className='rating'>
							{!isWatched ? (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>
									{userRating > 0 && (
										<button className='btn-add' onClick={handleAdd}>
											Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You already gave this movie a rating of {yourRating}{' '}
									<span>⭐️</span>
								</p>
							)}
						</div>

						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}
