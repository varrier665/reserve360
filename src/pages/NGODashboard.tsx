import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { LogOut, Package, CheckCircle } from "lucide-react";

const NGODashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<any[]>([]);
  const [ngo, setNgo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"available" | "claimed">("available");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Get NGO record for this user
    const { data: ngoData } = await supabase.from("ngos").select("*").eq("user_id", user?.id).single();
    setNgo(ngoData);

    // Get donations
    const { data: donationData } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
    setDonations(donationData ?? []);
    setLoading(false);
  };

  const claimDonation = async (donationId: string) => {
    if (!ngo) return;
    await supabase.from("donations").update({
      assigned_ngo_id: ngo.id,
      item_status: "assigned",
    } as any).eq("id", donationId);
    toast({ title: "Item claimed for distribution" });
    fetchData();
  };

  const markDelivered = async (donationId: string) => {
    await supabase.from("donations").update({
      item_status: "delivered",
    } as any).eq("id", donationId);
    toast({ title: "Marked as delivered" });
    fetchData();
  };

  const available = donations.filter(d => d.item_status === "available" && d.donation_type !== "corporate");
  const claimed = donations.filter(d => d.assigned_ngo_id === ngo?.id);

  const displayList = tab === "available" ? available : claimed;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="font-display text-xl font-bold text-foreground">NGO Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{ngo?.name || user?.email}</span>
            <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/login"); }}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("available")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "available" ? "bg-primary text-primary-foreground shadow-warm" : "bg-muted text-muted-foreground"}`}>
            <Package className="h-4 w-4" /> Available Items
            <span className="bg-background/20 px-2 py-0.5 rounded-full text-xs">{available.length}</span>
          </button>
          <button onClick={() => setTab("claimed")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "claimed" ? "bg-primary text-primary-foreground shadow-warm" : "bg-muted text-muted-foreground"}`}>
            <CheckCircle className="h-4 w-4" /> Claimed
            <span className="bg-background/20 px-2 py-0.5 rounded-full text-xs">{claimed.length}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : !ngo ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Your NGO account is not yet set up or approved. Please contact the admin.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayList.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.donor_name}</TableCell>
                    <TableCell className="capitalize">{d.donation_type}</TableCell>
                    <TableCell>{d.items_description || "—"}</TableCell>
                    <TableCell>{d.quantity || "—"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        d.item_status === "delivered" ? "bg-secondary/10 text-secondary" :
                        d.item_status === "assigned" ? "bg-accent/20 text-accent-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {d.item_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(d.created_at).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>
                      {tab === "available" && d.item_status === "available" && (
                        <Button size="sm" variant="outline" className="text-primary" onClick={() => claimDonation(d.id)}>
                          Claim
                        </Button>
                      )}
                      {tab === "claimed" && d.item_status === "assigned" && (
                        <Button size="sm" variant="outline" className="text-secondary" onClick={() => markDelivered(d.id)}>
                          Mark Delivered
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {displayList.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No items found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;
