package router

import (
	"survey-api/controller"
	"github.com/gin-gonic/gin"
)

func InitRoutes(routerGroup *gin.RouterGroup) {
	routerGroup.GET("/db", controller.TestDB)
	routerGroup.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Success"})
	})
	
	//survey
	routerGroup.GET("/survey", controller.GetSurveyList)
	routerGroup.GET("/survey/:id", controller.GetSurvey)
	routerGroup.POST("/survey", controller.PostSurvey)
	// routerGroup.DELETE("/survey/:id", controller.DeleteSurvey)
	// routerGroup.PUT("/survey/:id", controller.PutSurvey)

}