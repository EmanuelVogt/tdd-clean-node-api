export interface SurveyModel {
  question: string
  answers: Answer[]
  date: Date
}

export interface Answer {
  image: string
  answer: string
}
