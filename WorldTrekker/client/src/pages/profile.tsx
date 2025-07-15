import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Globe, User, Star, MapPin, Edit, Save, X, Home, Calendar } from "lucide-react";
import type { User as UserType, Review } from "@shared/schema";

export default function Profile() {
  const params = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserType>>({});

  const profileUserId = params.userId || currentUser?.id;
  const isOwnProfile = currentUser?.id === profileUserId;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
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
  }, [isAuthenticated, toast]);

  const { data: profileUser, isLoading: isUserLoading } = useQuery({
    queryKey: ["/api/profile", profileUserId],
    enabled: !!profileUserId,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) return false;
      return failureCount < 3;
    },
  });

  const { data: userReviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["/api/reviews/user", profileUserId],
    enabled: !!profileUserId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserType>) => {
      return await apiRequest("/api/profile", "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
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
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Profile Not Found</h3>
              <p className="text-gray-600">This profile doesn't exist or is private.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditForm({
      username: profileUser.username || "",
      firstName: profileUser.firstName || "",
      lastName: profileUser.lastName || "",
      bio: profileUser.bio || "",
      homeCountry: profileUser.homeCountry || "",
      homeCity: profileUser.homeCity || "",
      isProfilePublic: profileUser.isProfilePublic ?? true,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const getInitials = (user: UserType) => {
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || user.username?.[0]?.toUpperCase() || "U";
  };

  const averageRating = userReviews?.reduce((sum: number, review: Review) => sum + review.rating, 0) / (userReviews?.length || 1);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => window.history.back()}>
          ← Back
        </Button>
        {isOwnProfile && !isEditing && (
          <Button onClick={handleStartEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
        {isEditing && (
          <div className="space-x-2">
            <Button onClick={handleSaveEdit} disabled={updateProfileMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileUser.profileImageUrl || ""} />
              <AvatarFallback className="text-lg">{getInitials(profileUser)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editForm.firstName || ""}
                        onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editForm.lastName || ""}
                        onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editForm.username || ""}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio || ""}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      maxLength={200}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="homeCountry">Home Country</Label>
                      <Input
                        id="homeCountry"
                        value={editForm.homeCountry || ""}
                        onChange={(e) => setEditForm({...editForm, homeCountry: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="homeCity">Home City</Label>
                      <Input
                        id="homeCity"
                        value={editForm.homeCity || ""}
                        onChange={(e) => setEditForm({...editForm, homeCity: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isProfilePublic"
                      checked={editForm.isProfilePublic ?? true}
                      onCheckedChange={(checked) => setEditForm({...editForm, isProfilePublic: checked})}
                    />
                    <Label htmlFor="isProfilePublic">Make profile public</Label>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profileUser.firstName || profileUser.lastName 
                      ? `${profileUser.firstName || ""} ${profileUser.lastName || ""}`.trim()
                      : profileUser.username || "Explorer"}
                  </h1>
                  {profileUser.username && (
                    <p className="text-gray-600">@{profileUser.username}</p>
                  )}
                  {profileUser.bio && (
                    <p className="text-gray-700 mt-2">{profileUser.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    {profileUser.homeCountry && (
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        {profileUser.homeCity ? `${profileUser.homeCity}, ${profileUser.homeCountry}` : profileUser.homeCountry}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(profileUser.createdAt).toLocaleDateString()}
                    </div>
                    {userReviews && userReviews.length > 0 && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {averageRating.toFixed(1)} avg rating ({userReviews.length} reviews)
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Reviews ({userReviews?.length || 0})</TabsTrigger>
          <TabsTrigger value="stats">Travel Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="space-y-4">
          {isReviewsLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : userReviews && userReviews.length > 0 ? (
            userReviews.map((review: Review) => (
              <Card key={review.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{review.countryName}</CardTitle>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{review.reviewText}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Reviews Yet</h3>
                  <p className="text-gray-600">
                    {isOwnProfile ? "Start exploring countries to leave your first review!" : "This user hasn't written any reviews yet."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Countries Visited
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {profileUser.visitedCountries?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Total Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {userReviews?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Explorer Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {profileUser.points || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {profileUser.favoriteDestinations && profileUser.favoriteDestinations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Favorite Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileUser.favoriteDestinations.map((destination, index) => (
                    <Badge key={index} variant="secondary">
                      {destination}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {profileUser.badges && profileUser.badges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileUser.badges.map((badge, index) => (
                    <Badge key={index} variant="outline">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}