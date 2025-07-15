import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  serial,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username", { length: 50 }).unique(),
  bio: text("bio"),
  homeCountry: varchar("home_country"),
  homeCity: varchar("home_city"),
  visitedCountries: text("visited_countries").array(),
  wishlistCountries: text("wishlist_countries").array(),
  favoriteDestinations: text("favorite_destinations").array(),
  points: integer("points").default(0),
  badges: text("badges").array(),
  isProfilePublic: integer("is_profile_public").default(1), // 1 for true, 0 for false
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  countryId: varchar("country_id").notNull(),
  countryName: varchar("country_name").notNull(),
  rating: integer("rating").notNull(), // 1-5
  reviewText: text("review_text").notNull(),
  isAnonymous: integer("is_anonymous").default(0), // 1 for true, 0 for false
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviews).pick({
  countryId: true,
  countryName: true,
  rating: true,
  reviewText: true,
  isAnonymous: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
