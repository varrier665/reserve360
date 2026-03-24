import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Target, Eye, Shield, Users } from "lucide-react";

const team = [
  { name: "Thorani S", role: "Founder", desc: "Leading the mission to nourish and heal India." },
  { name: "Thoshika P", role: "Co-Founder", desc: "Driving partnerships and community outreach." },
  { name: "Tisha Samritha S", role: "Operations Lead", desc: "Managing logistics and volunteer coordination." },
];

const About = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">About Reserve360</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Bridging the gap between surplus and need.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {[
            { icon: Target, title: "Our Mission", desc: "To eliminate food and medicine waste by efficiently channeling surplus resources to communities in need across India, ensuring no one goes hungry or without essential healthcare." },
            { icon: Eye, title: "Our Vision", desc: "An India where every person has access to nutritious food and essential medicines, powered by a connected network of compassionate donors and verified recipient organizations." },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-card"
            >
              <item.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Transparency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-muted rounded-2xl p-8 max-w-4xl mx-auto mb-20"
        >
          <div className="flex items-start gap-4">
            <Shield className="h-10 w-10 text-secondary flex-shrink-0" />
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">Transparency & Accountability</h3>
              <p className="text-muted-foreground leading-relaxed">
                We maintain full transparency in how donations are used. Annual reports, real-time tracking, and third-party audits ensure every rupee and every item reaches those who need it most. All recipient organizations undergo thorough verification before joining our network.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">Our Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-display font-bold text-foreground">{member.name}</h4>
              <p className="text-xs text-primary font-semibold mt-1">{member.role}</p>
              <p className="text-xs text-muted-foreground mt-2">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
