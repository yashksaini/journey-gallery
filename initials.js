const dbName = "ievents";
const dbversion = "1.0";
const dbDescription = "Add images in the calendar";
const dbSize = 500 * 1024 * 1024; // 500MB Size
let db = openDatabase(dbName, dbversion, dbDescription, dbSize);

// To create tables when no tables in the database
db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY,date,image)"
  );
});
