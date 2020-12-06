package model

import (
	"survey-api/db"
	"log"
)

type Publisher struct {
	Id   		int    `json:"id"`
	Name 		string `json:"name"`
	Password 	string `json:"password"`
	Token 		string `json:"token"`
}

func GetSinglePublisher(Name string, Password string) (Publisher, bool) {
	var result Publisher
	sql := "select id, name from publisher where name = ? and password = SHA2(?, 512)"

	res, err := db.Con.Query(sql, Name, Password)

	if err != nil {
		log.Println("GetSinglePublisher err :", err)
		return result, false
	}
	defer res.Close()
	if res.Next() {
		err := res.Scan(&result.Id, &result.Name)
		if err != nil {
			log.Println("GetSinglePublisher err!")
			log.Println(err)
			return result, false
		}
		return result, true
	}
	log.Println("GetSinglePublisher no match")
	return result, false
}

func InsertPublisher(publisher Publisher) bool {
	log.Println("Insert data")

	stmk, err := db.Con.Prepare("INSERT INTO publisher(name,password) VALUES(?,SHA2(?, 512))")
	if err != nil {
		log.Println("InsertPublisher statement",err)
		return false
	}
	defer stmk.Close()
	_, err = stmk.Exec(publisher.Name, publisher.Password)

	if err != nil {
		log.Println(err)
		return false
	} else {
		return true
	}
}
