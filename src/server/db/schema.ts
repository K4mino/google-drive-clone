import { bigint, index, singlestoreTableCreator, timestamp } from "drizzle-orm/singlestore-core";
import { int, text, singlestoreTable } from "drizzle-orm/singlestore-core";

const createTable = singlestoreTableCreator(
  (name) => `google_drive_${name}`
)

export const files_table = createTable("files_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  ownerId:text("owenerId").notNull(),
  name: text("name").notNull(),
  size: int("size").notNull(),
  url: text("url").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow()
},
  (t) => {
    return [index("parent_index").on(t.parent),index("owner_index").on(t.ownerId)]
  })

export const folders_table = createTable("folders_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  ownerId:text("owenerId").notNull(),
  name: text("name").notNull(),
  parent: bigint("parent", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").notNull().defaultNow()
},
  (t) => {
    return [index("parent_index").on(t.parent),index("owner_index").on(t.ownerId)]
  })
