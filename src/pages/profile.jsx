import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe, updateMe, becomeSeller } from "../api/users";
import {
  Avatar,
  Badge,
  Button,
  Card,
  ErrorState,
  Input,
  PageHeader,
  Skeleton,
  Textarea,
  useToast,
} from "../components/ui";

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <Skeleton className="mb-8 h-10 w-48" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
}

export default function Profile() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [becomingSeller, setBecomingSeller] = useState(false);

  const [shopName, setShopName] = useState("");
  const [shopBio, setShopBio] = useState("");
  const [shopLocation, setShopLocation] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMe();
      setUser(data);
      setShopName(data.shop?.name ?? "");
      setShopBio(data.shop?.bio ?? "");
      setShopLocation(data.shop?.location ?? "");
    } catch {
      setError("Could not load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const payload = {
        shop: {
          name: shopName.trim(),
          bio: shopBio.trim(),
          location: shopLocation.trim(),
        },
      };
      const updated = await updateMe(payload);
      setUser(updated);
      toast("Profile updated", "success");
    } catch {
      toast("Could not save profile. Check your inputs and try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleBecomeSeller = async () => {
    setBecomingSeller(true);
    try {
      const updated = await becomeSeller({
        shopName: shopName.trim() || user?.username,
        bio: shopBio.trim(),
        location: shopLocation.trim(),
      });
      setUser(updated);
      setShopName(updated.shop?.name ?? "");
      toast("You're now a seller — start listing from Sell", "success");
    } catch {
      toast("Could not enable seller account", "error");
    } finally {
      setBecomingSeller(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <ErrorState title="Profile unavailable" description={error} onRetry={loadProfile} />
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <PageHeader
        title="Your profile"
        description="Manage your account details and artisan shop."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
        <Card className="flex h-fit flex-col items-center p-6 text-center md:p-8">
          <Avatar
            name={user.username}
            email={user.email}
            size="xl"
            letterOnly
            className="h-32 w-32 text-5xl"
          />
          <h2 className="mt-5 font-serif text-xl font-semibold text-text-primary">{user.username}</h2>
          <p className="mt-1 text-sm text-text-secondary">{user.email}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {user.isSeller ? (
              <Badge variant="accent">Seller</Badge>
            ) : (
              <Badge variant="default">Buyer</Badge>
            )}
            {user.role === "admin" && <Badge variant="warm">Admin</Badge>}
          </div>

          {memberSince && (
            <p className="mt-5 text-xs text-text-secondary">Member since {memberSince}</p>
          )}

          {user.isSeller && (
            <Button to="/seller" variant="outline" size="sm" className="mt-6 w-full">
              Open dashboard
            </Button>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-text-primary">Account</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Your avatar uses the first letter of your username, or email if needed.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSave}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Username" value={user.username} disabled readOnly />
                <Input label="Email" type="email" value={user.email} disabled readOnly />
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-text-secondary">
                  Account details are managed securely and cannot be changed here.
                </p>
                <Button type="submit" variant="warm" size="md" disabled={saving} className="sm:min-w-[140px]">
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6 md:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Shop</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {user.isSeller
                    ? "How buyers see your artisan shop on product listings."
                    : "Enable selling to list handmade products on HandeMade."}
                </p>
              </div>
              {!user.isSeller && (
                <Badge variant="default" className="w-fit shrink-0">
                  Not a seller yet
                </Badge>
              )}
            </div>

            <div className="mt-6 space-y-5">
              <Input
                label="Shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={user.username}
              />
              <Textarea
                label="Shop bio"
                value={shopBio}
                onChange={(e) => setShopBio(e.target.value)}
                placeholder="Tell buyers about your craft, materials, and process…"
                rows={4}
              />
              <Input
                label="Location"
                value={shopLocation}
                onChange={(e) => setShopLocation(e.target.value)}
                placeholder="City, Country"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              {user.isSeller ? (
                <>
                  <p className="text-sm text-text-secondary">
                    List new products from the{" "}
                    <Link to="/sell" className="font-medium text-accent hover:underline">
                      Sell page
                    </Link>
                    .
                  </p>
                  <Button
                    type="button"
                    variant="warm"
                    size="md"
                    disabled={saving}
                    onClick={handleSave}
                    className="sm:min-w-[140px]"
                  >
                    {saving ? "Saving…" : "Save shop"}
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-text-secondary">
                    Free to join — your first listing takes minutes.
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    disabled={becomingSeller}
                    onClick={handleBecomeSeller}
                    className="sm:min-w-[160px]"
                  >
                    {becomingSeller ? "Enabling…" : "Become a seller"}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
