import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { LogOut, CheckCircle, XCircle, Users, Heart, Building2, DollarSign, Plus } from "lucide-react";
import { validateEmail, validatePhone } from "@/lib/validation";

type Tab = "donations" | "transactions" | "volunteers" | "ngos";

const AdminDashboard = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("donations");
  const [donations, setDonations] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNgoForm, setShowNgoForm] = useState(false);
  const [ngoForm, setNgoForm] = useState({ name: "", email: "", password: "", contactPerson: "", phone: "", city: "", regNo: "" });
  const [creatingNgo, setCreatingNgo] = useState(false);

  useEffect(() => {
    if (role === "ngo") navigate("/ngo", { replace: true });
  }, [role]);

  const fetchAll = async () => {
    setLoading(true);
    const [d, v, n] = await Promise.all([
      supabase.from("donations").select("*").order("created_at", { ascending: false }),
      supabase.from("volunteer_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("ngos").select("*").order("created_at", { ascending: false }),
    ]);
    setDonations(d.data ?? []);
    setVolunteers(v.data ?? []);
    setNgos(n.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const sendNotification = async (type: string, email: string, name: string, extra?: Record<string, any>) => {
    try {
      await supabase.functions.invoke("send-notification", {
        body: { type, recipientEmail: email, recipientName: name, ...extra },
      });
    } catch (e) {
      console.error("Notification error:", e);
    }
  };

  const updateDonationPayment = async (id: string, status: string) => {
    const donation = donations.find(d => d.id === id);
    await supabase.from("donations").update({ payment_status: status } as any).eq("id", id);
    if (donation) {
      sendNotification(
        status === "received" ? "donation_received" : "donation_not_received",
        donation.email, donation.donor_name,
        { donationAmount: donation.amount, transactionId: donation.upi_transaction_id }
      );
    }
    toast({ title: `Payment marked as ${status}` });
    fetchAll();
  };

  const updateVolunteerStatus = async (id: string, status: string) => {
    const vol = volunteers.find(v => v.id === id);
    await supabase.from("volunteer_applications").update({ status } as any).eq("id", id);
    if (vol) {
      sendNotification(
        status === "accepted" ? "volunteer_accepted" : "volunteer_rejected",
        vol.email, vol.first_name + (vol.last_name ? ` ${vol.last_name}` : "")
      );
    }
    toast({ title: `Volunteer ${status}` });
    fetchAll();
  };

  const updateNgoStatus = async (id: string, status: string) => {
    await supabase.from("ngos").update({ status } as any).eq("id", id);
    toast({ title: `NGO ${status}` });
    fetchAll();
  };

  const createNgoAccount = async () => {
    if (!ngoForm.name.trim() || !ngoForm.email.trim() || !ngoForm.password.trim()) {
      toast({ title: "Name, email and password are required", variant: "destructive" });
      return;
    }
    if (!validateEmail(ngoForm.email)) {
      toast({ title: "Invalid email format", variant: "destructive" });
      return;
    }
    if (ngoForm.phone && !validatePhone(ngoForm.phone)) {
      toast({ title: "Phone must be 10 digits", variant: "destructive" });
      return;
    }
    setCreatingNgo(true);
    const { data, error } = await supabase.functions.invoke("create-user", {
      body: { email: ngoForm.email, password: ngoForm.password, role: "ngo" },
    });
    if (error || data?.error) {
      toast({ title: "Error creating NGO account", description: data?.error || error?.message, variant: "destructive" });
      setCreatingNgo(false);
      return;
    }
    // Create NGO record
    await supabase.from("ngos").insert({
      user_id: data.userId,
      name: ngoForm.name.trim(),
      email: ngoForm.email.trim(),
      contact_person: ngoForm.contactPerson.trim() || null,
      phone: ngoForm.phone.trim() || null,
      city: ngoForm.city.trim() || null,
      registration_number: ngoForm.regNo.trim() || null,
      status: "approved",
    } as any);
    setCreatingNgo(false);
    setShowNgoForm(false);
    setNgoForm({ name: "", email: "", password: "", contactPerson: "", phone: "", city: "", regNo: "" });
    toast({ title: "NGO account created successfully" });
    fetchAll();
  };

  const transactions = donations.filter(d => d.amount && d.amount > 0);
  const itemDonations = donations;

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: "donations", label: "Donations", icon: Heart, count: itemDonations.length },
    { key: "transactions", label: "Transactions", icon: DollarSign, count: transactions.length },
    { key: "volunteers", label: "Volunteers", icon: Users, count: volunteers.length },
    { key: "ngos", label: "NGOs", icon: Building2, count: ngos.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/login"); }}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.key ? "bg-primary text-primary-foreground shadow-warm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
              <span className="bg-background/20 px-2 py-0.5 rounded-full text-xs">{t.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {tab === "donations" && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemDonations.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.donor_name}</TableCell>
                        <TableCell>{d.email}</TableCell>
                        <TableCell className="capitalize">{d.donation_type}</TableCell>
                        <TableCell>{d.items_description || "—"}</TableCell>
                        <TableCell>{d.amount ? `₹${d.amount.toLocaleString("en-IN")}` : "—"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            d.payment_status === "completed" ? "bg-secondary/10 text-secondary" :
                            d.payment_status === "received" ? "bg-secondary/10 text-secondary" :
                            d.payment_status === "not_received" ? "bg-destructive/10 text-destructive" :
                            "bg-accent/20 text-accent-foreground"
                          }`}>
                            {d.payment_status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(d.created_at).toLocaleDateString("en-IN")}</TableCell>
                      </TableRow>
                    ))}
                    {itemDonations.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No donations yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {tab === "transactions" && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>UPI Txn ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.donor_name}</TableCell>
                        <TableCell>{d.email}</TableCell>
                        <TableCell>₹{d.amount?.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="font-mono text-xs">{d.upi_transaction_id || "—"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            d.payment_status === "received" ? "bg-secondary/10 text-secondary" :
                            d.payment_status === "not_received" ? "bg-destructive/10 text-destructive" :
                            "bg-accent/20 text-accent-foreground"
                          }`}>
                            {d.payment_status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(d.created_at).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell>
                          {(d.payment_status === "pending" || d.payment_status === "completed") && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="text-secondary border-secondary hover:bg-secondary/10" onClick={() => updateDonationPayment(d.id, "received")}>
                                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Received
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => updateDonationPayment(d.id, "not_received")}>
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Not Received
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {transactions.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No transactions yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {tab === "volunteers" && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {volunteers.map(v => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.first_name} {v.last_name || ""}</TableCell>
                        <TableCell>{v.email}</TableCell>
                        <TableCell>{v.phone || "—"}</TableCell>
                        <TableCell>{v.city || "—"}</TableCell>
                        <TableCell className="capitalize">{v.area_of_interest || "—"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            v.status === "accepted" ? "bg-secondary/10 text-secondary" :
                            v.status === "rejected" ? "bg-destructive/10 text-destructive" :
                            "bg-accent/20 text-accent-foreground"
                          }`}>
                            {v.status || "pending"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {(!v.status || v.status === "pending") && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="text-secondary border-secondary hover:bg-secondary/10" onClick={() => updateVolunteerStatus(v.id, "accepted")}>
                                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Accept
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => updateVolunteerStatus(v.id, "rejected")}>
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {volunteers.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No applications yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {tab === "ngos" && (
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Reg. No.</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ngos.map(n => (
                      <TableRow key={n.id}>
                        <TableCell className="font-medium">{n.name}</TableCell>
                        <TableCell>{n.contact_person || "—"}</TableCell>
                        <TableCell>{n.email}</TableCell>
                        <TableCell>{n.city || "—"}</TableCell>
                        <TableCell>{n.registration_number || "—"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            n.status === "approved" ? "bg-secondary/10 text-secondary" :
                            n.status === "rejected" ? "bg-destructive/10 text-destructive" :
                            "bg-accent/20 text-accent-foreground"
                          }`}>
                            {n.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {n.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="text-secondary border-secondary hover:bg-secondary/10" onClick={() => updateNgoStatus(n.id, "approved")}>
                                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => updateNgoStatus(n.id, "rejected")}>
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {ngos.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No NGOs registered yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
