# group-yourself

## Description

An application made to simplify the process of self-enrollment in groups for students.


## Tech stack

For both API and UI apps, Node.js + Typescript have been used, alongside Express for back-end and React for front-end. This choice was motivated mostly by my familiarity with the Node.js ecosystem and personal preference for strongly typed languages.

As a datasource solution, MySQL + InnoDB have been chosen for its support for row level locking, as this feature can bring huge performance boosts for operations that heavily use a small number of its schema tables (in this case the `stud_group`).

For real-time updates in the UI, websockets have been employed through the npm package `ws` and its integration with exporess, `express-ws`. Client app will connect to the server through a websocket and a cronjob will trigger a query and will update each connected client with the result, thus modeling a publisher-subscriber relation.


## Run instructions

* Start database container:
```bash
# in /db
docker-compose up -d
```

* Transpile Typescript in watch mode:
```bash
# in /api
npm run watch
```

* Run resulted code with nodemon (in another console or terminal tab):
```bash
# in /api
npm run start
```

* Start front-end app:
```bash
# in /ui
npm run start
```
