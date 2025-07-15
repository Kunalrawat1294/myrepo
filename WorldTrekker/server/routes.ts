import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = req.body;
      
      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete profileData.id;
      delete profileData.createdAt;
      delete profileData.updatedAt;
      
      const updatedUser = await storage.updateUserProfile(userId, profileData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get('/api/profile/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only return public profile info
      const publicProfile = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
        homeCountry: user.homeCountry,
        homeCity: user.homeCity,
        visitedCountries: user.visitedCountries,
        favoriteDestinations: user.favoriteDestinations,
        points: user.points,
        badges: user.badges,
        isProfilePublic: user.isProfilePublic,
        createdAt: user.createdAt,
      };
      
      // Only show profile if it's public or if it's the user's own profile
      const isOwnProfile = req.user && (req.user as any).claims?.sub === userId;
      if (!user.isProfilePublic && !isOwnProfile) {
        return res.status(403).json({ message: "Profile is private" });
      }
      
      res.json(publicProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Review routes
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Limit review text length
      if (reviewData.reviewText.length > 250) {
        return res.status(400).json({ message: "Review text must be 250 characters or less" });
      }
      
      const review = await storage.createReview(userId, reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/reviews/country/:countryId', async (req, res) => {
    try {
      const { countryId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const [reviews, stats] = await Promise.all([
        storage.getCountryReviews(countryId, limit),
        storage.getCountryReviewStats(countryId)
      ]);
      
      res.json({ reviews, stats });
    } catch (error) {
      console.error("Error fetching country reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/reviews/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const reviews = await storage.getUserReviews(userId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  app.delete('/api/reviews/:reviewId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewId = parseInt(req.params.reviewId);
      
      const success = await storage.deleteReview(reviewId, userId);
      if (success) {
        res.json({ message: "Review deleted successfully" });
      } else {
        res.status(404).json({ message: "Review not found or unauthorized" });
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
