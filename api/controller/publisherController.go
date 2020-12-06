package controller

import (
	"survey-api/model"
	"github.com/gin-gonic/gin"
	jwt "github.com/appleboy/gin-jwt/v2"
	// "log"
)

type login struct {
	Username string `form:"Username" json:"Username" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

func Signin(c *gin.Context) (interface{}, error) {
	var loginVals login
	if err := c.ShouldBind(&loginVals); err != nil {
		return "", jwt.ErrMissingLoginValues
	}
	username := loginVals.Username
	password := loginVals.Password

	publisher, success := model.GetSinglePublisher(username, password)
	if (success) {
		return &publisher, nil
	}
	return nil, jwt.ErrFailedAuthentication
}

func Signup(c *gin.Context)  {
	var loginVals login
	if err := c.ShouldBind(&loginVals); err != nil {
		c.JSON(422, gin.H{"status": 422, "message": "invalid data"})
	}
	var publisher model.Publisher
	publisher.Name = loginVals.Username
	publisher.Password = loginVals.Password
	success := model.InsertPublisher(publisher)
	if (success) {
		c.JSON(200, gin.H{"status": 200, "message": "registration successful"})
	}
	c.AbortWithStatusJSON(500, gin.H{"status": "data insertion error"})
}
