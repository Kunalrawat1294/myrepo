// Make REPLIT_DOMAINS optional for non-Replit environments
const replitDomains = process.env.REPLIT_DOMAINS || "localhost:5000";

  for (const domain of replitDomains.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,