import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Users, Handshake, Megaphone } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { validateVolunteerForm } from "@/lib/validation";

interface VolunteerForm {
  firstName: string; lastName: string; email: string;
  phone: string; city: string; interest: string; about: string;
}

const emptyForm: VolunteerForm = {
  firstName: "", lastName: "", email: "", phone: "",
  city: "", interest: "", about: "",
};

const GetInvolved = () => {
  const [form, setForm] = useState<VolunteerForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (key: keyof VolunteerForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (fieldErrors[key]) setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleSubmit = async () => {
    const errors = validateVolunteerForm(form);
    if (errors.length > 0) {
      const errMap: Record<string, string> = {};
      errors.forEach((err) => { errMap[err.field] = err.message; });
      setFieldErrors(errMap);
      toast({ title: "Please fix the errors below", variant: "destructive" });
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    const { error } = await supabase.from("volunteer_applications").insert({
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      city: form.city.trim() || null,
      area_of_interest: form.interest || null,
      about: form.about.trim() || null,
    } as any);
    setSubmitting(false);

    if (error) {
      toast({ title: "Error submitting application", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Application submitted!", description: "Our team will reach out to you soon." });
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Get Involved</h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">There are many ways to contribute — donate, volunteer, or partner with us.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {[
              { icon: Users, title: "Volunteer", desc: "Help with logistics, awareness campaigns, or local coordination in your area." },
              { icon: Handshake, title: "Partner With Us", desc: "NGOs and organizations can register to receive donations and collaborate." },
              { icon: Megaphone, title: "Start a Campaign", desc: "Organize your own fundraising drive and rally your community to donate." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Volunteer Application</h2>
            <p className="text-muted-foreground mb-6 text-sm">Fill in the form below and our team will reach out to you.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input placeholder="First Name *" value={form.firstName} onChange={set("firstName")} className={fieldErrors.firstName ? "border-red-500" : ""} />
                  {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
                </div>
                <Input placeholder="Last Name" value={form.lastName} onChange={set("lastName")} />
              </div>
              <div>
                <Input placeholder="Email Address *" type="email" value={form.email} onChange={set("email")} className={fieldErrors.email ? "border-red-500" : ""} />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
              </div>
              <div>
                <Input placeholder="Phone Number (10 digits) *" type="tel" value={form.phone} onChange={set("phone")} className={fieldErrors.phone ? "border-red-500" : ""} />
                {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
              </div>
              <Input placeholder="City / District" value={form.city} onChange={set("city")} />
              <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.interest} onChange={set("interest")}>
                <option value="">Area of Interest</option>
                <option value="logistics">Logistics & Distribution</option>
                <option value="awareness">Awareness & Outreach</option>
                <option value="fundraising">Fundraising</option>
                <option value="coordination">Local Coordination</option>
              </select>
              <Textarea placeholder="Tell us about yourself and why you'd like to volunteer" rows={4} value={form.about} onChange={set("about")} />
              <Button variant="warm" className="w-full" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Application"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GetInvolved;
