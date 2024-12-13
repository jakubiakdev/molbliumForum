import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Root from './routes/root';
import User from './routes/user';
import AuthProvider from './AuthContext';
import Login from './routes/login';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Home from './routes/home';
import Thread, { loader as threadLoader } from './routes/thread';
import Threads, { loader as threadsLoader } from './routes/threads';
import Register from './routes/register';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NewThread from './routes/newthread';
import NoticeProvider from './NoticeContext';
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
        path: "/register",
        element: <Register />
      },
      {
        path: "/newthread",
        element: <NewThread />
      },
      {
        path: "/thread/:id",
        element: <Thread />,
        loader: threadLoader(queryClient),
      },
      {
        path: "/threads",
        element: <Threads />,
        loader: threadsLoader(queryClient),
      }
    ]
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NoticeProvider>
        <AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <RouterProvider router={router} />
        </AuthProvider>
      </NoticeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);