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

const Donate = () => {
  const [tab, setTab] = useState<"food" | "medicine" | "corporate">("food");

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
                onClick={() => setTab(t.key)}
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
                    <Input placeholder="Your Full Name" />
                    <Input placeholder="Email Address" type="email" />
                    <Input placeholder="Phone Number" type="tel" />
                    <Input placeholder="Type of Food Items" />
                    <Input placeholder="Approximate Quantity (kg)" type="number" />
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option>Preferred Method</option>
                      <option>Drop-off at Collection Point</option>
                      <option>Schedule a Pickup</option>
                      <option>Bulk Donation (Contact Us)</option>
                    </select>
                    <Textarea placeholder="Additional Notes" />
                    <Button variant="warm" className="w-full">Submit Food Donation</Button>
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
                    <Input placeholder="Your Full Name" />
                    <Input placeholder="Email Address" type="email" />
                    <Input placeholder="Phone Number" type="tel" />
                    <Input placeholder="Type of Medicine" />
                    <Input placeholder="Quantity" type="number" />
                    <Input placeholder="Earliest Expiry Date" type="date" />
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option>Medicine Type</option>
                      <option>Over-the-Counter</option>
                      <option>Prescription (with authorization)</option>
                      <option>First Aid Supplies</option>
                    </select>
                    <Textarea placeholder="Storage Requirements / Notes" />
                    <Button variant="green" className="w-full">Submit Medicine Donation</Button>
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
                  <Input placeholder="Company Name" />
                  <Input placeholder="Contact Person" />
                  <Input placeholder="Email Address" type="email" />
                  <Input placeholder="Phone Number" type="tel" />
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option>Donation Type</option>
                    <option>Food Donation</option>
                    <option>Medicine Donation</option>
                    <option>Both</option>
                    <option>Monetary Contribution</option>
                  </select>
                  <Textarea placeholder="Tell us about your CSR goals and how we can collaborate" rows={4} />
                  <Button variant="warm" className="w-full">Submit Partnership Inquiry</Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Donate;
