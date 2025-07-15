import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MessageSquare, User } from "lucide-react";
import type { Country } from "@/types/country";
import type { Review } from "@shared/schema";

interface ReviewListProps {
  country: Country;
}

export function ReviewList({ country }: ReviewListProps) {
  const countryId = country.name.common.toLowerCase().replace(/\s+/g, '-');
  
  const { data: reviewData, isLoading } = useQuery({
    queryKey: ["/api/reviews/country", countryId],
    retry: 3,
  });

  const reviews = reviewData?.reviews || [];
  const stats = reviewData?.stats || { averageRating: 0, totalReviews: 0 };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getInitials = (review: Review) => {
    if (review.isAnonymous || !review.firstName || !review.lastName) {
      return "A";
    }
    return (review.firstName[0] + review.lastName[0]).toUpperCase();
  };

  const getDisplayName = (review: Review) => {
    if (review.isAnonymous) {
      return "Anonymous";
    }
    if (review.firstName && review.lastName) {
      return `${review.firstName} ${review.lastName}`;
    }
    return review.username || "Explorer";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Community Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Community Reviews
        </CardTitle>
        {stats.totalReviews > 0 && (
          <CardDescription className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(stats.averageRating))}
              <span className="ml-2 font-medium">{stats.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-500">
              ({stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''})
            </span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: Review) => (
              <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.isAnonymous ? "" : review.profileImageUrl || ""} />
                    <AvatarFallback>
                      {review.isAnonymous ? <User className="h-4 w-4" /> : getInitials(review)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {getDisplayName(review)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {review.isAnonymous && (
                        <Badge variant="secondary" className="text-xs">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {review.reviewText}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-600">
              Be the first to share your experience about {country.name.common}!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}