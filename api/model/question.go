package model

import (
	"survey-api/db"
	"log"
)

type Question struct {
	Id   		int			`json:"id"`
	SurveyId 	int			`json:"surveyId"`
	Title 		string		`json:"title"`
	TypeId 		int			`json:"typeId"`
	Type 		string		`json:"type"`
	Choices		[]Choice	`json:"choices"`
}

type Choice struct {
	Id			int		`json:"id"`
	QuestionId	int		`json:"questionId"`
	OptionName	int		`json:"optionName"`
}

func GetQuestionList(SurveyId int, PublisherId int) ([]Question, bool){
	var result []Question
	questionSql := `select question.id, question.survey_id, question_history.title, question_history.type_id, type.name from question 
	inner join question_history on question_history.question_id = question.id
	inner join type on type.id = question_history.type_id
	inner join survey on survey.id = question.survey_id
	where survey.id = ? 
	and survey.publisher_id = ?
	and question_history.deleted_at = '99991231'
	and question.is_deleted = false order by question.id`

	questionRes, err := db.Con.Query(questionSql, SurveyId, PublisherId)

	if err != nil {
		log.Println("GetQuestionList question err :", err)
		return result, false
	}
	defer questionRes.Close()

	choiceMap := make(map[int][]Choice)

	choiceSql := `select choice.id, choice.question_id, choice_history.option_name from choice
	inner join choice_history on choice_history.choice_id = choice.id
	inner join question on choice.question_id = question.id
	inner join survey on survey.id = question.survey_id
	where survey.id = ? and survey.publisher_id = ?
	and choice_history.deleted_at = '99991231'
	and question.is_deleted = false`

	choiceRes, err := db.Con.Query(choiceSql, SurveyId, PublisherId)

	if err != nil {
		log.Println("GetQuestionList choice err :", err)
		return result, false
	}
	defer choiceRes.Close()

	for choiceRes.Next() {
		var singleChoice Choice
		err := choiceRes.Scan(&singleChoice.Id, &singleChoice.QuestionId, &singleChoice.OptionName)
		if err != nil {
			log.Println("GetQuestionList choiceRes next err!")
			log.Println(err)
			return result, false
		}
		if val, ok := choiceMap[singleChoice.QuestionId]; ok {
			choiceMap[singleChoice.QuestionId] = append(val, singleChoice)
		} else {
			choiceMap[singleChoice.QuestionId] = []Choice{singleChoice}
		}
	}

	for questionRes.Next() {
		var singleResult Question
		err := questionRes.Scan(&singleResult.Id, &singleResult.SurveyId, &singleResult.Title, &singleResult.TypeId, &singleResult.Type)
		if err != nil {
			log.Println("GetQuestionList err!")
			log.Println(err)
			return result, false
		}
		if val, ok := choiceMap[singleResult.Id]; ok {
			singleResult.Choices = val
		}
		result = append(result, singleResult)
	}

	return result, true
}

func GetQuestion(questionId int, publisherId int) (Question, bool){
	var result Question
	questionSql := `select question.id, question.survey_id, question_history.title, question_history.type_id, type.name from question 
	inner join question_history on question_history.question_id = question.id
	inner join type on type.id = question_history.type_id
	inner join survey on survey.id = question.survey_id
	where question.id = ? and survey.publisher_id = ?
	and question_history.deleted_at = '99991231'
	and question.is_deleted = false`

	questionRes, err := db.Con.Query(questionSql, questionId, publisherId)

	if err != nil {
		log.Println("GetQuestion question err :", err)
		return result, false
	}
	defer questionRes.Close()

	var choices []Choice

	choiceSql := `select choice.id, choice.question_id, choice_history.option_name from choice
	inner join choice_history on choice_history.choice_id = choice.id
	inner join question on choice.question_id = question.id
	inner join survey on survey.id = question.survey_id
	where question.id = ? and survey.publisher_id = ?
	and choice_history.deleted_at = '99991231'
	and question.is_deleted = false`

	choiceRes, err := db.Con.Query(choiceSql, questionId, publisherId)

	if err != nil {
		log.Println("GetQuestion choice err :", err)
		return result, false
	}

	defer choiceRes.Close()

	for choiceRes.Next() {
		var singleChoice Choice
		err := choiceRes.Scan(&singleChoice.Id, &singleChoice.QuestionId, &singleChoice.OptionName)
		if err != nil {
			log.Println("GetQuestionList choiceRes next err!")
			log.Println(err)
			return result, false
		}
		choices = append(choices, singleChoice)
	}

	if questionRes.Next() {
		var singleResult Question
		err := questionRes.Scan(&singleResult.Id, &singleResult.SurveyId, &singleResult.Title, &singleResult.TypeId, &singleResult.Type)
		if err != nil {
			log.Println("GetQuestionList err!")
			log.Println(err)
			return result, false
		}
		singleResult.Choices = choices
		
		return result, true
	}
	println("GetQuestion nodata id : ", questionId)
	return result, false
}

func InsertQuestion(question Question, publisherId int) (bool, int) {
	log.Println("InsertQuestion started")
	insertQuestionSql := `INSERT INTO question (survey_id, is_deleted) 
	SELECT survey.id, false from survey inner join publisher on publisher.id = survey.publisher_id and publisher.id = ? and survey.id = ?`
	stmk, err := db.Con.Prepare(insertQuestionSql)
	if err != nil {
		log.Println("error on statement creation",err)
		return false, 0
	}
	defer stmk.Close()

	res, err := stmk.Exec(question.SurveyId, publisherId)
	if err != nil {
		log.Println("error on insert",err)
		return false, 0
	}
	questionId, err := res.LastInsertId()
	log.Println("questionId", questionId)
	if err != nil {
		log.Println("error on insert-get id",err)
		return false, 0
	}
	question.Id = int(questionId)
	if question.Id == 0 {
		log.Println("inserted data not exist",err)
		return false, 0
	}
	historyResult := addQuestionHistory(question)
	if !historyResult {
		log.Println("addQuestionHistory error",err)
		return false, 0
	}
	// insert chices
	for _, choice := range question.Choices{
		choice.QuestionId = question.Id
		success,_ := insertChoice(choice)
		if !success {
			log.Println("chices loop insert error",err)
			return false, 0
		}
	}

	return true, question.Id
}

func addQuestionHistory(question Question) bool {
	stmkHistoryUpdate, err := db.Con.Prepare("UPDATE question_history set deleted_at = now() where question_id = ? and deleted_at='99991231'")
	if err != nil {
		log.Println("error on statement creation history",err)
		return false
	}
	defer stmkHistoryUpdate.Close()
	_, err = stmkHistoryUpdate.Exec(question.Id)
	if err != nil {
		log.Println("error on update history",err)
		return false
	}
	stmkHistoryInsert, err := db.Con.Prepare("INSERT INTO question_history (question_id, title, type_id) VALUES(?, ?, ?)")
	if err != nil {
		log.Println("error on statement creation history",err)
		return false
	}
	defer stmkHistoryInsert.Close()
	_, err = stmkHistoryInsert.Exec(question.Id, question.Title, question.TypeId)
	if err != nil {
		log.Println("error on insert history",err)
		return false
	}
	return true
}

func insertChoice(choice Choice) (bool, int) {
	log.Println("insertChoice started")
	insertQuestionSql := `INSERT INTO choice (question_id) VALUES (? )`
	stmk, err := db.Con.Prepare(insertQuestionSql)
	if err != nil {
		log.Println("error on statement creation",err)
		return false, 0
	}
	defer stmk.Close()

	res, err := stmk.Exec(choice.QuestionId)
	if err != nil {
		log.Println("error on insert", err)
		return false, 0
	}
	choiceId, err := res.LastInsertId()
	log.Println("choiceId", choiceId)
	if err != nil {
		log.Println("error on insert-get id", err)
		return false, 0
	}
	choice.Id = int(choiceId)
	if choice.Id == 0 {
		log.Println("inserted data not exist", err)
		return false, 0
	}
	historyResult := addChoiceHistory(choice)
	return historyResult, choice.Id
}

func addChoiceHistory(choice Choice) bool {
	stmkHistoryUpdate, err := db.Con.Prepare("UPDATE choice_history set deleted_at = now() where choice_id = ? and deleted_at='99991231'")
	if err != nil {
		log.Println("error on statement creation history",err)
		return false
	}
	defer stmkHistoryUpdate.Close()
	_, err = stmkHistoryUpdate.Exec(choice.Id)
	if err != nil {
		log.Println("error on update history",err)
		return false
	}
	stmkHistoryInsert, err := db.Con.Prepare("INSERT INTO choice_history (choice_id, option_name) VALUES(?, ?)")
	if err != nil {
		log.Println("error on statement creation history",err)
		return false
	}
	defer stmkHistoryInsert.Close()
	_, err = stmkHistoryInsert.Exec(choice.Id, choice.OptionName)
	if err != nil {
		log.Println("error on insert history",err)
		return false
	}
	return true
}