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

func GetQuestionList(SurveyId int) ([]Question, bool){
	var result []Question
	sql := `select question.id, question.survey_id, question_history.title, question_history.type_id, type.name from question 
	inner join question_history on question_history.question_id = question.id
	inner join type on type.id = question_history.type_id
	where survey_id = ? 
	and question_history.deleted_at = '99991231'
	and question.is_deleted = false`

	res, err := db.Con.Query(sql, SurveyId)

	if err != nil {
		log.Println("GetQuestionList err :", err)
		return result, false
	}
	defer res.Close()
	for res.Next() {
		var singleResult Question
		err := res.Scan(&singleResult.Id, &singleResult.SurveyId, &singleResult.Title, &singleResult.TypeId, &singleResult.Type)
		if err != nil {
			log.Println("GetQuestionList err!")
			log.Println(err)
			return result, false
		}
		result = append(result, singleResult)
	}
	return result, true
}