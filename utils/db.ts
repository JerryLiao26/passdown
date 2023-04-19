import { DB } from "$sqlite/mod.ts";

function prepareDB(tableName: string) {
  const db = new DB("postdown.db");
  switch (tableName) {
    case "User":
      db.execute(`
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(128),
          email VARCHAR(128),
          password TEXT
        )
      `);
      break;
    case "Token":
      db.execute(`
        CREATE TABLE IF NOT EXISTS session (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          token VARCHAR(128),
        )
      `);
      break;
  }
  return db;
}

export function find(
  tableName: string,
  queryObject: { [key: string]: string | number }
) {
  const db = prepareDB(tableName);
  const queryConditions = Object.keys(queryObject).map((queryKey) =>
    typeof queryObject[queryKey] === "number"
      ? `${queryKey}=${queryObject[queryKey]}`
      : `${queryKey}="${queryObject[queryKey]}"`
  );
  return db.query(
    `SELECT * FROM ${tableName.toLowerCase()} WHERE ${queryConditions.join(
      " AND "
    )}`
  );
}
