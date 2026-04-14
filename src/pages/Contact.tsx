import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { validateContactForm } from "@/lib/validation";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    const errors = validateContactForm(form);
    if (errors.length > 0) {
      toast({ title: errors[0].message, variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Contact Us</h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Have questions? We'd love to hear from you.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">Get in Touch</h3>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", lines: ["iamstisha@gmail.com"] },
                  { icon: Phone, label: "Phone", lines: ["+91 9xxxx xxxx0"] },
                  { icon: MapPin, label: "Address", lines: ["123 Chennai", "Tamil Nadu, India"] },
                ].map((contact) => (
                  <div key={contact.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <contact.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{contact.label}</h4>
                      {contact.lines.map((line) => <p key={line} className="text-sm text-muted-foreground">{line}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Send a Message</h3>
              <div className="space-y-4">
                <Input placeholder="Your Name *" value={form.name} onChange={set("name")} />
                <Input placeholder="Email Address *" type="email" value={form.email} onChange={set("email")} />
                <Input placeholder="Subject *" value={form.subject} onChange={set("subject")} />
                <Textarea placeholder="Your Message *" rows={5} value={form.message} onChange={set("message")} />
                <Button variant="warm" className="w-full" onClick={handleSubmit}>Send Message</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
