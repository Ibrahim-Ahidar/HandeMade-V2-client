import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  banAdminProduct,
  deleteAdminProduct,
  deleteAdminUser,
  getAdminProducts,
  getAdminStats,
  getAdminUsers,
  updateAdminProduct,
  updateAdminUser,
} from "../../api/admin";
import { formatPrice } from "../../utils/formatPrice";
import {
  Badge,
  Button,
  Card,
  ErrorState,
  Modal,
  PageHeader,
  SearchBar,
  Select,
  Skeleton,
  Tabs,
  useToast,
} from "../ui";

const ADMIN_TABS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "products", label: "Products" },
];

function StatCard({ label, value }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
    </Card>
  );
}

function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

function AdminDashboard() {
  const { toast } = useToast();
  const { user: currentUser } = useCurrentUser();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [productStatus, setProductStatus] = useState("all");
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const loadStats = useCallback(async () => {
    const data = await getAdminStats();
    setStats(data);
  }, []);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = { limit: 50 };
      if (userQuery.trim()) params.q = userQuery.trim();
      if (userFilter === "seller") params.isSeller = "true";
      if (userFilter === "buyer") params.isSeller = "false";
      if (userFilter === "admin") params.role = "admin";
      if (userFilter === "banned") params.isBanned = "true";
      const data = await getAdminUsers(params);
      setUsers(data.users);
    } catch {
      toast("Could not load users", "error");
    } finally {
      setUsersLoading(false);
    }
  }, [userQuery, userFilter, toast]);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const params = { limit: 50 };
      if (productQuery.trim()) params.q = productQuery.trim();
      if (productStatus !== "all") params.status = productStatus;
      const data = await getAdminProducts(params);
      setProducts(data.products);
    } catch {
      toast("Could not load products", "error");
    } finally {
      setProductsLoading(false);
    }
  }, [productQuery, productStatus, toast]);

  const loadUsersRef = useRef(loadUsers);
  loadUsersRef.current = loadUsers;

  const loadProductsRef = useRef(loadProducts);
  loadProductsRef.current = loadProducts;

  useEffect(() => {
    let active = true;
    setStatsLoading(true);
    setStatsError(null);

    loadStats()
      .catch(() => {
        if (active) {
          setStatsError("Could not load admin data. Check your permissions and try again.");
        }
      })
      .finally(() => {
        if (active) setStatsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadStats]);

  useEffect(() => {
    if (tab === "users") loadUsersRef.current();
  }, [tab, userFilter]);

  useEffect(() => {
    if (tab === "products") loadProductsRef.current();
  }, [tab, productStatus]);

  const runConfirmed = async () => {
    if (!confirm) return;
    const { type, id, payload } = confirm;
    setConfirm(null);
    try {
      if (type === "banUser") {
        await updateAdminUser(id, { isBanned: true });
        toast("User banned and signed out", "success");
        loadUsers();
        loadStats();
      } else if (type === "unbanUser") {
        await updateAdminUser(id, { isBanned: false });
        toast("User unbanned", "success");
        loadUsers();
        loadStats();
      } else if (type === "deleteUser") {
        await deleteAdminUser(id);
        toast("User and their listings deleted", "success");
        loadUsers();
        loadProducts();
        loadStats();
      } else if (type === "banProduct") {
        await banAdminProduct(id);
        toast("Product banned (archived)", "success");
        loadProducts();
        loadStats();
      } else if (type === "deleteProduct") {
        await deleteAdminProduct(id);
        toast("Product permanently deleted", "success");
        loadProducts();
        loadStats();
      } else if (type === "activateProduct") {
        await updateAdminProduct(id, { status: "active" });
        toast("Product activated", "success");
        loadProducts();
        loadStats();
      } else if (type === "userRole") {
        await updateAdminUser(id, payload);
        toast(`User role updated to ${payload.role}`, "success");
        loadUsers();
        loadStats();
      } else if (type === "userSeller") {
        await updateAdminUser(id, payload);
        toast(payload.isSeller ? "User promoted to seller" : "Seller access removed", "success");
        loadUsers();
        loadStats();
      }
    } catch (err) {
      toast(err?.response?.data?.message ?? "Action failed", "error");
    }
  };

  if (statsLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Skeleton className="mb-8 h-10 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <ErrorState
          title="Admin dashboard unavailable"
          description={statsError}
          onRetry={() => {
            setStatsLoading(true);
            setStatsError(null);
            loadStats()
              .catch(() => setStatsError("Could not load admin data. Check your permissions and try again."))
              .finally(() => setStatsLoading(false));
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <PageHeader
        title="Platform control"
        description={`Signed in as ${currentUser?.username ?? "admin"}. Manage users, sellers, and listings.`}
      />

      <Tabs tabs={ADMIN_TABS} active={tab} onChange={setTab} className="mb-8 max-w-xl" />

      {tab === "overview" && stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          <StatCard label="Total users" value={stats.totalUsers} />
          <StatCard label="Sellers" value={stats.totalSellers} />
          <StatCard label="Buyers" value={stats.totalBuyers} />
          <StatCard label="Banned" value={stats.bannedUsers} />
          <StatCard label="Products" value={stats.totalProducts} />
          <StatCard label="Active listings" value={stats.activeProducts} />
          <StatCard label="Banned listings" value={stats.archivedProducts} />
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchBar
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") loadUsers();
              }}
              placeholder="Search users by name or email…"
              className="flex-1"
            />
            <Select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="sm:max-w-[180px]"
              aria-label="Filter users"
            >
              <option value="all">All users</option>
              <option value="seller">Sellers only</option>
              <option value="buyer">Buyers only</option>
              <option value="admin">Admins only</option>
              <option value="banned">Banned only</option>
            </Select>
            <Button type="button" variant="outline" size="md" onClick={loadUsers} disabled={usersLoading}>
              {usersLoading ? "Searching…" : "Search"}
            </Button>
          </div>

          <Card className="overflow-x-auto">
            {usersLoading ? (
              <TableSkeleton />
            ) : (
              <>
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-bg-muted/50 text-xs uppercase tracking-wider text-text-secondary">
                    <tr>
                      <th className="px-4 py-3 font-semibold">User</th>
                      <th className="px-4 py-3 font-semibold">Role</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Joined</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-4">
                          <p className="font-medium text-text-primary">{user.username}</p>
                          <p className="text-xs text-text-secondary">{user.email}</p>
                          {user.shop?.name && (
                            <p className="mt-1 text-xs text-text-secondary">Shop: {user.shop.name}</p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant={user.role === "admin" ? "warm" : "default"}>
                              {user.role}
                            </Badge>
                            {user.isSeller && <Badge variant="accent">seller</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={user.isBanned ? "danger" : "default"}>
                            {user.isBanned ? "Banned" : "Active"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-text-secondary">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-4">
                          {user.id === currentUser?.id ? (
                            <span className="text-xs text-text-secondary">This is you</span>
                          ) : user.role === "admin" ? (
                            <span className="text-xs text-text-secondary">Protected admin</span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {user.isBanned ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setConfirm({ type: "unbanUser", id: user.id, label: user.username })
                                  }
                                >
                                  Unban
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setConfirm({ type: "banUser", id: user.id, label: user.username })
                                  }
                                >
                                  Ban
                                </Button>
                              )}
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setConfirm({
                                    type: "userSeller",
                                    id: user.id,
                                    payload: { isSeller: !user.isSeller },
                                    label: user.username,
                                  })
                                }
                              >
                                {user.isSeller ? "Revoke seller" : "Make seller"}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="danger"
                                onClick={() =>
                                  setConfirm({ type: "deleteUser", id: user.id, label: user.username })
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-text-secondary">No users found.</p>
                )}
              </>
            )}
          </Card>
        </div>
      )}

      {tab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchBar
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") loadProducts();
              }}
              placeholder="Search products…"
              className="flex-1"
            />
            <Select
              value={productStatus}
              onChange={(e) => setProductStatus(e.target.value)}
              className="sm:max-w-[180px]"
              aria-label="Filter products by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="sold_out">Sold out</option>
              <option value="archived">Banned / archived</option>
            </Select>
            <Button type="button" variant="outline" size="md" onClick={loadProducts} disabled={productsLoading}>
              {productsLoading ? "Searching…" : "Search"}
            </Button>
          </div>

          <Card className="overflow-x-auto">
            {productsLoading ? (
              <TableSkeleton />
            ) : (
              <>
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-bg-muted/50 text-xs uppercase tracking-wider text-text-secondary">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">Seller</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-4">
                          <p className="font-medium text-text-primary">{product.name}</p>
                          <p className="text-xs text-text-secondary">{product.category}</p>
                        </td>
                        <td className="px-4 py-4 text-text-secondary">
                          {product.artisan?.name ?? "—"}
                        </td>
                        <td className="px-4 py-4">{formatPrice(product.price)}</td>
                        <td className="px-4 py-4">{product.stock}</td>
                        <td className="px-4 py-4">
                          <Badge variant={product.status === "active" ? "accent" : "default"}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {product.status !== "active" && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setConfirm({
                                    type: "activateProduct",
                                    id: product.id,
                                    label: product.name,
                                  })
                                }
                              >
                                Activate
                              </Button>
                            )}
                            {product.status !== "archived" && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setConfirm({
                                    type: "banProduct",
                                    id: product.id,
                                    label: product.name,
                                  })
                                }
                              >
                                Ban
                              </Button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                setConfirm({
                                  type: "deleteProduct",
                                  id: product.id,
                                  label: product.name,
                                })
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-text-secondary">No products found.</p>
                )}
              </>
            )}
          </Card>
        </div>
      )}

      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        title="Confirm action"
      >
        <p className="text-sm text-text-secondary">
          {confirm?.type === "deleteUser" &&
            `Permanently delete "${confirm.label}" and all their listings? This cannot be undone.`}
          {confirm?.type === "banUser" &&
            `Ban "${confirm.label}"? They will be signed out and cannot log in again until unbanned.`}
          {confirm?.type === "unbanUser" && `Unban "${confirm.label}" and restore access?`}
          {confirm?.type === "banProduct" &&
            `Ban "${confirm.label}"? It will be hidden from the marketplace.`}
          {confirm?.type === "deleteProduct" &&
            `Permanently delete "${confirm.label}"? This cannot be undone.`}
          {confirm?.type === "activateProduct" && `Restore "${confirm.label}" to active listings?`}
          {confirm?.type === "userSeller" && `Update seller status for "${confirm.label}"?`}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={confirm?.type?.includes("delete") ? "danger" : "primary"}
            onClick={runConfirmed}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default memo(AdminDashboard);
