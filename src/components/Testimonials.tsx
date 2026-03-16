import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "AnnaDaan helped us distribute over 50,000 meals during the floods in Assam. Their logistics are incredible.",
    name: "Priya Sharma",
    role: "Director, Helping Hands NGO",
  },
  {
    quote: "The medicine donations we received were all properly verified and within expiry. It saved dozens of lives in our village.",
    name: "Dr. Rajesh Kumar",
    role: "Community Health Worker, Bihar",
  },
  {
    quote: "As a corporate donor, we appreciate the transparency. We can track exactly where our contributions go.",
    name: "Anita Desai",
    role: "CSR Head, TechCorp India",
  },
];

const Testimonials = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Voices of Impact</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Hear from the people and organizations who make this possible.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-background rounded-2xl p-6 shadow-card relative"
          >
            <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
            <p className="text-sm text-foreground/80 italic leading-relaxed mb-6">"{t.quote}"</p>
            <div>
              <p className="font-display font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
