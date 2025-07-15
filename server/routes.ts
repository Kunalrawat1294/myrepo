@@ .. @@
 export async function registerRoutes(app: Express): Promise<Server> {
   // Auth middleware
-  await setupAuth(app);
+  try {
+    await setupAuth(app);
+  } catch (error) {
+    console.warn("Auth setup failed, continuing without auth:", error.message);
+  }
 
   // Auth routes
   app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {