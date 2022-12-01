export interface Answer {
  image: string
  answer: string
}
export interface AddSurveyParams {
  question: string
  answers: Answer[]
  date: Date
}

export interface AddSurvey {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
