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
          password TEXT,
          created DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated DATETIME,
          UNIQUE(name)
        )
      `);
      break;
    case "Token":
      db.execute(`
        CREATE TABLE IF NOT EXISTS token (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          token VARCHAR(128),
          created DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated DATETIME
        )
      `);
      break;
    case "Post":
      db.execute(`
        CREATE TABLE IF NOT EXISTS post (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          title VARCHAR(256),
          content TEXT,
          shared BOOLEAN,
          created DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated DATETIME
        )
      `);
  }
  return db;
}

export function find(
  tableName: string,
  queryObject: { [key: string]: string | number | boolean },
  targetKeys: string[] = [],
  limit?: number
) {
  const db = prepareDB(tableName);
  const findQuery = db.prepareQuery(
    `SELECT ${
      targetKeys.length > 0 ? targetKeys.join(", ") : "*"
    } FROM ${tableName.toLowerCase()} WHERE ${Object.keys(queryObject)
      .map((queryKey) => `${queryKey} = :${queryKey}`)
      .join(" AND ")} ORDER BY updated DESC ${limit ? ` LIMIT ${limit}` : ""}`
  );
  try {
    return findQuery.all(queryObject);
  } catch (e) {
    console.error("Find error:", e);
    return [];
  } finally {
    findQuery.finalize();
    db.close();
  }
}

export function insert(
  tableName: string,
  userInsertObject: { [key: string]: string | number | boolean }
) {
  const db = prepareDB(tableName);
  const insertObject = { ...userInsertObject, updated: new Date() };
  const insertQuery = db.prepareQuery(
    `INSERT INTO ${tableName.toLowerCase()} (${Object.keys(insertObject).join(
      ", "
    )}) VALUES (${Object.keys(insertObject)
      .map((key) => `:${key}`)
      .join(", ")})`
  );
  try {
    insertQuery.all(insertObject);
    return find(tableName, userInsertObject, ["id"], 1);
  } catch (e) {
    console.error("Insert error:", e);
    return [];
  } finally {
    insertQuery.finalize();
    db.close();
  }
}

export function update(
  tableName: string,
  id: number,
  userUpdateObject: { [key: string]: string | number | boolean }
) {
  const db = prepareDB(tableName);
  const updateObject = { ...userUpdateObject, updated: new Date() };
  const updateQuery = db.prepareQuery(
    `UPDATE ${tableName.toLowerCase()} SET ${Object.keys(updateObject)
      .map((updateKey) => `${updateKey} = :${updateKey}`)
      .join(", ")} WHERE id=${id}`
  );
  try {
    updateQuery.all(updateObject);
    return find(tableName, userUpdateObject, ["id"], 1);
  } catch (e) {
    console.error("Insert error:", e);
    return [];
  } finally {
    updateQuery.finalize();
    db.close();
  }
}

export function del(
  tableName: string,
  queryObject: { [key: string]: string | number | boolean }
) {
  const db = prepareDB(tableName);
  const deleteQuery = db.prepareQuery(
    `DELETE FROM ${tableName.toLowerCase()} WHERE ${Object.keys(queryObject)
      .map((queryKey) => `${queryKey} = :${queryKey}`)
      .join(" AND ")}`
  );
  try {
    return deleteQuery.all(queryObject);
  } catch (e) {
    console.error("Insert error:", e);
    return [];
  } finally {
    deleteQuery.finalize();
    db.close();
  }
}
