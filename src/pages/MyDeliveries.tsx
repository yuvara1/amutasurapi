import { motion } from "framer-motion";
import { Truck, Clock, Star, Navigation, MapPin, Target, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MyDeliveriesProps {
  onNavigate: (page: string) => void;
}

const activeDeliveries = [
  {
    id: "DEL-2026-000085",
    food: "Assorted Produce Mix · 48 kg",
    pickup: "Green Harvest, 123 Main St",
    dropoff: "Community Kitchen, 78 Market St",
    status: "in_transit",
    eta: "12 min",
    distance: "5.1 km",
    donor: "Green Harvest Co.",
    ngo: "Community Kitchen",
  },
];

const upcomingDeliveries = [
  {
    id: "DEL-2026-000088",
    food: "Prepared Meals · 120 portions",
    pickup: "Grand Hotel, 45 Union St",
    dropoff: "Community Kitchen, 78 Market St",
    status: "accepted",
    window: "Today, 5:30–7:00 PM",
    distance: "3.2 km",
  },
];

const completedDeliveries = [
  { id: "DEL-084", food: "Bakery · 22 kg", route: "City Bakehouse → Faith Community", dist: "7.4 km", date: "Aug 17", rating: 5, meals: 44 },
  { id: "DEL-083", food: "Dairy · 31 kg", route: "Metro Grocery → Hope Foundation", dist: "3.8 km", date: "Aug 16", rating: 4, meals: 62 },
  { id: "DEL-082", food: "Produce · 60 kg", route: "Green Harvest → City Shelter", dist: "6.2 km", date: "Aug 14", rating: 5, meals: 102 },
  { id: "DEL-081", food: "Canned goods · 40 kg", route: "MegaMart → Metro Food Bank", dist: "4.5 km", date: "Aug 12", rating: 5, meals: 80 },
  { id: "DEL-080", food: "Prepared meals · 80 portions", route: "Grand Hotel → Community Kitchen", dist: "3.1 km", date: "Aug 10", rating: 5, meals: 80 },
];

export default function MyDeliveries({ onNavigate }: MyDeliveriesProps) {
  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <h1 className="font-semibold tracking-tight text-xl text-foreground">My Deliveries</h1>
        <div className="text-right">
          <div className="font-semibold tracking-tight text-foreground">234 completed</div>
          <div className="text-xs text-muted-foreground">2.8K kg food delivered</div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">
              Active
              {activeDeliveries.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="ml-1.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-amber-500 text-white text-[9px]"
                >
                  {activeDeliveries.length}
                </motion.span>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Active */}
          <TabsContent value="active" className="mt-4">
            <div className="space-y-4">
              {activeDeliveries.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Truck size={24} className="text-muted-foreground" />
                    </div>
                    <p className="font-semibold tracking-tight text-foreground">No active deliveries</p>
                    <p className="text-sm text-muted-foreground mt-1">Accept a delivery from Available Deliveries to get started.</p>
                  </CardContent>
                </Card>
              ) : activeDeliveries.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shrink-0"
                    >
                      <Truck size={22} className="text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold tracking-tight text-foreground">{d.food}</span>
                        <span className="badge badge-pickup">In Transit</span>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1"><MapPin size={10} /> From: {d.pickup}</div>
                        <div className="flex items-center gap-1"><Target size={10} /> To: {d.dropoff}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-foreground">
                          <Clock size={14} className="text-amber-600 dark:text-amber-400" />
                          ETA {d.eta}
                        </div>
                        <div className="text-xs text-muted-foreground">{d.distance}</div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-auto shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.04, boxShadow: "0 4px 16px rgba(30,92,37,0.3)" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => onNavigate("delivery-tracking")}
                        >
                          <Navigation size={14} /> Track Live
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming */}
          <TabsContent value="upcoming" className="mt-4">
            <div className="space-y-4">
              {upcomingDeliveries.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
                >
                  <Card className="transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                          <Truck size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold tracking-tight text-foreground mb-1">{d.food}</div>
                          <div className="space-y-1 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1"><MapPin size={10} /> {d.pickup}</div>
                            <div className="flex items-center gap-1"><Target size={10} /> {d.dropoff}</div>
                          </div>
                          <div className="flex gap-3 text-xs">
                            <span className="text-muted-foreground flex items-center gap-1"><CalendarDays size={10} /> {d.window}</span>
                            <span className="text-muted-foreground">· {d.distance}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="badge badge-accepted mb-2 block">Accepted</span>
                          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                            <Button size="sm" className="w-full sm:w-auto" onClick={() => onNavigate("delivery-tracking")}>Navigate</Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed" className="mt-4">
            <Card className="overflow-hidden">
              <div className="grid-scroll">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      {["Delivery","Food","Route","Distance","Date","Meals","Rating"].map((h, ci) => (
                        <th key={h} className={`grid-sticky-head h-9 px-3 text-left text-[10px] font-bold uppercase tracking-[0.07em] text-muted-foreground ${ci === 0 ? "pl-4" : ""} ${ci === 6 ? "pr-4" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="grid-tbody">
                    {completedDeliveries.map((d, i) => (
                      <tr key={i} className="border-b border-border/60 transition-colors">
                        <td className="font-mono-data text-xs text-muted-foreground py-2.5 pl-4 pr-2">{d.id}</td>
                        <td className="font-medium text-foreground text-sm py-2.5 px-2">{d.food}</td>
                        <td className="text-xs text-muted-foreground py-2.5 px-2">{d.route}</td>
                        <td className="font-mono-data text-xs py-2.5 px-2">{d.dist}</td>
                        <td className="text-xs text-muted-foreground py-2.5 px-2">{d.date}</td>
                        <td className="font-mono-data text-xs text-primary py-2.5 px-2">{d.meals}</td>
                        <td className="py-2.5 pr-4 pl-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: d.rating }).map((_, j) => (
                              <Star key={j} size={11} className="fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
