# Molblium software
Molblium is a very simple and naive forum board. It's not production ready at all, but it was a fun weekend exercise.

## Features
- Frontend
    - Styled using `Tailwind CSS`
    - Routing to different pages with `React Router`
    - Written entirely in `TypeScript`
    - All data fetching done with `TanStack Query` for easier state management
    - Threads
        - Fetch and display threads
        - Make new threads
        - Edit or delete user-owned threads using mutations
    - Posts
        - Add posts to a thread
        - Delete user-owned posts
        - Optimistic updates for a smoother client-side experience
    - Tags
        - Tags can be applied to threads for better organization
    - User login
        - Register and log in users
        - User context ensuring the only options displayed (i.e. deletion, logout) are the ones the user has access to
        - Persistent user session that is invalidated when `JWT` expires
    - Other features
        - Global notification area for feedback
        - Global loading bar when during queries or mutations
- Backend
    - Simple `Express.js` application made to support the frontend with data
    - Written in `TypeScript`
    - Automatically tries to initialize a database that loads schema from the filesystem
        - With a script ready to create more testing data
    - Database access using `mysql2/promise` with prepared statements
    - User passwords stored securely using `argon2`
    - User sessions with `JWT` (JSON Web tokens), with a variable expiry date

## Running:
1. Make sure you have a MySQL server running
2. Edit `./backend/.env.example` to your liking and save it as `./backend/.env`
    - Make sure you supply the JWT secret
    - If you're running MySQL with XAMPP you should be able to skip this step, as the `.env` file should be generated for you (you would probably still want to check if everything is correct later on)
3. Run `npm install` in the root of this repository
4. Run `npm start` to start the frontend and backend
    - You can use `npm start start-backend` and `npm start start-frontend` to launch them separately

You can also use `node ./backend/fillfakedata.js`, that will populate your app with more lorem ipsum threads and users (Note: users.json will be overwritten if you run this script again)

## TODOs:
This project was created within a very short time frame for an assignment and won't be maintained. 
Nevertheless, here are some improvements that could be made in the future if I had more time

- [ ] While this project uses `TypeScript`, it lacks type definitions of database objects leading to overreliance on `any`
- Frontend:
    - [ ] This project was made using `create-react-app`, a deprecated mess of a framework. A better build tool or even an SSR-enabled framework would be ideal
    - [ ] Not every api interaction is included within `util/api.ts`
    - [ ] Tags can have issues with contrast
    - [ ] Error handling works but is ugly
    - [ ] There are no user avatars or `jdenticons`
- Backend:
    - [ ] None of the data is validated or rate-limited on the backend
    - [ ] Initialization of the database always imports a sample dataset with no way to initialize the database with only the schema. Works great during a demo but will be useless anywhere else 
    - [ ] Due to the use of `JWT` there are some issues with ensuring the user is authenticated to make an action without consulting the database. An alternative would be shorter token lifespans but that would be annoying anywhere else
    - [ ] There are some routes that don't have a use in the frontend
    - [ ] There is an unused attachment table in the database
- Nice to haves:
    - [ ] Tailwind's colors could be replaced for something more pleasing
    - [ ] Grouping of threads is missing but could be easily added
    - [ ] Threads that are locked to a group of users would be a nice addition 
    - [ ] There are almost no animations or hover effects
- [ ] Even more are TODOs lurking in the code