// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// if the code tries to 'await' the result of db.select().from(), it will
// break because you can't await a non-Promise value.

// this solution ensures that it behaves more like the real db client
const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return {
      select: () => ({
        from: () => Promise.resolve([]),
      }),
      insert: () => ({
        values: () => ({
          returning: () => Promise.resolve([]),
        }),
      }),
    };
  }

  // configure connection pooling properly
  const queryClient = postgres(process.env.DATABASE_URL, {
    max: 10, // maximum number of connections
    idle_timeout: 30, // Timeout after 30 seconds of inactivity
  });

  const db = drizzle(queryClient);
  return db;
};

export default setup();
