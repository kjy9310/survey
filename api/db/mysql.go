package db

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"fmt"
)

var Con *sql.DB

func init() {
	var err error
	Con, err = sql.Open("mysql", "api:password@tcp(database:3306)/survey")
	checkErr(err)

	fmt.Println("You connected to your database.")
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}