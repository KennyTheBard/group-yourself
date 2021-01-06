# group-yourself

## Back-End

### Run instructions

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

### Usage

All requests will be send to localhost:3000/api. For usage examples you can check the `/api/http_example` directory. Those are example requests, but can be used easily with Visual Studio Code http client.
