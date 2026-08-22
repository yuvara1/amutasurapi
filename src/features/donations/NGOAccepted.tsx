import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNav } from "@/hooks/useNav";

const accepted = [
  { id: "DON-000124", food: "Assorted Produce · 48 kg", donor: "Green Harvest Co.", pickup: "Aug 18, 2PM", status: "delivered", volunteer: "Alex Rivera" },
  { id: "DON-000122", food: "Prepared Meals · 120 portions", donor: "Grand Hotel", pickup: "Aug 20, 6PM", status: "pickup", volunteer: "Maria Santos" },
  { id: "DON-000118", food: "Bakery Surplus · 35 kg", donor: "City Bakehouse", pickup: "Aug 21, 8AM", status: "accepted", volunteer: "Unassigned" },
];

export default function NGOAccepted() {
  const navigate = useNav();
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-semibold tracking-tight text-foreground">Accepted Donations</motion.h1>
      <div className="space-y-4">
        {accepted.map((d, i) => {
          const accentCls = d.status === "delivered" ? "border-l-4 border-l-primary" : d.status === "pickup" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-sky-500";
          return (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}>
            <Card className={accentCls}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold tracking-tight text-foreground">{d.food}</span>
                      <span className={`badge badge-${d.status}`}>{d.status}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono-data mb-2">{d.id}</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Donor: {d.donor}</div>
                      <div>Pickup: {d.pickup}</div>
                      <div>Volunteer: {d.volunteer}</div>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="self-start">
                    <Button variant="outline" size="sm" onClick={() => navigate("delivery-tracking")}>Track delivery</Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );})}
      </div>
    </div>
  );
}
