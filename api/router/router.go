package router

import (
	"survey-api/controller"
	"github.com/gin-gonic/gin"
)

func InitRoutes(routerGroup *gin.RouterGroup) {
	routerGroup.GET("/db", controller.TestDB)
	routerGroup.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Success"})
	})
	
	//survey
	routerGroup.GET("/survey", controller.GetSurveyList)
	routerGroup.GET("/survey/:id", controller.GetSurvey)
	routerGroup.POST("/survey", controller.PostSurvey)
	routerGroup.DELETE("/survey/:id", controller.DeleteSurvey)
	routerGroup.PUT("/survey/:id", controller.PutSurvey)

	//question
	routerGroup.GET("/question", controller.GetQuestionList)
	
	routerGroup.POST("/question", controller.PostQuestion)
	routerGroup.DELETE("/question/:id", controller.DeleteQuestion)
	routerGroup.PUT("/question/:id", controller.PutQuestion)

}