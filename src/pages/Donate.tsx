import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Apple, Pill, Building2 } from "lucide-react";
import { useState } from "react";
import donateFood from "@/assets/donate-food.jpg";
import donateMedicine from "@/assets/donate-medicine.jpg";
import UPIPayment from "@/components/UPIPayment";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DonationForm {
  name: string;
  email: string;
  phone: string;
  items: string;
  quantity: string;
  method: string;
  notes: string;
  expiryDate: string;
  medicineType: string;
  companyName: string;
  contactPerson: string;
  amount: string;
}

const emptyForm: DonationForm = {
  name: "", email: "", phone: "", items: "", quantity: "",
  method: "", notes: "", expiryDate: "", medicineType: "",
  companyName: "", contactPerson: "", amount: "",
};

const Donate = () => {
  const [tab, setTab] = useState<"food" | "medicine" | "corporate">("food");
  const [form, setForm] = useState<DonationForm>(emptyForm);
  const [showPayment, setShowPayment] = useState(false);
  const [currentDonationId, setCurrentDonationId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof DonationForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submitDonation = async () => {
    if (!form.name || !form.email) {
      toast({ title: "Please fill in your name and email", variant: "destructive" });
      return;
    }
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) {
      toast({ title: "Please enter a valid donation amount", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.from("donations").insert({
      donor_name: form.name,
      email: form.email,
      phone: form.phone || null,
      donation_type: tab,
      items_description: form.items || null,
      quantity: form.quantity || null,
      delivery_method: form.method || null,
      expiry_date: form.expiryDate || null,
      medicine_type: form.medicineType || null,
      company_name: form.companyName || null,
      contact_person: form.contactPerson || null,
      notes: form.notes || null,
      amount,
      payment_status: "pending",
    } as any).select().single();

    setSubmitting(false);

    if (error) {
      toast({ title: "Error submitting donation", description: error.message, variant: "destructive" });
      return;
    }

    setCurrentDonationId((data as any).id);
    setShowPayment(true);
  };

  const handlePaymentConfirmed = async (transactionId: string) => {
    await supabase.from("donations").update({
      upi_transaction_id: transactionId,
      payment_status: "completed",
    } as any).eq("id", currentDonationId);

    toast({ title: "Donation recorded!", description: "We'll verify your payment shortly." });
  };

  const closePayment = () => {
    setShowPayment(false);
    setForm(emptyForm);
  };

  const amount = parseFloat(form.amount) || 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Make a Donation</h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Choose how you'd like to contribute — every donation helps save lives.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-12">
            {[
              { key: "food" as const, label: "Donate Food", icon: Apple },
              { key: "medicine" as const, label: "Donate Medicine", icon: Pill },
              { key: "corporate" as const, label: "Corporate", icon: Building2 },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setForm(emptyForm); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  tab === t.key ? "bg-primary text-primary-foreground shadow-warm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {tab === "food" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-10">
                <div>
                  <img src={donateFood} alt="Food donations" className="rounded-2xl shadow-card mb-6" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">What We Accept</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {["Non-perishable food items (rice, dal, flour)", "Sealed and packaged foods", "Canned goods and dry fruits", "Baby food and formula (sealed)", "Cooking oil and spices"].map((item) => (
                      <li key={item} className="flex items-start gap-2"><span className="text-secondary mt-0.5">✓</span>{item}</li>
                    ))}
                  </ul>
                  <h3 className="font-display text-xl font-bold text-foreground mt-6 mb-3">What We Cannot Accept</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {["Perishable items without cold chain", "Opened or damaged packages", "Expired food products", "Homemade food (safety concerns)"].map((item) => (
                      <li key={item} className="flex items-start gap-2"><span className="text-destructive mt-0.5">✗</span>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">Food Donation Form</h3>
                  <div className="space-y-4">
                    <Input placeholder="Your Full Name" value={form.name} onChange={set("name")} />
                    <Input placeholder="Email Address" type="email" value={form.email} onChange={set("email")} />
                    <Input placeholder="Phone Number" type="tel" value={form.phone} onChange={set("phone")} />
                    <Input placeholder="Type of Food Items" value={form.items} onChange={set("items")} />
                    <Input placeholder="Approximate Quantity (kg)" value={form.quantity} onChange={set("quantity")} />
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.method} onChange={set("method")}>
                      <option value="">Preferred Method</option>
                      <option value="drop-off">Drop-off at Collection Point</option>
                      <option value="pickup">Schedule a Pickup</option>
                      <option value="bulk">Bulk Donation (Contact Us)</option>
                    </select>
                    <Input placeholder="Donation Amount (₹)" type="number" value={form.amount} onChange={set("amount")} />
                    <Textarea placeholder="Additional Notes" value={form.notes} onChange={set("notes")} />
                    <Button variant="warm" className="w-full" onClick={submitDonation} disabled={submitting}>
                      {submitting ? "Submitting…" : "Proceed to Pay"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "medicine" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-10">
                <div>
                  <img src={donateMedicine} alt="Medicine donations" className="rounded-2xl shadow-card mb-6" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">What We Accept</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {["Unopened, unexpired medicines", "Over-the-counter medications", "First aid supplies and kits", "Vitamins and supplements (sealed)", "Medical devices (bandages, thermometers)"].map((item) => (
                      <li key={item} className="flex items-start gap-2"><span className="text-secondary mt-0.5">✓</span>{item}</li>
                    ))}
                  </ul>
                  <h3 className="font-display text-xl font-bold text-foreground mt-6 mb-3">What We Cannot Accept</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {["Expired medications", "Opened or tampered packages", "Controlled substances (without authorization)", "Unlabeled or unidentified medicines"].map((item) => (
                      <li key={item} className="flex items-start gap-2"><span className="text-destructive mt-0.5">✗</span>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <h3 className="font-display text-xl font-bold text-foreground mb-4">Medicine Donation Form</h3>
                  <div className="space-y-4">
                    <Input placeholder="Your Full Name" value={form.name} onChange={set("name")} />
                    <Input placeholder="Email Address" type="email" value={form.email} onChange={set("email")} />
                    <Input placeholder="Phone Number" type="tel" value={form.phone} onChange={set("phone")} />
                    <Input placeholder="Type of Medicine" value={form.items} onChange={set("items")} />
                    <Input placeholder="Quantity" value={form.quantity} onChange={set("quantity")} />
                    <Input placeholder="Earliest Expiry Date" type="date" value={form.expiryDate} onChange={set("expiryDate")} />
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.medicineType} onChange={set("medicineType")}>
                      <option value="">Medicine Type</option>
                      <option value="otc">Over-the-Counter</option>
                      <option value="prescription">Prescription (with authorization)</option>
                      <option value="first-aid">First Aid Supplies</option>
                    </select>
                    <Input placeholder="Donation Amount (₹)" type="number" value={form.amount} onChange={set("amount")} />
                    <Textarea placeholder="Storage Requirements / Notes" value={form.notes} onChange={set("notes")} />
                    <Button variant="green" className="w-full" onClick={submitDonation} disabled={submitting}>
                      {submitting ? "Submitting…" : "Proceed to Pay"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "corporate" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Corporate Donations</h3>
                <p className="text-muted-foreground mb-6">
                  Partner with us for CSR initiatives. We provide complete documentation, impact reports, and tax benefits.
                </p>
                <div className="space-y-4">
                  <Input placeholder="Company Name" value={form.companyName} onChange={set("companyName")} />
                  <Input placeholder="Contact Person" value={form.contactPerson} onChange={set("contactPerson")} />
                  <Input placeholder="Email Address" type="email" value={form.email} onChange={set("email")} />
                  <Input placeholder="Phone Number" type="tel" value={form.phone} onChange={set("phone")} />
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.items} onChange={set("items")}>
                    <option value="">Donation Type</option>
                    <option value="food">Food Donation</option>
                    <option value="medicine">Medicine Donation</option>
                    <option value="both">Both</option>
                    <option value="monetary">Monetary Contribution</option>
                  </select>
                  <Input placeholder="Donation Amount (₹)" type="number" value={form.amount} onChange={set("amount")} />
                  <Textarea placeholder="Tell us about your CSR goals and how we can collaborate" rows={4} value={form.notes} onChange={set("notes")} />
                  <Button variant="warm" className="w-full" onClick={() => {
                    if (!form.companyName) { setForm(f => ({ ...f, name: form.companyName || form.contactPerson })); }
                    setForm(f => ({ ...f, name: f.companyName || f.contactPerson || f.name }));
                    submitDonation();
                  }} disabled={submitting}>
                    {submitting ? "Submitting…" : "Proceed to Pay"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {showPayment && currentDonationId && (
        <UPIPayment
          amount={amount}
          donationId={currentDonationId}
          donorName={form.name || form.companyName || "Donor"}
          onPaymentConfirmed={handlePaymentConfirmed}
          onClose={closePayment}
        />
      )}
    </div>
  );
};

export default Donate;
