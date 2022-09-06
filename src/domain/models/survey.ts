export interface SurveyModel {
  id: string
  question: string
  answers: Answer[]
  date: Date
}

export interface Answer {
  image: string
  answer: string
}
