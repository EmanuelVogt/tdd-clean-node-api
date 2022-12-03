export interface SurveyResultModel {
  surveyId: string
  question: string
  answers: Answer[]
  date: Date
}

interface Answer {
  image?: string
  answer: string
  count: number
  percent: number
}
