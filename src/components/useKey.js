import { useEffect } from 'react';

export function useKey(key, action) {
	useEffect(
		function () {
			const keyListener = function (e) {
				if (e.code.toLowerCase() === key.toLowerCase()) {
					action();
				}
			};
			document.addEventListener('keydown', keyListener);

			return function () {
				document.removeEventListener('keydown', keyListener);
			};
		},
		[action, key],
	);
}
