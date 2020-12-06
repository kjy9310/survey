# survey
survery application - bytedance homework

## tag
* v0.0 : basic docker & auth function. 

## dependancies

### go-package
* [Gin Web Framework](https://github.com/gin-gonic/gin)
* [JWT Middleware for Gin Framework](https://github.com/appleboy/gin-jwt)
* [Go-MySQL-Driver](https://github.com/go-sql-driver/mysql)

### npm package
* axios
* react
* react-dom
* react-router
* react-router-dom
* react-scripts

## Pre install
* docker

***

## Getting started:
* download [docker-compose](https://docs.docker.com/compose/install/) if not already installed
Then run the following commands:

```bash
$ mkdir myApp
$ cd myApp
$ git clone https://github.com/kjy9310/survey.git .
$ docker-compose up
```

Then you can open the React frontend at localhost:3000 and the RESTful GoLang API at localhost:5000

Then to build production images set arguments in docker-compose to production

## ER diagram
* [Image](https://raw.githubusercontent.com/kjy9310/survey/master/ERD.bmp)
