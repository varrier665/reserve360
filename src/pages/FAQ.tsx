import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqData = [
  {
    category: "For Donors",
    questions: [
      { q: "What types of food can I donate?", a: "We accept non-perishable food items such as rice, dal, flour, cooking oil, canned goods, sealed packaged foods, and baby food/formula. All items must be sealed, unexpired, and in good condition." },
      { q: "What medicines are accepted?", a: "We accept unopened, unexpired over-the-counter medications, first aid supplies, vitamins, supplements, and medical devices like bandages and thermometers. Controlled substances require special authorization." },
      { q: "How do I schedule a pickup?", a: "After submitting your donation form, our logistics team will contact you within 24 hours to schedule a convenient pickup time. We operate in all major cities across India." },
      { q: "Do I get a tax benefit for donating?", a: "Yes! All donations are eligible for tax deduction under Section 80G of the Income Tax Act. You'll receive a donation receipt via email within 48 hours." },
      { q: "Can I track where my donation goes?", a: "Absolutely! Every donor receives a unique tracking ID. You can log in to see which recipient organization received your donation and the impact it created." },
    ],
  },
  {
    category: "For Recipients",
    questions: [
      { q: "How can our NGO register to receive donations?", a: "Visit our 'Get Involved' page and fill out the Partner With Us form. Our verification team will review your application within 5-7 business days." },
      { q: "What is the verification process?", a: "We verify registration documents, conduct site visits, check operational history, and validate community impact. This ensures donations reach genuine organizations." },
      { q: "Is there a minimum order for receiving donations?", a: "There's no minimum. We match available donations with verified recipient needs, whether it's a small community center or a large NGO." },
    ],
  },
  {
    category: "For Volunteers",
    questions: [
      { q: "What volunteer opportunities are available?", a: "We need help with logistics and distribution, awareness campaigns, fundraising drives, local coordination, and data entry/documentation." },
      { q: "Is there a minimum time commitment?", a: "No minimum commitment required! Whether you can spare a few hours or dedicate regular time, we have opportunities for every schedule." },
      { q: "Do volunteers receive any training?", a: "Yes, all volunteers receive orientation training covering food safety, medicine handling, logistics protocols, and our code of conduct." },
    ],
  },
];

const FAQ = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Find answers to common questions about donating, volunteering, and partnering with us.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-10">
          {faqData.map((section) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">{section.category}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.questions.map((faq, i) => (
                  <AccordionItem key={i} value={`${section.category}-${i}`} className="bg-card rounded-xl border-none shadow-card px-5">
                    <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default FAQ;
