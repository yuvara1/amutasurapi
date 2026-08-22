import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useNav } from "@/hooks/useNav";

function sr(s: number) { let x = Math.sin(s) * 10000; return x - Math.floor(x); }
const _ngos = ["Community Kitchen","Hope Foundation","City Shelter","Faith Community","Metro Food Bank","Sunrise Care","Bay Volunteers","Urban Harvest"];
const _foods = ["Assorted Produce Mix","Bread & Pastries","Dairy Products","Prepared Meals","Canned Goods","Baked Goods","Seasonal Fruits","Mixed Sandwiches","Fresh Vegetables","Protein Packs","Juice Cases","Snack Variety"];
const _stats = ["published","matched","pickup","delivered","delivered","delivered","expired","cancelled"];

type DonRow = { id: string; food: string; qty: string; status: string; ngo: string; pickup: string; expiry: string };
type SortCol = keyof DonRow;
type SortDir = "asc" | "desc" | null;

const DD_PER_PAGE = 15;

function SortIcon({ col, sortCol, dir }: { col: string; sortCol: string | null; dir: SortDir }) {
  if (sortCol !== col) return <ChevronsUpDown size={11} className="opacity-30 ml-1 inline-block" />;
  if (dir === "asc") return <ChevronUp size={11} className="text-primary ml-1 inline-block" />;
  return <ChevronDown size={11} className="text-primary ml-1 inline-block" />;
}

export default function DonorDonations() {
  const navigate = useNav();
  const [filter, setFilter] = useState("all");
  const [ddPage, setDdPage] = useState(1);
  const [sortCol, setSortCol] = useState<SortCol | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const donations = React.useMemo<DonRow[]>(() => Array.from({ length: 80 }, (_, i) => {
    const s = i * 11 + 7;
    const status = _stats[Math.floor(sr(s) * _stats.length)];
    const ngo = ["delivered","pickup","matched"].includes(status) ? _ngos[Math.floor(sr(s+1)*_ngos.length)] : "—";
    const qty = Math.floor(sr(s+2)*90)+10;
    const food = _foods[Math.floor(sr(s+3)*_foods.length)];
    const daysAgo = Math.floor(sr(s+4)*30);
    const date = new Date("2026-08-20"); date.setDate(date.getDate()-daysAgo);
    const dateStr = i<6 ? ["Today","Yesterday","2d ago","3d ago","4d ago","5d ago"][i] : date.toLocaleDateString("en-US",{month:"short",day:"numeric"});
    return {
      id: `DON-2026-${String(119+i).padStart(6,"0")}`,
      food, qty: `${qty} ${food.includes("Meal")||food.includes("Sandwich")||food.includes("Snack")?"portions":"kg"}`,
      status, ngo, pickup: status==="expired"||status==="delivered"?"—":dateStr,
      expiry: status==="delivered"||status==="expired"?"—":`Aug ${20+Math.floor(sr(s+5)*5)}`,
    };
  }), []);

  const statuses = ["all","published","matched","pickup","delivered","expired","cancelled"];

  const filtered = useMemo(() => {
    let rows = filter === "all" ? donations : donations.filter(d => d.status === filter);
    if (sortCol && sortDir) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortCol]; const bv = b[sortCol];
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [donations, filter, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / DD_PER_PAGE);
  const pageRows = filtered.slice((ddPage-1)*DD_PER_PAGE, ddPage*DD_PER_PAGE);

  function toggleSort(col: SortCol) {
    if (sortCol !== col) { setSortCol(col); setSortDir("asc"); }
    else if (sortDir === "asc") { setSortDir("desc"); }
    else { setSortCol(null); setSortDir(null); }
    setDdPage(1);
  }

  const cols: { key: SortCol; label: string }[] = [
    { key: "id", label: "Donation ID" },
    { key: "food", label: "Food" },
    { key: "qty", label: "Qty" },
    { key: "status", label: "Status" },
    { key: "ngo", label: "NGO" },
    { key: "pickup", label: "Pickup" },
    { key: "expiry", label: "Expiry" },
  ];

  const headCls = "grid-sticky-head th-sort h-9 px-3 text-left text-[10px] font-bold uppercase tracking-[0.07em] text-muted-foreground";

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">My Donations</h1>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Button size="sm" onClick={() => navigate("create-donation")}>+ Create</Button>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-1.5">
        {statuses.map(s => (
          <motion.button key={s} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { setFilter(s); setDdPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === s ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground border border-border hover:text-foreground"}`}>
            {s}
          </motion.button>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
        <Card className="overflow-hidden">
          <div className="grid-scroll">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr>
                  {cols.map((c, ci) => (
                    <th key={c.key} onClick={() => toggleSort(c.key)}
                      className={`${headCls} ${ci === 0 ? "pl-4" : ""}`}>
                      {c.label}
                      <SortIcon col={c.key} sortCol={sortCol} dir={sortDir} />
                    </th>
                  ))}
                  <th className={`${headCls} pr-4`}>Actions</th>
                </tr>
              </thead>
              <tbody className="grid-tbody">
                {pageRows.map((d) => (
                  <tr key={d.id} className="border-b border-border/60 transition-colors">
                    <td className="font-mono-data text-xs text-muted-foreground py-2.5 pl-4 pr-2">{d.id}</td>
                    <td className="font-medium text-foreground py-2.5 px-2 max-w-[160px]"><span className="block truncate">{d.food}</span></td>
                    <td className="font-mono-data text-xs py-2.5 px-2">{d.qty}</td>
                    <td className="py-2.5 px-2"><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                    <td className="text-muted-foreground text-xs py-2.5 px-2 max-w-[120px]"><span className="block truncate">{d.ngo}</span></td>
                    <td className="text-muted-foreground text-xs py-2.5 px-2">{d.pickup}</td>
                    <td className="text-muted-foreground text-xs py-2.5 px-2">{d.expiry}</td>
                    <td className="py-2.5 pr-4 pl-2">
                      <Button variant="ghost" size="sm" className="text-primary h-7 px-2 text-xs" onClick={() => navigate("donation-details")}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Showing {Math.min((ddPage-1)*DD_PER_PAGE+1, filtered.length)}–{Math.min(ddPage*DD_PER_PAGE, filtered.length)} of {filtered.length}</p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => setDdPage(p => Math.max(1,p-1))} disabled={ddPage===1}>‹</Button>
          {Array.from({length:Math.min(5,totalPages)},(_,i)=>{const p=ddPage<=3?i+1:ddPage+i-2;if(p<1||p>totalPages)return null;return(<Button key={p} variant={ddPage===p?"default":"outline"} size="sm" className="h-7 w-7 px-0 text-xs" onClick={()=>setDdPage(p)}>{p}</Button>);}).filter(Boolean)}
          <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => setDdPage(p => Math.min(totalPages,p+1))} disabled={ddPage===totalPages}>›</Button>
        </div>
      </div>
    </div>
  );
}
