@@ .. @@
 import ws from "ws";
 import * as schema from "@shared/schema";
 
 neonConfig.webSocketConstructor = ws;
 
 if (!process.env.DATABASE_URL) {
-  throw new Error(
-    "DATABASE_URL must be set. Did you forget to provision a database?",
-  );
+  console.warn("DATABASE_URL not set, using fallback configuration");
+  process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/worldtrekker";
 }
 
 export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
 export const db = drizzle({ client: pool, schema });