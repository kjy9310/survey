package controller

import (
	"survey-api/model"
	"github.com/gin-gonic/gin"
	"strconv"
	"log"
)

func GetQuestionList(c *gin.Context) {
	publisherId := GetPublisherId(c)
	surveyIdString := c.DefaultQuery("survey_id", "")
	surveyId, err := strconv.Atoi(surveyIdString)
	if err != nil {
		c.AbortWithStatusJSON(422, gin.H{"code": 422, "message": "InvalidRequest"})
		return 
	}
	questionList, success := model.GetQuestionList(surveyId, publisherId)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})
		return
	}
	c.JSON(200, gin.H{"code": 200, "result": questionList})
}

func GetQuestion(c *gin.Context) {
	publisherId := GetPublisherId(c)
	questionIdParam := c.Param("id")
	questionId, err := strconv.Atoi(questionIdParam)
	if err != nil {
		c.AbortWithStatusJSON(422, gin.H{"code": 422, "message": "InvalidRequest"})
		return
	}
	question, success := model.GetQuestion(questionId, publisherId)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})	
		return
	}
	c.JSON(200, gin.H{"code": 200, "result": question})
}

func PostQuestion(c *gin.Context){
	publisherId := GetPublisherId(c)
	var question model.Question
	
	if err := c.ShouldBind(&question); err != nil {
		log.Println("PostQuestion -> binding error ", err)
		c.AbortWithStatusJSON(422, gin.H{"code": 422, "message": "InvalidRequest"})
		return
	}
	log.Println("PostQuestion -> question", question)
	
	success, questionId := model.InsertQuestion(question, publisherId)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})
		return
	}
	newQuestion, success := model.GetQuestion(questionId, publisherId)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})
		return
	}
	c.JSON(200, gin.H{"code": 200, "result": newQuestion})
}

func PutQuestion(c *gin.Context){
	publisherId := GetPublisherId(c)
	var question model.Question
	if err := c.Bind(&question); err != nil {
		log.Println("PutQuestion -> binding error ", err)
		c.AbortWithStatusJSON(422, gin.H{"code": 422, "message": "InvalidRequest"})
		return
	}
	log.Println("PutQuestion param:", question)
	
	success, questionId := model.UpdateQuestion(question, publisherId)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})
		return
	}
	newQuestion, success := model.GetQuestion(questionId, publisherId)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})	
		return
	}
	c.JSON(200, gin.H{"code": 200, "result": newQuestion})
}

func DeleteQuestion(c *gin.Context) {
	publisherId := GetPublisherId(c)
	questionIdParam := c.Param("id")
	questionId, err := strconv.Atoi(questionIdParam)
	if err != nil {
		c.AbortWithStatusJSON(422, gin.H{"code": 422, "message": "InvalidRequest"})
		return
	}
	success := model.DeleteQuestion(questionId, publisherId)
	if (!success) {
		c.AbortWithStatusJSON(500, gin.H{"code": 500, "message": "UnknownError"})
		return
	}
	c.JSON(200, gin.H{"code": 200, "result": "success"})
}