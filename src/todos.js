import { saveDB, insert, getDB, getLastId } from "./db.js";

export const newTask = async (title) => {
  const lastId = await getLastId();
  const data = {
    title,
    status: "to-do",
    id: lastId + 1,
  };
  return await insert(data);
};

export const getAllTasks = async (status) => {
  const db = await getDB();
  if (status) return db.todos.filter((task) => task.status === status) || [];
  return db.todos || [];
};

export const editTask = async (id, status, title) => {
  const db = await getDB();
  if (!db.todos) return null;
  const match = db.todos.find((task) => task.id === id);
  if (match) {
    match.status = status || match.status;
    match.title = title || match.title;
    await saveDB(db);
    return match;
  }
  return null;
};

export const removeTask = async (id) => {
  const db = await getDB();
  if (!db.todos) return null;

  const match = db.todos.find((task) => task.id === id);
  if (match) {
    db.todos = db.todos.filter((task) => task.id !== id);
    await saveDB(db);
    return id;
  }
  return null;
};

export const removeAllTasks = async () => {
  const db = await getDB();
  db.todos = [];
  return saveDB(db);
};
