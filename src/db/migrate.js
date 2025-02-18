// src/db/migrate.js

const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const postgres = require("postgres");

const runMigration = async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

  console.log(process.env.DATABASE_URL);

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: "drizzle" });
  await sql.end();
};

runMigration()
  .then(() => {
    console.log("Successfully ran migration.");

    process.exit(0);
  })
  .catch((e) => {
    console.error("Failed to run migration.");
    console.error(e);

    process.exit(1);
  });
