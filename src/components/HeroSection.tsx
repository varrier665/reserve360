import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

    <div className="relative z-10 container mx-auto px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto"
      >
        Nourish India, <br />
        <span className="text-gradient-warm">Heal India</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto font-body"
      >
        Your donations of food and medicine transform lives across India. Join thousands of compassionate donors making a real difference every day.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/donate">
          <Button variant="hero" size="lg" className="text-lg px-10 py-6">
            Donate Now
          </Button>
        </Link>
        <Link to="/get-involved">
          <Button variant="heroOutline" size="lg" className="text-lg px-10 py-6">
            Become a Volunteer
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
