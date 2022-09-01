export interface Answer {
  image: string
  answer: string
}
export interface CreateSurveyModel {
  question: string
  answers: Answer[]
}

export interface CreateSurvey {
  create: (surveyData: CreateSurveyModel) => Promise<void>
}
