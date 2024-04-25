export interface CollectiveEvaluation {
  id: string;
  _id: string;
  ceId: string;
  evaluationType: string;
  otherType: string;
  description: string;
  evaluationDate: string;
  evaluator: string;
  outcome: string;
  comments: string;
  attachments: any;
  collective: string;
}

export interface CollectiveEvaluationFormData {
  [key: string]: any;
}
