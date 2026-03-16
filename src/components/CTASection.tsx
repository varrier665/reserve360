import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTASection = () => (
  <section className="py-20 bg-gradient-warm">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
          Whether you donate food, medicine, or your time — every contribution helps build a healthier, better-fed India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/donate">
            <Button variant="heroOutline" size="lg" className="text-lg px-10 py-6">
              Start Donating
            </Button>
          </Link>
          <Link to="/get-involved">
            <Button variant="heroOutline" size="lg" className="text-lg px-10 py-6">
              Join as Volunteer
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
