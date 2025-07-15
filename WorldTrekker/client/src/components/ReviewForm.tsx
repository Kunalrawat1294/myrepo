import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Star, MessageSquare } from "lucide-react";
import type { Country } from "@/types/country";

interface ReviewFormProps {
  country: Country;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ country, onReviewSubmitted }: ReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: {
      countryId: string;
      countryName: string;
      rating: number;
      reviewText: string;
      isAnonymous: boolean;
    }) => {
      return await apiRequest("/api/reviews", "POST", reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/country"] });
      setRating(0);
      setReviewText("");
      setIsAnonymous(false);
      setHoverRating(0);
      toast({
        title: "Review Posted!",
        description: "Thank you for sharing your experience.",
      });
      onReviewSubmitted?.();
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to post review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (reviewText.trim().length === 0) {
      toast({
        title: "Review Required",
        description: "Please write a review before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (reviewText.length > 250) {
      toast({
        title: "Review Too Long",
        description: "Please keep your review under 250 characters.",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      countryId: country.name.common.toLowerCase().replace(/\s+/g, '-'),
      countryName: country.name.common,
      rating,
      reviewText: reviewText.trim(),
      isAnonymous,
    });
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Share Your Experience
          </CardTitle>
          <CardDescription>
            Sign in to leave a review about {country.name.common}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/api/login'} className="w-full">
            Sign In to Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Share Your Experience
        </CardTitle>
        <CardDescription>
          Have you visited {country.name.common}? Share your thoughts!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <Label className="text-sm font-medium">Rating</Label>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <Label htmlFor="reviewText" className="text-sm font-medium">
              Your Review
            </Label>
            <Textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell others about your experience visiting this country..."
              className="mt-1"
              maxLength={250}
              rows={3}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {reviewText.length}/250 characters
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Post anonymously
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={createReviewMutation.isPending || rating === 0 || reviewText.trim().length === 0}
            className="w-full"
          >
            {createReviewMutation.isPending ? "Posting..." : "Post Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}