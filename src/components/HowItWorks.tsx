import { motion } from "framer-motion";
import { Package, Search, Truck, Heart } from "lucide-react";

const steps = [
  { icon: Package, title: "Choose What to Donate", desc: "Select food items or medicines you'd like to contribute." },
  { icon: Search, title: "We Verify Recipients", desc: "Our team ensures donations reach verified NGOs and communities." },
  { icon: Truck, title: "We Handle Logistics", desc: "Schedule a pickup or drop off at a nearby collection point." },
  { icon: Heart, title: "Lives Transformed", desc: "Track the impact of your donation and see lives changed." },
];

const HowItWorks = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Four simple steps to make a lasting impact on communities across India.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center group"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-gradient-warm group-hover:shadow-warm transition-all duration-300">
              <step.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <div className="text-xs font-semibold text-primary mb-2">Step {i + 1}</div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
