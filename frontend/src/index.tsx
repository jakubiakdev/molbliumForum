import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import Root from './routes/root';
import User from './routes/user';
import AuthProvider from './AuthContext';
import Login from './routes/login';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Threads from './routes/threads';
import Home from './routes/home';
import Thread, { loader as threadLoader } from './routes/thread';
// TODO: maybe lazy loading?
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/user",
        element: <User />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/thread/:id",
        element: <Thread />,
        loader: threadLoader(queryClient),
      },
      {
        path: "/threads",
        element: <Threads />
      }
    ]
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);