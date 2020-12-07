package controller

import (
	"survey-api/model"
	"github.com/gin-gonic/gin"
	"log"
	jwt "github.com/appleboy/gin-jwt/v2"
)

func TestDB(c *gin.Context) {

	res, err := model.GetDataTest()

	if !err {
		log.Println(err)
		c.AbortWithStatusJSON(500, gin.H{"message": "UnknownError"})
		return
	}

	c.JSON(200, gin.H{"result": res})

}

func GetPublisherId(c *gin.Context) int {
	claims := jwt.ExtractClaims(c)
	return int(claims["Id"].(float64))
}