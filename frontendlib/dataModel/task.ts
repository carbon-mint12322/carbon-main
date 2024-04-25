export interface Task {
  _id: string;
  name: string;
  desc: string;
  dueDate: string;
  priority: string;
  status: string;
  category: string;
  documents: any;
  comments: string;
  reminders: string;
  assignee: string;
  assignor: string;
  histories: any;
  assigneeUser: any;
  assignorUser: any;
}

export interface TaskFormData {
  [key: string]: any;
}
