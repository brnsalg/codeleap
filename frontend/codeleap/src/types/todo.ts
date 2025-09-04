export type Todo = {
  id: string;
  title: string;
  content: string;
  username: string;
  created_datetime: string;
  liked_by: string[];
  comments?: Comment[];
};

export type Comment = {
  id: string;
  todo: string;
  username: string;
  content: string;
  created_datetime: string;
};
