import { drizzle } from "drizzle-orm/singlestore";

import { env } from "~/env";
import * as schema from "./schema";
import { createPool, type Pool } from "mysql2/promise";
/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn = globalForDb.conn ?? createPool({
    host:env.SINGLE_STORE_HOST,
    port:parseInt(env.SINGLE_STORE_PORT),
    user:env.SINGLE_STORE_USER,
    password:env.SINGLE_STORE_PASSWORD,
    database:env.SINGLE_STORE_DATABASE,
    ssl:{},
    maxIdle:0
})
if(env.NODE_ENV !== "production") globalForDb.conn = conn;

conn.addListener("error",(error) => {
  console.log('ERROR CONNECTING TO DB: ',error)
})


export const db = drizzle(conn, { schema }); 
