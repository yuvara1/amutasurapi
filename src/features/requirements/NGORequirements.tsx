import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const requirements = [
  {
    id: "REQ-00029",
    name: "Daily Produce Intake",
    category: "Produce & Vegetables",
    qty: "80–120 kg",
    dietary: ["Vegetarian", "Vegan"],
    area: "Within 5 km",
    capacity: "120 kg/day",
    requiredBy: "Daily by 2:00 PM",
    status: "active",
    matches: 4,
    emoji: "🥦",
  },
  {
    id: "REQ-00028",
    name: "Weekly Bakery Intake",
    category: "Bread & Bakery",
    qty: "30–50 kg",
    dietary: ["No restrictions"],
    area: "Within 8 km",
    capacity: "50 kg/week",
    requiredBy: "Mon–Fri by 9:00 AM",
    status: "active",
    matches: 2,
    emoji: "🍞",
  },
  {
    id: "REQ-00025",
    name: "Emergency Meal Packs",
    category: "Prepared Meals",
    qty: "50–200 portions",
    dietary: ["Halal", "Vegetarian"],
    area: "Within 10 km",
    capacity: "200 portions/event",
    requiredBy: "As needed",
    status: "paused",
    matches: 0,
    emoji: "🍱",
  },
];

const categories = [
  "Produce & Vegetables", "Bread & Bakery", "Dairy & Eggs",
  "Prepared Meals", "Canned & Packaged", "Meat & Protein", "Other",
];

const dietaryOptions = ["Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-free", "No restrictions"];

export default function NGORequirements() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Vegetarian"]);

  const toggleTag = (tag: string) => {
    setSelectedTags((p) => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag]);
  };

  return (
    <div className="p-3 sm:p-6 space-y-5 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Food Requirements</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Define what your organization needs — donations are matched accordingly</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 self-start sm:self-auto">
          <Plus size={14} /> Add Requirement
        </Button>
      </motion.div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle>New Requirement</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowForm(false)}>
                  <X size={14} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-xs font-semibold mb-1.5 block">Requirement name *</Label>
                    <Input placeholder="e.g. Daily Produce Intake" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block">Food category *</Label>
                    <select className="border border-border rounded-md px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full">
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block">Service area radius</Label>
                    <select className="border border-border rounded-md px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full">
                      {["Within 2 km", "Within 5 km", "Within 10 km", "Within 20 km", "Any distance"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block">Minimum quantity</Label>
                    <Input placeholder="e.g. 50 kg" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block">Maximum capacity</Label>
                    <Input placeholder="e.g. 120 kg/day" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-semibold mb-2 block">Dietary requirements</Label>
                    <div className="flex flex-wrap gap-2">
                      {dietaryOptions.map(tag => (
                        <motion.button
                          key={tag}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                            selectedTags.includes(tag)
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "bg-card border-border text-muted-foreground hover:border-border/60"
                          }`}
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block">Required by / schedule</Label>
                    <Input placeholder="e.g. Daily by 2:00 PM" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block">Status</Label>
                    <select className="border border-border rounded-md px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full">
                      <option>Active</option>
                      <option>Paused</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4 mt-4 border-t border-border">
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button onClick={() => setShowForm(false)} className="flex items-center gap-2">
                    <CheckCircle size={13} /> Save requirement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requirements list */}
      <div className="space-y-4">
        {requirements.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
          >
            <Card className="transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl ${
                      r.status === "active" ? "bg-primary/8" : "bg-muted"
                    }`}>
                      {r.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold tracking-tight text-foreground">{r.name}</span>
                        <Badge variant={r.status === "active" ? "default" : "secondary"} className="text-[10px] h-4 px-1.5">
                          {r.status}
                        </Badge>
                        {r.matches > 0 && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
                            {r.matches} match{r.matches !== 1 ? "es" : ""}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 font-mono">{r.id}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Edit2 size={13} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:text-destructive hover:border-destructive/40">
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {[
                    { label: "Category", val: r.category },
                    { label: "Quantity", val: r.qty },
                    { label: "Service area", val: r.area },
                    { label: "Required by", val: r.requiredBy },
                  ].map((f) => (
                    <div key={f.label} className="bg-muted/40 rounded-lg p-2.5">
                      <div className="text-[10px] text-muted-foreground mb-0.5">{f.label}</div>
                      <div className="text-xs font-semibold text-foreground">{f.val}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">Dietary:</span>
                  {r.dietary.map(d => (
                    <span key={d} className="px-2 py-0.5 bg-primary/8 text-primary border border-primary/15 text-[10px] rounded-full font-semibold">
                      {d}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
