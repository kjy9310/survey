package model

import (
	"survey-api/db"
	"log"
)

type test struct {
	text string
}

func GetDataTest() (test, bool) {
	var result test
	res, err := db.Con.Query("select 'connected' from dual")
	if err != nil {
		log.Println(err)
		return result, false
	}

	if res.Next() {
		err := res.Scan(&result.text)
		if err != nil {
			log.Println("err!")
			log.Println(err)
			return result, false
		}
	}

	return result, true
}