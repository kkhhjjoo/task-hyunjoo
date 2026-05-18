export type Todo = {
  _id: string;
  title: string;
  memo: string;
  imageUrl?: string;
  isCompleted: boolean;
};

declare global {
  var __todos: Todo[] | undefined;
}

if (!global.__todos) {
  global.__todos = [
    { _id: "1", title: "비타민 챙겨 먹기", memo: "", isCompleted: false },
    { _id: "2", title: "약주 마시기", memo: "", isCompleted: false },
    { _id: "3", title: "운동하기", memo: "", isCompleted: false },
    { _id: "4", title: "은행 다녀오기", memo: "", isCompleted: true },
    { _id: "5", title: "비타민 챙겨 먹기", memo: "", isCompleted: true },
  ];
}

export const todos = global.__todos;
