"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { getCheckoutUrl, getPortalUrl } from "./stripePayment";
import { getSubscriptionStatus } from "./getPremiumStatus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initFirebase } from "@/firebase";
import "../../../styles/Account.scss";

export default function AccountPage() {
  const app = initFirebase();
  const auth = getAuth(app);
  const router = useRouter();

  // State declarations
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [newUserName, setNewUserName] = useState<string>("");
  const [newBio, setNewBio] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load user data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
        setEmail(user.email);
        setAvatarUrl(user.photoURL || "");
      } else {
        router.push("/pages/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  // Load subscription data
  useEffect(() => {
    const loadSubscriptions = async () => {
      if (auth.currentUser) {
        const activeSubscriptions = await getSubscriptionStatus(app);
        setSubscriptions(activeSubscriptions);
      }
    };

    loadSubscriptions();
  }, [app, auth.currentUser]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || !event.target.files[0]) return;
    setIsUploadingImage(true);

    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("gid", auth.currentUser?.uid || "");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const { url } = await response.json();

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: url,
        });
        setAvatarUrl(url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: newUserName || userName,
        });
        setBio(newBio);
        setIsEditing(false);
        setUserName(newUserName);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/pages/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpgradeToSubscription = async (priceId: string) => {
    const checkoutUrl = await getCheckoutUrl(app, priceId);
    router.push(checkoutUrl);
  };

  const handleManageSubscription = async () => {
    const portalUrl = await getPortalUrl(app);
    router.push(portalUrl);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page">
      <div className="account-container">
        <div className="profile-section">
          <div className="avatar-section">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{userName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Input
              accept="image/*"
              className="hidden"
              disabled={isUploadingImage}
              id="avatar-upload"
              onChange={handleImageUpload}
              type="file"
            />
            <Button
              color="primary"
              disabled={isUploadingImage}
              onClick={() => document.getElementById("avatar-upload")?.click()}
              variant="ghost"
            >
              {isUploadingImage ? "Uploading..." : "Change Avatar"}
            </Button>
          </div>

          {isEditing ? (
            <div className="edit-profile">
              <Input
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Username"
                value={newUserName}
              />
              <Textarea
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Bio"
                value={newBio}
              />
              <div className="edit-actions">
                <Button
                  color="primary"
                  onClick={handleUpdateProfile}
                  variant="ghost"
                >
                  Save
                </Button>
                <Button
                  className="red-outline-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <h2>{userName}</h2>
              <p className="email">{email}</p>
              <p className="bio">{bio || "No bio yet"}</p>
              <Button
                color="primary"
                onClick={() => {
                  setIsEditing(true);
                  setNewUserName(userName || "");
                  setNewBio(bio);
                }}
                variant="ghost"
              >
                Edit Profile
              </Button>
            </div>
          )}

          <div className="subscription-section">
            <h3>Available Plans</h3>
            <div className="plans-grid">
              <Button
                color="primary"
                onClick={() => handleUpgradeToSubscription("price_basic")}
                variant="ghost"
              >
                Basic Plan - $6/month
              </Button>
              <Button
                color="primary"
                onClick={() => handleUpgradeToSubscription("price_premium")}
                variant="ghost"
              >
                Premium Plan - $12/month
              </Button>
              <Button
                color="primary"
                onClick={() => handleUpgradeToSubscription("price_extra")}
              >
                Extra Plan - $18/month
              </Button>
            </div>
            <Button
              className="red-outline-button"
              onClick={handleManageSubscription}
            >
              Manage Subscription
            </Button>
          </div>

          <Button className="red-button" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
