import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import donateFood from "@/assets/donate-food.jpg";
import donateMedicine from "@/assets/donate-medicine.jpg";

const categories = [
  {
    title: "Donate Food",
    desc: "Non-perishable food items, sealed packages, grains, pulses, and more. Help provide meals to families in need.",
    image: donateFood,
    items: ["Rice & Grains", "Pulses & Lentils", "Cooking Oil", "Canned Food", "Baby Food"],
  },
  {
    title: "Donate Medicine",
    desc: "Unopened, unexpired medicines including OTC drugs, first-aid supplies, and essential healthcare items.",
    image: donateMedicine,
    items: ["Pain Relievers", "Antibiotics", "First Aid Kits", "Vitamins", "Sanitizers"],
  },
];

const DonationCategories = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What You Can Donate</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          We accept food and medicine donations that meet our quality and safety standards.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden bg-card shadow-card group hover:shadow-warm transition-shadow duration-300"
          >
            <div className="h-52 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">{cat.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{cat.desc}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {cat.items.map((item) => (
                  <span key={item} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {item}
                  </span>
                ))}
              </div>
              <Link to="/donate">
                <Button variant="warm" className="w-full">{cat.title}</Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DonationCategories;
