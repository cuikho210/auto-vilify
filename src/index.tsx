import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './home_page/HomePage';
import PlayPage from './play_page/PlayPage';
import PlayBgPage from './play_page/PlayBgPage';
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/play/:projectId",
		element: <PlayPage />,
	},
	{
		path: "/play-bg",
		element: <PlayBgPage />,
	},
]);

const root = createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<RouterProvider router={router} />
);
