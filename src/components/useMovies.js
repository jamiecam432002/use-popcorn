import { useEffect, useState } from 'react';

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const KEY = 'f82d5389';

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

			getMovies();

			return function () {
				controller.abort();
			};
		},
		[query],
	);

	return { movies, isLoading, error };
}
