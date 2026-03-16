import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, TrendingUp, Users, Heart } from "lucide-react";

const stories = [
  {
    title: "Feeding 10,000 Families in Kerala Floods",
    desc: "During the devastating 2024 Kerala floods, our network mobilized within 24 hours to deliver food supplies to 10,000+ affected families across 15 districts.",
    region: "Kerala",
  },
  {
    title: "Rural Healthcare Reach in Rajasthan",
    desc: "Our medicine donation program provided essential healthcare supplies to 200+ villages in remote Rajasthan, reducing preventable illness by 35%.",
    region: "Rajasthan",
  },
  {
    title: "School Nutrition Program in Bihar",
    desc: "Partnered with 150 schools across Bihar to provide nutritious meal supplements, improving attendance by 40% and health outcomes significantly.",
    region: "Bihar",
  },
];

const Impact = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Our Impact</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Real stories, real numbers, real change across India.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Heart, label: "Meals Delivered", value: "2.5M+" },
            { icon: TrendingUp, label: "Medicine Kits", value: "850K+" },
            { icon: Users, label: "Volunteers", value: "15,000+" },
            { icon: MapPin, label: "Districts Reached", value: "400+" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card text-center"
            >
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-display font-bold text-gradient-warm">{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Success Stories */}
        <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stories.map((story, i) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card border-l-4 border-primary"
            >
              <span className="text-xs font-semibold text-secondary">{story.region}</span>
              <h3 className="font-display text-lg font-bold text-foreground mt-2 mb-3">{story.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{story.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Impact;
