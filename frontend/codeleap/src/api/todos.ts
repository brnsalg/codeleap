import { Todo, Comment } from "../types/todo";

const BASE_URL = "http://localhost:8000/careers/";

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Erro ao buscar todos");
  return res.json();
};

export const createTodo = async (newTodo: Partial<Todo>): Promise<Todo> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });
  if (!res.ok) throw new Error("Erro ao criar todo");
  return res.json();
};

export const updateTodo = async (updated: Todo): Promise<Todo> => {
  const res = await fetch(`${BASE_URL}${updated.id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  if (!res.ok) throw new Error("Erro ao atualizar todo");
  return res.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}${id}/`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao deletar todo");
};

export const toggleLike = async (
  todo: Todo,
  username: string
): Promise<Todo> => {
  const res = await fetch(`${BASE_URL}${todo.id}/toggle_like/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error("Erro ao curtir/descurtir");
  return res.json();
};

export const addComment = async (
  todoId: string,
  username: string,
  content: string
): Promise<Comment> => {
  const res = await fetch(`${BASE_URL}${todoId}/add_comment/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, content }),
  });
  if (!res.ok) throw new Error("Erro ao adicionar comentário");
  return res.json();
};

export const deleteComment = async (
  todoId: string,
  commentId: string,
  username: string
): Promise<void> => {
  const res = await fetch(
    `${BASE_URL}${todoId}/comments/${commentId}/?username=${username}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) throw new Error("Erro ao deletar comentário");
};
