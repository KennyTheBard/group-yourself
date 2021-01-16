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


## Todo

- [x] Create gmail account and use it with nodemailer into a MailService (please take into consideration that you will have to allow the account to be used by a non trusted app)
- [ ] Start a front end project in the `/ui` directory (React, Angular or Vue)
- [x] Use `ws` to establish connection with front end client
- [x] Create a `cronjob` that triggers updates and notifications for each group collection
- [ ] Write a script that will stress test the row locking mechanism of the enrollment endpoint