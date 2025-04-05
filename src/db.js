import fs from "node:fs/promises";

const DB_PATH = "./db.json";
export const getDB = async () => {
  const db = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(db);
};

export const saveDB = async (db) => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return db;
};

export const insert = async (data) => {
  const db = await getDB();
  db.todos.push(data);
  await saveDB(db);
  return data;
};

export const getLastId = async (id) => {
  const db = await getDB();
  return db.todos.length === 0 ? 0 : db.todos[db.todos.length - 1].id;
};
