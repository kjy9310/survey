package controller

import (
	"survey-api/model"
	"github.com/gin-gonic/gin"
	"strconv"
	// "log"
)

func GetSurveyList(c *gin.Context) {
	publisherId := GetPublisherId(c)
	surveyList, success := model.GetSurveyList(publisherId)
	if (success) {
		c.JSON(200, gin.H{"status": 200, "result": surveyList})
		return
	}
	c.AbortWithStatusJSON(500, gin.H{"status": "data insertion error"})
}

func GetSurvey(c *gin.Context) {
	publisherId := GetPublisherId(c)
	surveyIdParam := c.Param("id")
	surveyId, err := strconv.Atoi(surveyIdParam)
	if err != nil {
		c.AbortWithStatusJSON(404, gin.H{"status": "survey not exist"})
		return
	}
	survey, success := model.GetSurvey(surveyId, publisherId)
	if (success) {
		c.JSON(200, gin.H{"status": 200, "result": survey})
		return
	}
	c.AbortWithStatusJSON(500, gin.H{"status": "data insertion error"})
}

func PostSurvey(c *gin.Context) {
	publisherId := GetPublisherId(c)
	var survey model.Survey
	if err := c.Bind(&survey); err != nil {
		c.AbortWithStatusJSON(400, gin.H{"status": "invalid input"})
		return
	}
	survey.PublisherId = publisherId
	success := model.InsertSurvey(survey)
	if (success) {
		c.JSON(200, gin.H{"status": 200})
		return
	}
	c.AbortWithStatusJSON(500, gin.H{"status": "data insertion error"})
}
