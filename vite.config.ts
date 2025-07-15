@@ .. @@
   resolve: {
     alias: {
       "@": path.resolve(import.meta.dirname, "client", "src"),
       "@shared": path.resolve(import.meta.dirname, "shared"),
-      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
     },
   },
   root: path.resolve(import.meta.dirname, "client"),