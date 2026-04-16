import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UPI_ID = "seeman5354@oksbi";

interface UPIPaymentProps {
  amount: number;
  donationId: string;
  donorName: string;
  onPaymentConfirmed: (transactionId: string) => void;
  onClose: () => void;
}

const UPIPayment = ({ amount, donationId, donorName, onPaymentConfirmed, onClose }: UPIPaymentProps) => {
  const [transactionId, setTransactionId] = useState("");
  const [step, setStep] = useState<"pay" | "confirm" | "done">("pay");

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Reserve360&am=${amount}&cu=INR&tn=Donation-${donationId.slice(0, 8)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleConfirm = () => {
    if (!transactionId.trim()) {
      toast({ title: "Please enter transaction ID", variant: "destructive" });
      return;
    }
    onPaymentConfirmed(transactionId.trim());
    setStep("done");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl">×</button>

        <AnimatePresence mode="wait">
          {step === "pay" && (
            <motion.div key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-medium">
                <QrCode className="h-4 w-4" /> UPI Payment
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">₹{amount.toLocaleString("en-IN")}</h3>
              <p className="text-sm text-muted-foreground">Scan the QR code with any UPI app</p>

              <div className="bg-white rounded-xl p-4 inline-block">
                <img src={qrUrl} alt="UPI QR Code" className="w-64 h-64 mx-auto" />
              </div>

              <p className="text-xs text-muted-foreground px-4">
                📱 On mobile? Long-press the QR to save it, then open GPay/PhonePe → Scan → Choose from gallery
              </p>

              <Button variant="warm" className="w-full" onClick={() => setStep("confirm")}>
                I've Made the Payment
              </Button>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <h3 className="font-display text-xl font-bold text-foreground">Confirm Payment</h3>
              <p className="text-sm text-muted-foreground">
                Enter the UPI transaction/reference ID from your payment app to confirm your donation.
              </p>
              <Input
                placeholder="e.g. 412345678901"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep("pay")}>Back</Button>
                <Button variant="warm" className="flex-1" onClick={handleConfirm}>Confirm Donation</Button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-4">
              <CheckCircle2 className="h-16 w-16 text-secondary mx-auto" />
              <h3 className="font-display text-2xl font-bold text-foreground">Thank You, {donorName}!</h3>
              <p className="text-sm text-muted-foreground">
                Your donation of <strong className="text-foreground">₹{amount.toLocaleString("en-IN")}</strong> has been recorded. We'll verify and confirm shortly.
              </p>
              <p className="text-xs text-muted-foreground">Ref: {transactionId}</p>
              <Button variant="warm" className="w-full" onClick={onClose}>Close</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default UPIPayment;
