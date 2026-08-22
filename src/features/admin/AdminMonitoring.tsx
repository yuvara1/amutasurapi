import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, AlertTriangle, Filter, Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/* ── Generate large realistic dataset ── */
const donors = ["Green Harvest Co.", "Metro Grocery", "Grand Hotel", "City Bakehouse", "MegaMart", "Fresh Fields Market", "Sunrise Bakery", "Bay Area Catering", "Golden Gate Deli", "Pacific Foods", "Harbor Restaurant", "Mission Street Café", "North Beach Bistro", "Embarcadero Eats", "SoMa Kitchen"];
const ngos = ["Community Kitchen", "Hope Foundation", "City Shelter", "Faith Community", "Metro Food Bank", "Sunrise Care", "Bay Volunteers", "Family First NGO", "Ocean View Shelter", "Urban Harvest", "Mission Aid", "Tenderloin Outreach"];
const volunteers = ["Alex Rivera", "Maria Santos", "James Lee", "Priya Nair", "David Kim", "Sofia Chen", "Marcus Williams", "Elena Petrov", "Omar Hassan", "Lily Zhang", "Carlos Mendez", "Aisha Patel", "Tom Nakamura", "Grace O'Brien", "Raj Sharma"];
const foods = ["Assorted Produce · {n} kg", "Bread & Pastries · {n} kg", "Dairy Products · {n} kg", "Prepared Meals · {n} portions", "Canned Goods · {n} kg", "Baked Goods · {n} kg", "Fresh Fruits · {n} kg", "Cooked Rice & Beans · {n} kg", "Frozen Meat · {n} kg", "Mixed Sandwiches · {n} pcs"];
const statuses = ["published", "matched", "pickup", "delivered", "delivered", "delivered", "expired", "cancelled"] as const;
const delStatuses = ["accepted", "in_transit", "in_transit", "delivered", "delivered", "failed"] as const;

function rndN(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function daysAgo(n: number) { const d = new Date("2026-08-20"); d.setDate(d.getDate() - n); return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

const seed = 42;
function seededRandom(s: number) { let x = Math.sin(s) * 10000; return x - Math.floor(x); }

const donationRows = Array.from({ length: 180 }, (_, i) => {
  const r = (offset: number) => seededRandom(seed + i * 17 + offset);
  const idx = (offset: number, arr: readonly unknown[]) => Math.floor(r(offset) * arr.length);
  const status = statuses[idx(3, statuses)];
  const n = Math.floor(r(4) * 100) + 10;
  const foodTemplate = foods[idx(5, foods)];
  return {
    id: `DON-${String(2026_000_000 + i + 119).slice(4)}`,
    food: foodTemplate.replace("{n}", String(n)),
    donor: donors[idx(6, donors)],
    ngo: ["delivered", "pickup", "matched"].includes(status) ? ngos[idx(7, ngos)] : "—",
    status,
    expiry: status === "delivered" || status === "expired" ? "—" : `Aug ${20 + idx(8, [0,1,2,3,4])} ${["6PM","8PM","10PM","midnight"][idx(9, [0,1,2,3])]}`,
    created: i < 3 ? `${[2,5,22][i]}h ago` : daysAgo(Math.floor(r(10) * 30)),
  };
});

const deliveryRows = Array.from({ length: 120 }, (_, i) => {
  const r = (offset: number) => seededRandom(seed + i * 13 + offset);
  const idx = (offset: number, arr: readonly unknown[]) => Math.floor(r(offset) * arr.length);
  const status = delStatuses[idx(2, delStatuses)];
  const delayed = status === "in_transit" && r(3) > 0.75;
  const n = Math.floor(r(4) * 80) + 15;
  const foodTemplate = foods[idx(5, foods)];
  return {
    id: `DEL-${String(2026_000_000 + i + 80).slice(4)}`,
    food: foodTemplate.replace("{n}", String(n)),
    volunteer: volunteers[idx(6, volunteers)],
    pickup: donors[idx(7, donors)],
    dropoff: ngos[idx(8, ngos)],
    status,
    eta: status === "delivered" ? "—" : delayed ? `${Math.floor(r(9)*30)+45} min` : `${Math.floor(r(9)*50)+5} min`,
    delay: delayed,
  };
});

const PAGE_SIZES = [10, 20, 50, 100] as const;
type View = "donations" | "deliveries";
type SortDir = "asc" | "desc" | null;

type DonCol = "id" | "food" | "donor" | "ngo" | "status" | "expiry" | "created";
type DelCol = "id" | "food" | "volunteer" | "pickup" | "dropoff" | "status" | "eta";

function SortIcon({ col, sortCol, dir }: { col: string; sortCol: string | null; dir: SortDir }) {
  if (sortCol !== col) return <ChevronsUpDown size={11} className="opacity-30 ml-1 inline-block" />;
  if (dir === "asc") return <ChevronUp size={11} className="text-primary ml-1 inline-block" />;
  return <ChevronDown size={11} className="text-primary ml-1 inline-block" />;
}

function nextDir(current: SortDir): SortDir {
  if (!current) return "asc";
  if (current === "asc") return "desc";
  return null;
}

export default function AdminMonitoring({ view: initialView = "donations" }: { view?: View }) {
  const [view, setView] = useState<View>(initialView);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<typeof PAGE_SIZES[number]>(20);
  const [donSort, setDonSort] = useState<DonCol | null>(null);
  const [donDir, setDonDir] = useState<SortDir>(null);
  const [delSort, setDelSort] = useState<DelCol | null>(null);
  const [delDir, setDelDir] = useState<SortDir>(null);

  const donationStatuses = ["all", "published", "matched", "pickup", "delivered", "expired", "cancelled"];
  const deliveryStatuses = ["all", "accepted", "in_transit", "delivered", "failed"];

  const filteredDonations = useMemo(() => {
    let rows = donationRows.filter(d =>
      (statusFilter === "all" || d.status === statusFilter) &&
      (search === "" || d.id.toLowerCase().includes(search.toLowerCase()) || d.food.toLowerCase().includes(search.toLowerCase()) || d.donor.toLowerCase().includes(search.toLowerCase()))
    );
    if (donSort && donDir) {
      rows = [...rows].sort((a, b) => {
        const av = a[donSort] as string;
        const bv = b[donSort] as string;
        return donDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [statusFilter, search, donSort, donDir]);

  const filteredDeliveries = useMemo(() => {
    let rows = deliveryRows.filter(d =>
      (statusFilter === "all" || d.status === statusFilter) &&
      (search === "" || d.id.toLowerCase().includes(search.toLowerCase()) || d.food.toLowerCase().includes(search.toLowerCase()) || d.volunteer.toLowerCase().includes(search.toLowerCase()))
    );
    if (delSort && delDir) {
      rows = [...rows].sort((a, b) => {
        const av = a[delSort] as string;
        const bv = b[delSort] as string;
        return delDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [statusFilter, search, delSort, delDir]);

  const rows = view === "donations" ? filteredDonations : filteredDeliveries;
  const totalPages = Math.ceil(rows.length / pageSize);
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  const handleViewSwitch = (v: View) => { setView(v); setPage(1); setStatusFilter("all"); setSearch(""); };
  const handlePageSize = (ps: typeof PAGE_SIZES[number]) => { setPageSize(ps); setPage(1); };
  const handleFilter = (s: string) => { setStatusFilter(s); setPage(1); };

  function toggleDonSort(col: DonCol) {
    if (donSort !== col) { setDonSort(col); setDonDir("asc"); }
    else { const nd = nextDir(donDir); setDonDir(nd); if (!nd) setDonSort(null); }
    setPage(1);
  }
  function toggleDelSort(col: DelCol) {
    if (delSort !== col) { setDelSort(col); setDelDir("asc"); }
    else { const nd = nextDir(delDir); setDelDir(nd); if (!nd) setDelSort(null); }
    setPage(1);
  }

  const headCls = "grid-sticky-head th-sort h-9 px-3 text-left text-[10px] font-bold uppercase tracking-[0.07em] text-muted-foreground";

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {view === "donations" ? "Donation Monitoring" : "Delivery Monitoring"}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleViewSwitch("donations")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${view === "donations" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Package size={12} /> Donations
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleViewSwitch("deliveries")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${view === "deliveries" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Truck size={12} /> Deliveries
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Summary tiles */}
      <AnimatePresence mode="wait">
        {view === "donations" && (
          <motion.div key="donation-tiles" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Active", val: donationRows.filter(d=>d.status==="published").length, color: "stat-gradient-sky" },
              { label: "Matched", val: donationRows.filter(d=>d.status==="matched").length, color: "stat-gradient-violet" },
              { label: "In pickup", val: donationRows.filter(d=>d.status==="pickup").length, color: "stat-gradient-amber" },
              { label: "Delivered", val: donationRows.filter(d=>d.status==="delivered").length, color: "stat-gradient-green" },
              { label: "Expired", val: donationRows.filter(d=>d.status==="expired").length, color: "stat-gradient-rose" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.06 }} whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,0,0,0.2)" }}
                className={`${s.color} rounded-xl p-3 text-white cursor-default`}>
                <div className="text-xl font-bold text-white">{s.val}</div>
                <div className="text-white/80 text-xs">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
        {view === "deliveries" && (
          <motion.div key="delivery-tiles" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Active deliveries", val: deliveryRows.filter(d=>["accepted","in_transit"].includes(d.status)).length, color: "stat-gradient-sky", alert: false },
              { label: "Delayed", val: deliveryRows.filter(d=>d.delay).length, color: "stat-gradient-rose", alert: true },
              { label: "Completed", val: deliveryRows.filter(d=>d.status==="delivered").length, color: "stat-gradient-green", alert: false },
              { label: "Failed", val: deliveryRows.filter(d=>d.status==="failed").length, color: "stat-gradient-amber", alert: false },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.06 }} whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,0,0,0.2)" }}
                className={`${s.color} rounded-xl p-3 text-white cursor-default ${s.alert ? "ring-2 ring-rose-400" : ""}`}>
                <div className="text-xl font-bold text-white">{s.val}</div>
                <div className="text-white/80 text-xs">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filter row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search ID, food, donor…" className="pl-8 h-8 text-xs w-48 sm:w-56" />
        </div>
        <div className="flex flex-wrap gap-1.5 items-center flex-1">
          <Filter size={11} className="text-muted-foreground" />
          {(view === "donations" ? donationStatuses : deliveryStatuses).map(s => (
            <motion.button key={s} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={() => handleFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? "bg-foreground text-background" : "bg-card text-muted-foreground border border-border hover:border-foreground/30"}`}>
              {s.replace("_", " ")}
            </motion.button>
          ))}
        </div>
        {/* Page size selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide hidden sm:block">Rows</span>
          <div className="flex gap-0.5 bg-muted p-0.5 rounded-lg">
            {PAGE_SIZES.map(ps => (
              <motion.button key={ps} whileTap={{ scale: 0.93 }} onClick={() => handlePageSize(ps)}
                className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${pageSize === ps ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {ps}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          <Card className="overflow-hidden">
            <div className="grid-scroll" style={{ height: "calc(100vh - 388px)", minHeight: 260 }}>
              <table className="w-full text-sm border-collapse">
                <thead>
                  {view === "donations" ? (
                    <tr>
                      {(["id","food","donor","ngo","status","expiry","created"] as DonCol[]).map((col, ci) => (
                        <th key={col} onClick={() => toggleDonSort(col)}
                          className={`${headCls} ${ci === 0 ? "pl-4" : ""} ${ci === 6 ? "pr-4" : ""}`}>
                          {["ID","Food","Donor","NGO","Status","Expiry","Created"][ci]}
                          <SortIcon col={col} sortCol={donSort} dir={donDir} />
                        </th>
                      ))}
                      <th className={`${headCls} pr-4`}>Actions</th>
                    </tr>
                  ) : (
                    <tr>
                      {(["id","food","volunteer","pickup","dropoff","status","eta"] as DelCol[]).map((col, ci) => (
                        <th key={col} onClick={() => toggleDelSort(col)}
                          className={`${headCls} ${ci === 0 ? "pl-4" : ""}`}>
                          {["ID","Food","Volunteer","Pickup","Drop-off","Status","ETA"][ci]}
                          <SortIcon col={col} sortCol={delSort} dir={delDir} />
                        </th>
                      ))}
                      <th className={`${headCls} pr-4`}>Actions</th>
                    </tr>
                  )}
                </thead>
                <tbody className="grid-tbody">
                  {view === "donations"
                    ? (pageRows as typeof donationRows).map((d) => (
                      <tr key={d.id} className="border-b border-border/60 transition-colors">
                        <td className="font-mono-data text-[10px] text-muted-foreground py-2.5 pl-4 pr-2">{d.id}</td>
                        <td className="text-sm font-medium text-foreground py-2.5 px-2 max-w-[180px]"><span className="block truncate">{d.food}</span></td>
                        <td className="text-xs text-muted-foreground py-2.5 px-2">{d.donor}</td>
                        <td className="text-xs text-muted-foreground py-2.5 px-2">{d.ngo}</td>
                        <td className="py-2.5 px-2"><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                        <td className="text-xs text-muted-foreground py-2.5 px-2 font-mono-data">{d.expiry}</td>
                        <td className="text-xs text-muted-foreground py-2.5 px-2">{d.created}</td>
                        <td className="py-2.5 pr-4 pl-2">
                          <div className="flex gap-2">
                            <button className="text-xs text-primary font-semibold hover:underline">View</button>
                            {d.status === "published" && <button className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline">Force match</button>}
                          </div>
                        </td>
                      </tr>
                    ))
                    : (pageRows as typeof deliveryRows).map((d) => (
                      <tr key={d.id} className={`border-b border-border/60 transition-colors ${d.delay ? "!bg-rose-500/5" : ""}`}>
                        <td className="font-mono-data text-[10px] text-muted-foreground py-2.5 pl-4 pr-2">{d.id}</td>
                        <td className="text-sm font-medium text-foreground py-2.5 px-2 max-w-[160px]"><span className="block truncate">{d.food}</span></td>
                        <td className="text-xs text-foreground py-2.5 px-2">{d.volunteer}</td>
                        <td className="text-xs text-muted-foreground py-2.5 px-2 max-w-[100px]"><span className="block truncate">{d.pickup}</span></td>
                        <td className="text-xs text-muted-foreground py-2.5 px-2 max-w-[100px]"><span className="block truncate">{d.dropoff}</span></td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`badge badge-${d.status === "in_transit" ? "pickup" : d.status}`}>{d.status.replace("_"," ")}</span>
                            {d.delay && <motion.span animate={{ scale: [1,1.2,1] }} transition={{ duration: 1, repeat: Infinity }}><AlertTriangle size={12} className="text-rose-500" /></motion.span>}
                          </div>
                        </td>
                        <td className={`text-xs font-mono-data py-2.5 px-2 ${d.delay ? "text-rose-500 font-semibold" : "text-muted-foreground"}`}>{d.eta}</td>
                        <td className="py-2.5 pr-4 pl-2">
                          <div className="flex gap-2">
                            <button className="text-xs text-primary font-semibold hover:underline">Track</button>
                            {d.delay && <button className="text-xs text-rose-500 font-semibold hover:underline">Escalate</button>}
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-muted-foreground">
          Showing {Math.min((page-1)*pageSize+1, rows.length)}–{Math.min(page*pageSize, rows.length)} of {rows.length} records
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>
            <ChevronLeft size={13} />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = page <= 3 ? i + 1 : page + i - 2;
            if (p < 1 || p > totalPages) return null;
            return (
              <Button key={p} variant={page === p ? "default" : "outline"} size="sm" className="h-7 w-7 px-0 text-xs" onClick={() => setPage(p)}>
                {p}
              </Button>
            );
          })}
          <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>
            <ChevronRight size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}
