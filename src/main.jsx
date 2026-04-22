import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';
import StarRating from './StarRating';
//import App from './App.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<StarRating maxRating={15} />

		{/* <App /> */}
	</StrictMode>,
);
