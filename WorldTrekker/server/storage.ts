import {
  users,
  reviews,
  type User,
  type UpsertUser,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, avg, count } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Profile operations
  updateUserProfile(id: string, profileData: Partial<User>): Promise<User>;
  
  // Review operations
  createReview(userId: string, review: InsertReview): Promise<Review>;
  getCountryReviews(countryId: string, limit?: number): Promise<Review[]>;
  getCountryReviewStats(countryId: string): Promise<{ averageRating: number; totalReviews: number }>;
  getUserReviews(userId: string): Promise<Review[]>;
  deleteReview(reviewId: number, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Profile operations
  async updateUserProfile(id: string, profileData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Review operations
  async createReview(userId: string, review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values({ ...review, userId })
      .returning();
    return newReview;
  }

  async getCountryReviews(countryId: string, limit: number = 10): Promise<Review[]> {
    const countryReviews = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        countryId: reviews.countryId,
        countryName: reviews.countryName,
        rating: reviews.rating,
        reviewText: reviews.reviewText,
        isAnonymous: reviews.isAnonymous,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.countryId, countryId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
    
    return countryReviews.map(review => ({
      ...review,
      // Hide user info if anonymous
      username: review.isAnonymous ? null : review.username,
      firstName: review.isAnonymous ? null : review.firstName,
      lastName: review.isAnonymous ? null : review.lastName,
      profileImageUrl: review.isAnonymous ? null : review.profileImageUrl,
    })) as Review[];
  }

  async getCountryReviewStats(countryId: string): Promise<{ averageRating: number; totalReviews: number }> {
    const [stats] = await db
      .select({
        averageRating: avg(reviews.rating),
        totalReviews: count(reviews.id),
      })
      .from(reviews)
      .where(eq(reviews.countryId, countryId));
    
    return {
      averageRating: Number(stats.averageRating) || 0,
      totalReviews: Number(stats.totalReviews) || 0,
    };
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async deleteReview(reviewId: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(reviews)
      .where(eq(reviews.id, reviewId) && eq(reviews.userId, userId));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
