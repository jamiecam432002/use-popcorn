import { useEffect, useState } from 'react';
import { KEY } from '../App';
import StarRating from './StarRating';
import Loader from './Loader';

export default function MovieDetail({ id, onCloseMovie }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);

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
							<StarRating maxRating={10} size={24} />
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
