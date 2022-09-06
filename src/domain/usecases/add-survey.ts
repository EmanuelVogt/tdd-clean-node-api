export interface Answer {
  image: string
  answer: string
}
export interface AddSurveyModel {
  question: string
  answers: Answer[]
  date: Date
}

export interface AddSurvey {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
