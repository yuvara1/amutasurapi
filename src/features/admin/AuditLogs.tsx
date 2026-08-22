import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

function asr(s: number) { let x = Math.sin(s*1.7+3.14)*10000; return x - Math.floor(x); }
const _users = ["admin@foodbridge.io","sarah@greenharvest.org","alex@email.com","priya@hope.org","james@commkitchen.org","maria@cityshelter.org","tom@metrofoodbank.org","grace@faithcomm.org","omar@urbanharvest.org","lily@sunrise.org","unknown"];
const _roles = ["PLATFORM_ADMIN","DONOR_ADMIN","VOLUNTEER","NGO_STAFF","NGO_ADMIN","DONOR_STAFF","PLATFORM_STAFF","—"];
const _actions = ["donation.publish","donation.accept","donation.expire","delivery.start","delivery.complete","delivery.fail","org.approve","org.suspend","user.suspend","user.unsuspend","requirement.create","requirement.update","auth.login","auth.login_failed","auth.logout","match.trigger","match.override","audit.export"];
const _resources = ["Donation","Delivery","Organization","User","Requirement","Auth","Match","Audit"];
const _ips = ["10.0.1.42","203.0.113.15","192.0.2.88","198.51.100.7","203.0.113.22","198.18.0.44","10.0.2.15","172.16.0.5","198.51.100.22","192.168.1.100"];

type LogRow = { ts: string; user: string; role: string; action: string; resource: string; id: string; ip: string; result: string };
type SortCol = keyof LogRow;
type SortDir = "asc" | "desc" | null;

const PAGE_SIZES = [10, 20, 50, 100] as const;

function SortIcon({ col, sortCol, dir }: { col: string; sortCol: string | null; dir: SortDir }) {
  if (sortCol !== col) return <ChevronsUpDown size={11} className="opacity-30 ml-1 inline-block" />;
  if (dir === "asc") return <ChevronUp size={11} className="text-primary ml-1 inline-block" />;
  return <ChevronDown size={11} className="text-primary ml-1 inline-block" />;
}

export default function AuditLogs() {
  const [alPage, setAlPage] = useState(1);
  const [alSearch, setAlSearch] = useState("");
  const [pageSize, setPageSize] = useState<typeof PAGE_SIZES[number]>(20);
  const [sortCol, setSortCol] = useState<SortCol | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const allLogs = React.useMemo<LogRow[]>(() => {
    const base = new Date("2026-08-20T15:00:00");
    return Array.from({ length: 200 }, (_, i) => {
      const s = i * 13 + 5;
      const action = _actions[Math.floor(asr(s)*_actions.length)];
      const resource = _resources[Math.floor(asr(s+1)*_resources.length)];
      const user = _users[Math.floor(asr(s+2)*_users.length)];
      const role = user === "unknown" ? "—" : _roles[Math.floor(asr(s+3)*(_roles.length-1))];
      const result = (action.includes("fail") || action.includes("failed") || asr(s+4) > 0.92) ? "failure" : "success";
      const dt = new Date(base.getTime() - i * 4.5 * 60000);
      const ts = dt.toISOString().replace("T"," ").slice(0,19);
      const resId = resource==="Donation"?`DON-${String(100+Math.floor(asr(s+5)*100)).padStart(6,"0")}`:resource==="Delivery"?`DEL-${String(80+Math.floor(asr(s+5)*80)).padStart(6,"0")}`:resource==="Organization"?`ORG-${String(Math.floor(asr(s+5)*60)).padStart(5,"0")}`:resource==="User"?`USR-${String(Math.floor(asr(s+5)*400)).padStart(5,"0")}`:resource==="Auth"?"—":`${resource.slice(0,3).toUpperCase()}-${String(Math.floor(asr(s+5)*50)).padStart(5,"0")}`;
      return { ts, user, role, action, resource, id: resId, ip: _ips[Math.floor(asr(s+6)*_ips.length)], result };
    });
  }, []);

  const filtered = useMemo(() => {
    let rows = alSearch ? allLogs.filter(l => l.user.includes(alSearch) || l.action.includes(alSearch) || l.id.includes(alSearch)) : allLogs;
    if (sortCol && sortDir) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortCol]; const bv = b[sortCol];
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [allLogs, alSearch, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const logs = filtered.slice((alPage-1)*pageSize, alPage*pageSize);

  function toggleSort(col: SortCol) {
    if (sortCol !== col) { setSortCol(col); setSortDir("asc"); }
    else if (sortDir === "asc") { setSortDir("desc"); }
    else { setSortCol(null); setSortDir(null); }
    setAlPage(1);
  }
  function handlePageSize(ps: typeof PAGE_SIZES[number]) { setPageSize(ps); setAlPage(1); }

  const cols: { key: SortCol; label: string }[] = [
    { key: "ts", label: "Timestamp" },
    { key: "user", label: "User" },
    { key: "role", label: "Role" },
    { key: "action", label: "Action" },
    { key: "resource", label: "Resource" },
    { key: "id", label: "ID" },
    { key: "ip", label: "IP" },
    { key: "result", label: "Result" },
  ];

  const headCls = "grid-sticky-head th-sort h-9 px-3 text-left text-[10px] font-bold uppercase tracking-[0.07em] text-muted-foreground";

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Enterprise-grade audit trail of all platform actions</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Input type="search" placeholder="Search logs…" className="w-40 sm:w-48 text-sm h-8" value={alSearch} onChange={e=>{setAlSearch(e.target.value);setAlPage(1);}} />
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
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" size="sm" className="h-8">Export CSV</Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          <div className="grid-scroll" style={{ height: "calc(100vh - 260px)", minHeight: 260 }}>
            <table className="w-full text-sm border-collapse min-w-[800px]">
              <thead>
                <tr>
                  {cols.map((c, ci) => (
                    <th key={c.key} onClick={() => toggleSort(c.key)}
                      className={`${headCls} ${ci === 0 ? "pl-4" : ""} ${ci === cols.length - 1 ? "pr-4" : ""}`}>
                      {c.label}
                      <SortIcon col={c.key} sortCol={sortCol} dir={sortDir} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="grid-tbody">
                {logs.map((l, i) => (
                  <tr key={i} className="border-b border-border/60 transition-colors">
                    <td className="font-mono-data text-[10px] text-muted-foreground py-2.5 pl-4 pr-2 whitespace-nowrap">{l.ts}</td>
                    <td className="text-xs text-foreground py-2.5 px-2">{l.user}</td>
                    <td className="py-2.5 px-2"><span className="font-mono-data text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{l.role}</span></td>
                    <td className="py-2.5 px-2"><span className="font-mono-data text-[10px] text-foreground">{l.action}</span></td>
                    <td className="text-xs text-muted-foreground py-2.5 px-2">{l.resource}</td>
                    <td className="font-mono-data text-[10px] text-muted-foreground py-2.5 px-2">{l.id}</td>
                    <td className="font-mono-data text-[10px] text-muted-foreground py-2.5 px-2">{l.ip}</td>
                    <td className="py-2.5 pr-4 pl-2"><span className={`badge ${l.result === "success" ? "badge-delivered" : "badge-expired"}`}>{l.result}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-muted-foreground">
          Showing {Math.min((alPage-1)*pageSize+1, filtered.length)}–{Math.min(alPage*pageSize, filtered.length)} of {filtered.length} entries
        </p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 px-2" onClick={()=>setAlPage(p=>Math.max(1,p-1))} disabled={alPage===1}>‹</Button>
          {Array.from({length:Math.min(5,totalPages)},(_,i)=>{const p=alPage<=3?i+1:alPage+i-2;if(p<1||p>totalPages)return null;return(<Button key={p} variant={alPage===p?"default":"outline"} size="sm" className="h-7 w-7 px-0 text-xs" onClick={()=>setAlPage(p)}>{p}</Button>);}).filter(Boolean)}
          <Button variant="outline" size="sm" className="h-7 px-2" onClick={()=>setAlPage(p=>Math.min(totalPages,p+1))} disabled={alPage===totalPages}>›</Button>
        </div>
      </div>
    </div>
  );
}
