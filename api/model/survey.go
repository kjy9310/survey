package model

import (
	"survey-api/db"
	"log"
)

type Survey struct {
	Id   		int			`json:"id"`
	Title 		string		`json:"title"`
	Description string		`json:"description"`
	PublisherId int			`json:"publisher_id"`
}

func GetSurveyList(PublisherId int) ([]Survey, bool){
	var result []Survey
	sql := `select survey.id, survey_history.title, survey_history.description, survey.publisher_id from survey
	inner join survey_history on survey_history.survey_id = survey.id
	where survey.publisher_id = ? 
	and survey_history.deleted_at = '99991231'
	and survey.is_deleted = false`

	res, err := db.Con.Query(sql, PublisherId)

	if err != nil {
		log.Println("GetSurveyList err :", err)
		return result, false
	}
	defer res.Close()
	for res.Next() {
		var singleResult Survey
		err := res.Scan(&singleResult.Id, &singleResult.Title, &singleResult.Description, &singleResult.PublisherId)
		if err != nil {
			log.Println("GetSurveyList err!")
			log.Println(err)
			return result, false
		}
		result = append(result, singleResult)
	}
	return result, true
}

func GetSurvey(surveyId int, publisherId int) (Survey, bool){
	var result Survey
	sql := `select survey.id, survey_history.title, survey_history.description, survey.publisher_id from survey
	inner join survey_history on survey_history.survey_id = survey.id
	where survey.id = ? and survey.publisher_id = ?
	and survey_history.deleted_at = '99991231'
	and survey.is_deleted = false`

	res, err := db.Con.Query(sql, surveyId, publisherId)

	if err != nil {
		log.Println("GetSurvey err :", err)
		return result, false
	}
	defer res.Close()
	if res.Next() {
		err := res.Scan(&result.Id, &result.Title, &result.Description, &result.PublisherId)
		if err != nil {
			log.Println("GetSurvey err!")
			log.Println(err)
			return result, false
		}
		return result, true
	}
	println("GetSurvey nodata id : ", surveyId)
	return result, false
}

func InsertSurvey(survey Survey, publisherId int) (bool, int) {
	stmk, err := db.Con.Prepare("INSERT INTO survey(publisher_id, is_deleted) SELECT id ,false from publisher where publisher.id = ? ")
	if err != nil {
		log.Println("error on statement creation",err)
		return false, 0
	}
	defer stmk.Close()
	res, err := stmk.Exec(publisherId)
	if err != nil {
		log.Println("error on insert",err)
		return false, 0
	}
	surveyId, err := res.LastInsertId()
	log.Println("surveyId", surveyId)
	if err != nil {
		log.Println("error on insert-get id",err)
		return false, 0
	}
	survey.Id = int(surveyId)
	if survey.Id == 0 {
		log.Println("InsertSurvey inserted data not exist",err)
		return false, 0
	}
	historyResult := addSurveyHistory(survey)
	return historyResult, survey.Id
}

func addSurveyHistory(survey Survey) bool {
	stmkHistoryUpdate, err := db.Con.Prepare("UPDATE survey_history set deleted_at = now() where survey_id = ? and deleted_at='99991231'")
	if err != nil {
		log.Println("error on statement creation history",err)
		return false
	}
	defer stmkHistoryUpdate.Close()
	_, err = stmkHistoryUpdate.Exec(survey.Id)
	if err != nil {
		log.Println("error on update history",err)
		return false
	}
	stmkHistoryInsert, err := db.Con.Prepare("INSERT INTO survey_history (survey_id, title, description) VALUES(?, ?, ?)")
	if err != nil {
		log.Println("error on statement creation history",err)
		return false
	}
	defer stmkHistoryInsert.Close()
	_, err = stmkHistoryInsert.Exec(survey.Id, survey.Title, survey.Description)
	if err != nil {
		log.Println("error on insert history",err)
		return false
	}
	return true
}