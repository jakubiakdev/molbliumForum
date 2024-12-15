import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Root from './routes/root';
import { loader as threadLoader } from './routes/thread';
import { loader as threadsLoader } from './routes/threads';

import AuthProvider from './AuthContext';
import NoticeProvider from './NoticeContext';

import './index.css';

const User = React.lazy(() => import('./routes/user'));
const Login = React.lazy(() => import('./routes/login'));
const Home = React.lazy(() => import('./routes/home'));
const Thread = React.lazy(() => import('./routes/thread'));
const Register = React.lazy(() => import('./routes/register'));
const Threads = React.lazy(() => import('./routes/threads'));
const NewThread = React.lazy(() => import('./routes/newthread'));


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