import './App.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import {RegisterPage} from "./RegPage.jsx";
import {LoginPage} from "./LoginPage.jsx";
import {MePage} from "./MePage.jsx";
import {ReadPage} from "./ReadPage.jsx";
import {UserPage} from "./UserPage.jsx";

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <RegisterPage />,
        },
        {
            path: "/login",
            element: <LoginPage />
        },
        {
            path: "/me",
            element: <MePage />
        },
        {
            path: `me/:postId/read`,
            element: <ReadPage />
        },
        {
            path: `:username/:postId/read`,
            element: <ReadPage />
        },
        {
            path: `:username`,
            element: <UserPage />
        }
    ]);

    return (
        <RouterProvider router={router}/>
    )
}
