import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Info, CheckCircle, Camera, Package, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { donationSchema, type DonationFormData } from "@/lib/schemas";
import { usePublishDonation } from "@/hooks/useApi";

interface CreateDonationProps {
  onNavigate: (page: string) => void;
}

const foodCategories = [
  "Produce & Vegetables", "Bread & Bakery", "Dairy & Eggs",
  "Prepared Meals", "Canned & Packaged", "Meat & Protein",
  "Beverages", "Snacks & Confectionery", "Other",
];

const dietaryTags = ["Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-free", "Nut-free", "Dairy-free"];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 text-[11px] text-destructive mt-1">
      <AlertCircle size={11} /> {message}
    </motion.p>
  );
}

export default function CreateDonation({ onNavigate }: CreateDonationProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(["Vegetarian"]);
  const [published, setPublished] = useState(false);
  const [publishedId, setPublishedId] = useState("");
  const publishMutation = usePublishDonation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      foodName: "",
      category: "Produce & Vegetables",
      quantity: "",
      unit: "kg",
      description: "",
      dietaryTags: ["Vegetarian"],
      preparedAt: "2026-08-20T06:00",
      expiresAt: "2026-08-21T20:00",
      storage: "Refrigerate (2–8°C)",
      safetyNotes: "",
      address: "",
      pickupStart: "2026-08-20T14:00",
      pickupEnd: "2026-08-20T18:00",
      contactPerson: "",
      pickupInstructions: "",
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const onSubmit = async (data: DonationFormData) => {
    const result = await publishMutation.mutateAsync({ ...data, dietaryTags: selectedTags });
    setPublishedId((result as { id: string }).id);
    setPublished(true);
  };

  if (published) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
            className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-primary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-semibold tracking-tight text-2xl text-foreground mb-2"
          >
            Donation Published!
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-muted-foreground mb-2">
            <span className="font-mono-data text-sm text-primary">{publishedId}</span> is now visible to matching NGOs.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-sm text-muted-foreground mb-8">
            Our matching system is evaluating compatible NGOs. You&apos;ll receive a notification when a match is found.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => onNavigate("donor-donations")}>View donations</Button>
            <Button onClick={() => setPublished(false)}>Create another</Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold tracking-tight text-xl text-foreground">Create Donation</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Fill in the details below to list your surplus food</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm">Save Draft</Button>
            <Button type="submit" size="sm" disabled={isSubmitting || publishMutation.isPending} className="gap-1.5">
              {(isSubmitting || publishMutation.isPending) ? <><Loader2 size={14} className="animate-spin" /> Publishing…</> : "Publish Donation"}
            </Button>
          </div>
        </motion.div>

        {/* Food Information */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={sectionVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                  <Package size={14} className="text-primary" />
                </div>
                <CardTitle>Food Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Food name *</Label>
                <Input {...register("foodName")} placeholder="e.g. Mixed vegetables, sourdough bread" className={errors.foodName ? "border-destructive" : ""} />
                <FieldError message={errors.foodName?.message} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Category *</Label>
                  <select {...register("category")} className="border border-border rounded-md px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full">
                    {foodCategories.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <FieldError message={errors.category?.message} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block">Quantity *</Label>
                    <Input type="number" {...register("quantity")} placeholder="0" className={errors.quantity ? "border-destructive" : ""} />
                    <FieldError message={errors.quantity?.message} />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block">Unit</Label>
                    <select {...register("unit")} className="border border-border rounded-md px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full">
                      <option>kg</option>
                      <option>portions</option>
                      <option>liters</option>
                      <option>boxes</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Description</Label>
                <Textarea {...register("description")} className="resize-none" rows={3} placeholder="Seasonal mixed vegetables including carrots, cabbage, tomatoes…" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-2 block">Dietary information</Label>
                <div className="flex flex-wrap gap-2">
                  {dietaryTags.map(tag => (
                    <motion.button
                      key={tag} type="button" whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selectedTags.includes(tag) ? "bg-brand-100 dark:bg-brand-900/30 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300" : "bg-card border-border text-muted-foreground hover:border-border/60"}`}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Food Safety */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={sectionVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Info size={14} className="text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle>Food Safety</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Preparation date/time</Label>
                  <Input type="datetime-local" {...register("preparedAt")} />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Expiry date/time *</Label>
                  <Input type="datetime-local" {...register("expiresAt")} className={errors.expiresAt ? "border-destructive" : ""} />
                  <FieldError message={errors.expiresAt?.message} />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Storage requirements</Label>
                <select {...register("storage")} className="border border-border rounded-md px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full">
                  <option>Refrigerate (2–8°C)</option>
                  <option>Room temperature</option>
                  <option>Freeze (below -18°C)</option>
                  <option>Cool and dry</option>
                </select>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Safety notes</Label>
                <Textarea {...register("safetyNotes")} className="resize-none" rows={2} placeholder="Any allergy warnings, handling instructions, or special notes" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pickup Details */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={sectionVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                  <MapPin size={14} className="text-sky-500" />
                </div>
                <CardTitle>Pickup Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Pickup address *</Label>
                <Input {...register("address")} placeholder="123 Market Street, San Francisco, CA 94102" className={errors.address ? "border-destructive" : ""} />
                <FieldError message={errors.address?.message} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Pickup window start *</Label>
                  <Input type="datetime-local" {...register("pickupStart")} className={errors.pickupStart ? "border-destructive" : ""} />
                  <FieldError message={errors.pickupStart?.message} />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Pickup window end *</Label>
                  <Input type="datetime-local" {...register("pickupEnd")} className={errors.pickupEnd ? "border-destructive" : ""} />
                  <FieldError message={errors.pickupEnd?.message} />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Contact person *</Label>
                <Input {...register("contactPerson")} placeholder="Name of person available at pickup" className={errors.contactPerson ? "border-destructive" : ""} />
                <FieldError message={errors.contactPerson?.message} />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Pickup instructions</Label>
                <Textarea {...register("pickupInstructions")} className="resize-none" rows={2} placeholder="Ring bell at loading dock, bring your own containers…" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Food Photos */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={sectionVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Camera size={14} className="text-violet-600" />
                </div>
                <CardTitle>Food Photos</CardTitle>
                <CardDescription>(Recommended — improves matching speed)</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <motion.div
                  whileHover={{ scale: 1.04, borderColor: "#86efac" }}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                >
                  <Upload size={16} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground text-center">Add photo</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} className="w-24 h-24 rounded-xl overflow-hidden relative group bg-muted cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=96&h=96&fit=crop&auto=format" alt="Produce" className="w-full h-full object-cover" />
                  <motion.button type="button" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <X size={16} className="text-white" />
                  </motion.button>
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">JPEG or PNG, max 5 MB per image. Up to 5 photos.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Validation summary */}
        <AnimatePresence>
          {Object.keys(errors).length > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle size={16} />
              Please fix {Object.keys(errors).length} error{Object.keys(errors).length !== 1 ? "s" : ""} before publishing.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom actions */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={sectionVariants} className="flex items-center justify-between py-2">
          <Button type="button" variant="outline" onClick={() => onNavigate("donor-dashboard")}>Cancel</Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline">Save Draft</Button>
            <Button type="submit" disabled={isSubmitting || publishMutation.isPending} className="gap-1.5">
              {(isSubmitting || publishMutation.isPending) ? <><Loader2 size={14} className="animate-spin" /> Publishing…</> : <><CheckCircle size={14} /> Publish Donation</>}
            </Button>
          </div>
        </motion.div>
      </div>
    </form>
  );
}
