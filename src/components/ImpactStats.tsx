import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { value: 2500000, label: "Meals Delivered", suffix: "+" },
  { value: 850000, label: "Medicine Kits Distributed", suffix: "+" },
  { value: 1200, label: "Partner NGOs", suffix: "+" },
  { value: 28, label: "States Covered", suffix: "" },
];

const AnimatedNumber = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, started]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      className="text-4xl md:text-5xl font-display font-bold text-gradient-warm"
    >
      {count >= 1000000
        ? `${(count / 1000000).toFixed(1)}M`
        : count >= 1000
        ? `${(count / 1000).toFixed(0)}K`
        : count}
      {suffix}
    </motion.span>
  );
};

const ImpactStats = () => (
  <section className="py-20 bg-muted">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Impact So Far</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Every donation counts. Here's how our community has transformed India.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center bg-card rounded-2xl p-8 shadow-card"
          >
            <AnimatedNumber target={stat.value} suffix={stat.suffix} />
            <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ImpactStats;
