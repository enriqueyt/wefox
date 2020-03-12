# Wefox

## Pre-requisites
* [Docker](https://www.docker.com/get-started)
* [NVM](https://github.com/nvm-sh/nvm)
* [Git](https://git-scm.com/)
* [MongoDb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
* [Redis](https://redislabs.com/lp/node-js-redis/)

## Setup

### Install dependencies

### Node.js
To install nodejs use [NVM](https://github.com/nvm-sh/nvm) las version

```
nvm install --lts
```

#### To get source code from parent repository
``` bash
> $ git clone https://github.com/enriqueyt/wefox.git
```

## Development

**note**: you have to create an .env file and set up key for geocoding and open wheather

```
$ vi .env
GEOCODING_API=YOUR_API_KEY
WEATHER_API=YOUR_API_KEY

```

### To start the Node.js server:
``` bash
    npm start
```

### steps to reproduce app

#### Create previous credentials

```
POST http://127.0.0.1:3000/api/singin

data

{
  "name": "Enrique yepez four",
  "username": "enriqueyt5",
  "password": "password123",
  "email": "enrique@gmail.com",
  "postalCode": "E2",
  "country": "UK",
  "notification": true
}

```

### Login in the app

```
 POST http://localhost:3000/api/login

data

{
  "username": "enriqueyt5",
  "password": "password123"
}

```

### Validate address

```
POST http://localhost:3000/api/address
--header Authorization: Bearer c11bb2f946645e22a2f0c171fee43ddd77067901

data

{
	"address": "Fellows Ct",
    "country": "uk",
    "town": "london",
    "postalCode": "E2",
    "streetNumber": "Fellows"

}
```

### Validate weather

```
POST http://localhost:3000/api/weather
--header Authorization: Bearer c11bb2f946645e22a2f0c171fee43ddd77067901

data

{
	"address": "Fellows Ct",
    "country": "uk",
    "town": "london",
    "postalCode": "E2",
    "streetNumber": "Fellows"

}
```

## Reproduce test

```
$ npm run test
```

## Deploying to Heroku

Follow these instructions:
 - Create an account [Heroku Account](https://signup.heroku.com/signup/dc)
 - Install [Heroku Toolbelt](https://devcenter.heroku.com/articles/heroku-cli)
```
$ heroku login
```
 - Deploy the app
```
$ heroku create
$ git push heroku master
```

## Git Rules

### Commit messages:
Use the following prefix to classified the actions made:
* ##### #N for adding new features.
* ##### #M for updating features.
* ##### #R for removing features or some piece of code.
* ##### #F for fixing some bug on features.

### Branches
Use the following prefix to create branches:
* feature/FUNCTIONALITY-NAME for normal development.
* fix/ISSUE-DESCRIPTION for bug's fix.

## Client version
N/A

## Version
v0.1.0

## Author
* **Enrique Yepez** - *Initial work*

## Licence
N/A
