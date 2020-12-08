package model

import (
	"survey-api/db"
	"log"
)

type Result struct {
	Id   		int			`json:"id"`
	SurveyId 	int			`json:"survey_id"`
	Name 		string		`json:"name"`
	Email 		string		`json:"email"`
	Answers		[]Answer	`json:"answers"`
}

type Answer struct {
	QuestionId	int		`json:"question_id"`
	ChoiceId	int		`json:"choice_id"`
}

func InsertResult(result Result) (bool, int) {
	log.Println("InsertResult started")
	
	resultSql := `INSERT INTO result (survey_history_id, name, email) 
	SELECT survey_history.id, ?, ? from survey_history
	inner join survey on survey.id = survey_history.survey_id 
	where survey.id = ? and survey_history.deleted_at = '99991231' `
	stmt, err := db.Con.Prepare(resultSql)

	if err != nil {
		log.Println("error on statement creation",err)
		return false, 0
	}
	defer stmt.Close()

	res, err := stmt.Exec(result.Name, result.Email, result.SurveyId)
	if err != nil {
		log.Println("error on insert",err)
		return false, 0
	}

	resultId, err := res.LastInsertId()
	log.Println("resultId", resultId)
	if err != nil {
		log.Println("error on insert-get id",err)
		return false, 0
	}

	result.Id = int(resultId)
	if result.Id == 0 {
		log.Println("inserted data not exist",err)
		return false, 0
	}

	answerSql := `INSERT INTO answer (result_id, question_history_id, choice_history_id)
	SELECT ?, 
	(select question_history.id from question_history inner join question on question.id = question_history.question_id
		where question_history.deleted_at = '99991231' and question.id = ? limit 1),
	(select choice_history.id from choice_history inner join choice on choice.id = choice_history.choice_id
		where choice_history.deleted_at = '99991231' and choice.id = ? limit 1)
	FROM DUAL
	`
	answerStmt, err := db.Con.Prepare(answerSql)
	if err != nil {
		log.Println("error on statement creation",err)
		return false, 0
	}
	defer answerStmt.Close()
	// insert answers
	for _, answer := range result.Answers{
		_, err = answerStmt.Exec(result.Id, answer.QuestionId, answer.ChoiceId)
		if err != nil {
			log.Println("error on insert",err)
			return false, 0
		}
	}
	return true, result.Id
}