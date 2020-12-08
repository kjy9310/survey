package controller

import (
	"survey-api/model"
	"github.com/gin-gonic/gin"
	"strconv"
	"log"
)

func GetTakeSurvey(c *gin.Context) {
	surveyIdParam := c.Param("id")
	surveyId, err := strconv.Atoi(surveyIdParam)
	if err != nil {
		c.AbortWithStatusJSON(422, gin.H{"code": 422, "message": "InvalidRequest"})
		return 
	}
	survey, success := model.GetSurvey(surveyId)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})
		return
	}
	questionList, success := model.GetQuestionList(survey.Id, survey.PublisherId)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})
		return
	}
	result := map[string]interface{}{
		"survey": survey,
		"questions": questionList,
	}
	c.JSON(200, gin.H{"code": 200, "result": result})
}

func PostTakeSurvey(c *gin.Context){
	// publisherId := GetPublisherId(c)
	var result model.Result
	
	if err := c.ShouldBind(&result); err != nil {
		log.Println("PostTakeSurvey -> binding error ", err)
		c.AbortWithStatusJSON(422, gin.H{"code": 422, "message": "InvalidRequest"})
		return
	}
	log.Println("PostTakeSurvey ", result)
	success, _ := model.InsertResult(result)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})
		return
	}
	c.JSON(200, gin.H{"code": 200, "result": "success"})
}