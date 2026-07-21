import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Receipt,
  Globe,
  Megaphone,
  Cpu,
  Share2,
  ArrowRight,
  Check,
  Mail,
  Phone,
  Building2,
  User,
  MessageSquare,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitToGoogleSheet } from "@/lib/google-sheets";
import { sanitize, validatePayload, isRateLimited, isBot } from "@/lib/security";

const INSTAGRAM_HANDLE = "_saphirex_";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sphirex — Smart Solutions. Real Growth." },
      {
        name: "description",
        content:
          "Sphirex builds billing systems, websites, marketing engines, and AI automation for small and growing businesses.",
      },
    ],
  }),
  component: SphirexLanding,
});

/* ------------------------------- Loader ---------------------------------- */

function SapphireLoader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2100);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center bg-[#0f0f0f] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      {/* horizontal speed lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px"
            style={{
              top: `${(i / 22) * 100}%`,
              left: 0,
              right: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(200,210,230,0.55) 45%, rgba(120,160,255,0.6) 55%, transparent 100%)",
            }}
            initial={{ x: "-100%", scaleX: 0.3 }}
            animate={{ x: "100%", scaleX: [0.3, 1.4, 0.3] }}
            transition={{
              duration: 0.55 + Math.random() * 0.5,
              repeat: Infinity,
              delay: Math.random() * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* sapphire */}
      <motion.div
        className="relative z-10"
        initial={{ x: "-30vw" }}
        animate={{ x: ["-30vw", "110vw"] }}
        transition={{ duration: 1.7, ease: [0.5, 0, 0.2, 1] }}
      >
        <SapphireGem className="h-16 w-16 drop-shadow-[0_0_25px_rgba(90,130,255,0.7)]" />
      </motion.div>

      {/* flash */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.9, 0] }}
        transition={{ duration: 2.1, times: [0, 0.85, 0.92, 1] }}
      />
    </motion.div>
  );
}

function SapphireGem({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <defs>
        <linearGradient id="sap-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9d8ff" />
          <stop offset="40%" stopColor="#5a82ff" />
          <stop offset="100%" stopColor="#1c2e7a" />
        </linearGradient>
        <linearGradient id="sap-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0f0f0" />
          <stop offset="100%" stopColor="#a8b0bd" />
        </linearGradient>
      </defs>
      <polygon points="32,4 60,24 44,60 20,60 4,24" fill="url(#sap-face)" stroke="url(#sap-edge)" strokeWidth="1.5" />
      <polygon points="32,4 44,24 20,24" fill="#8badff" opacity="0.55" />
      <polygon points="20,24 44,24 32,60" fill="#3d5cc0" opacity="0.65" />
      <polyline points="4,24 20,24 32,60 44,24 60,24" fill="none" stroke="url(#sap-edge)" strokeWidth="1" opacity="0.9" />
      <line x1="32" y1="4" x2="32" y2="60" stroke="url(#sap-edge)" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

/* ---------------------------------- Nav ---------------------------------- */

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/60 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <motion.a
          href="#top"
          className="flex items-center gap-2"
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <SapphireGem className="h-6 w-6" />
          <span className="font-display font-black tracking-widest text-lg text-chrome">
            SPHIREX
          </span>
        </motion.a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {[
            { label: "About", href: "#about" },
            { label: "Services", href: "#services" },
            { label: "Work", href: "#work" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="relative px-1 py-1 hover:text-foreground transition-colors"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
        <motion.a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold text-primary-foreground bg-chrome shadow-[var(--shadow-chrome)] hover:brightness-110 transition"
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.12 }}
        >
          Consultation <ArrowRight className="h-3.5 w-3.5" />
        </motion.a>
      </div>
    </header>
  );
}

/* --------------------------------- Hero ---------------------------------- */

function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-70" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full blur-3xl opacity-30"
        style={{ background: "var(--gradient-sapphire)" }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="h-px w-8 bg-chrome" />
          Smart Solutions. Real Growth.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-6 font-display font-black text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tight"
        >
          Technology That{" "}
          <span className="text-chrome">Runs Your Business</span>
          <br />
          <span className="text-muted-foreground/70">— Not the Other Way Around.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed"
        >
          Sphirex builds billing systems, websites, marketing engines, and AI-powered
          automation for small and growing businesses — so you can spend less time
          managing tools and more time growing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-md px-6 py-3.5 text-sm font-semibold text-primary-foreground bg-chrome shadow-[var(--shadow-chrome)] hover:brightness-110 transition"
          >
            Get a Free Consultation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold border border-border hover:border-foreground/40 hover:bg-secondary transition"
          >
            See Our Work
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10"
        >
          {[
            ["Systems", "Built to work"],
            ["Automation", "That saves hours"],
            ["Design", "That converts"],
            ["Support", "You can reach"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="font-display text-2xl text-chrome">{k}</div>
              <div className="mt-1 text-sm text-muted-foreground">{v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------- About --------------------------------- */

function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
            [ 01 ] Who We Are
          </div>
          <h2 className="mt-4 font-display font-black text-4xl md:text-5xl leading-tight">
            More than a<br />
            <span className="text-chrome">website.</span>
          </h2>
        </div>
        <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            Sphirex is a technology solutions agency built for small and medium
            businesses that need more than just a website — they need{" "}
            <span className="text-foreground">systems that actually work for them</span>.
            We combine software development, design, and automation to solve real
            business problems: slow billing processes, outdated websites, inconsistent
            marketing, and manual work that eats up your time.
          </p>
          <p>
            Founded by developers who've worked directly with local businesses, we
            understand the gap between "having a website" and "having a business tool
            that drives revenue." That's the gap we fill.
          </p>
          <div className="flex items-start gap-3 pt-4 border-t border-border">
            <Check className="h-5 w-5 text-chrome-bright shrink-0 mt-0.5" />
            <p className="text-base text-foreground/90">
              Every solution we build is tested on real businesses first — not just theory.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Services ------------------------------- */

const services = [
  {
    icon: Receipt,
    title: "Billing Software",
    body: "Custom billing and invoicing systems built around how your business actually works — inventory tracking, coupon/discount systems, customer records, and reports, all in one place.",
  },
  {
    icon: Globe,
    title: "Website Development",
    body: "Fast, SEO-optimized websites that turn visitors into customers. Built with clean design, mobile responsiveness, and your brand at the center.",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    body: "Data-driven marketing strategies to get your business in front of the right people — from local SEO to campaign planning.",
  },
  {
    icon: Cpu,
    title: "AI Automation & Solutions",
    body: "We automate the repetitive stuff — WhatsApp notifications, customer follow-ups, reporting, and workflows — using AI tools built specifically for your business.",
  },
  {
    icon: Share2,
    title: "Social Media Management",
    body: "Consistent, on-brand content and posting so your business stays visible and relevant, without you having to manage it yourself.",
  },
];

function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 40%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 md:py-32 border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
            [ 02 ] What We Do
          </div>
          <h2 className="mt-4 font-display font-black text-4xl md:text-6xl leading-tight">
            One connected <span className="text-chrome">system.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Five services. Built to flow into each other — not stacked on top of your day.
          </p>
        </div>

        <div className="relative mt-20">
          {/* Scroll Journey Line — spine */}
          <svg
            className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 h-full w-4 md:w-8 pointer-events-none"
            viewBox="0 0 20 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="spine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c0c0c0" />
                <stop offset="50%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#7a9dff" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line
              x1="10"
              y1="0"
              x2="10"
              y2="1000"
              stroke="rgba(200,210,230,0.08)"
              strokeWidth="2"
            />
            <motion.line
              x1="10"
              y1="0"
              x2="10"
              y2="1000"
              stroke="url(#spine)"
              strokeWidth="2.5"
              filter="url(#glow)"
              style={{ pathLength }}
            />
          </svg>

          <div className="space-y-10 md:space-y-20">
            {services.map((s, i) => (
              <ServiceRow key={s.title} service={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const Icon = service.icon;
  const isLeft = index % 2 === 0;

  const Content = (
    <div className={`${isLeft ? "md:text-right md:pr-16" : "md:pl-16 md:pr-0"}`}>
      <div className={`inline-flex items-center gap-3 mb-4 ${isLeft ? "md:flex-row-reverse" : ""}`}>
        <div className="h-11 w-11 grid place-items-center rounded-lg bg-secondary border border-border">
          <Icon className="h-5 w-5 text-chrome-bright" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          0{index + 1} / 05
        </span>
      </div>
      <h3 className="font-display font-bold text-2xl md:text-3xl mb-3">
        {service.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{service.body}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-16 items-center"
    >
      {/* node */}
      <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-6 -translate-x-1/2">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-chrome blur-md opacity-70 animate-pulse" />
          <div className="relative h-4 w-4 rounded-full bg-chrome border-2 border-background" />
        </div>
      </div>

      {isLeft ? (
        <>
          {Content}
          <div className="hidden md:block" />
        </>
      ) : (
        <>
          <div className="hidden md:block" />
          {Content}
        </>
      )}
    </motion.div>
  );
}

/* -------------------------------- Projects ------------------------------- */

function Projects() {
  return (
    <section id="work" className="relative py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
              [ 03 ] Our Work
            </div>
            <h2 className="mt-4 font-display font-black text-4xl md:text-6xl leading-tight">
              Built on <span className="text-chrome">real businesses.</span>
            </h2>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative rounded-2xl bg-card border border-border overflow-hidden hover:border-foreground/30 transition"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(90,130,255,0.35), transparent 60%), radial-gradient(circle at 70% 70%, rgba(200,210,230,0.25), transparent 55%), #0d0d10",
                }}
              />
              <div className="absolute inset-0 grid-lines opacity-40" />
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  <Receipt className="h-14 w-14 mx-auto text-chrome-bright mb-3" />
                  <div className="font-display font-black text-2xl text-chrome">
                    ABHAY EYE CARE
                  </div>
                  <div className="mt-1 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Billing Software
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-chrome-bright">
                  Case Study
                </span>
                <span className="text-xs text-muted-foreground">— Navi Mumbai</span>
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">
                Abhay Eye Care — Billing Software
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A complete billing and inventory management system built for an optical
                retail business. Features tiered coupon generation, automated WhatsApp
                customer notifications, and streamlined checkout — reducing manual
                billing time and improving customer retention.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded border border-border text-muted-foreground">
                    PHP
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded border border-border text-muted-foreground">
                    MySQL
                  </span>
                </div>
                <button className="inline-flex items-center gap-2 text-sm font-semibold text-chrome-bright hover:gap-3 transition-all">
                  View Case Study <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-2xl border border-dashed border-border overflow-hidden flex items-center justify-center min-h-[420px] p-10 text-center"
          >
            <div className="absolute inset-0 grid-lines opacity-30" />
            <div className="relative">
              <div className="h-14 w-14 mx-auto rounded-full border-2 border-dashed border-border grid place-items-center mb-5">
                <Cpu className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="font-display font-bold text-xl text-foreground/80">
                More projects coming soon
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs mx-auto">
                We ship quietly. New case studies from live client work are being
                prepared for release.
              </p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Contact -------------------------------- */

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // ── Security: honeypot bot detection ──
    if (isBot(formData)) {
      // Silently reject — don't tip off the bot
      form.reset();
      setSelectedService("");
      toast.success("Message received", {
        description: "We'll get back to you within 24 hours.",
      });
      return;
    }

    // ── Security: client-side rate limiting ──
    if (isRateLimited()) {
      toast.error("Too many submissions", {
        description: "Please wait a minute before trying again.",
      });
      return;
    }

    // ── Sanitise all inputs to prevent XSS / injection ──
    const payload = {
      name: sanitize(String(formData.get("name") ?? "")),
      business: sanitize(String(formData.get("business") ?? "")),
      email: sanitize(String(formData.get("email") ?? "")),
      phone: sanitize(String(formData.get("phone") ?? "")),
      service: selectedService || null,
      message: sanitize(String(formData.get("message") ?? "")),
    };

    // ── Validate all fields before submission ──
    const validation = validatePayload(payload);
    if (!validation.ok) {
      toast.error("Please check your input", {
        description: validation.reason,
      });
      return;
    }

    setSubmitting(true);
    const result = await submitToGoogleSheet(payload);
    setSubmitting(false);

    if (!result.ok) {
      console.error("Google Sheet submission failed:", result.error);
      toast.error("Submission failed", {
        description: result.error || "Please try again, or reach out to us directly.",
        duration: 8000,
      });
      return;
    }

    form.reset();
    setSelectedService("");
    toast.success("Message received!", {
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    });
  }, [selectedService]);

  return (
    <section id="contact" className="relative py-24 md:py-32 border-t border-border">
      <div
        className="absolute inset-x-0 top-0 h-[400px] blur-3xl opacity-20 pointer-events-none"
        style={{ background: "var(--gradient-sapphire)" }}
      />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="text-center">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
            [ 04 ] Contact
          </div>
          <h2 className="mt-4 font-display font-black text-4xl md:text-6xl leading-tight">
            Let's build something<br />
            <span className="text-chrome">that works.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Tell us about your business — we'll get back to you within 24 hours.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-14 rounded-2xl bg-card border border-border p-6 md:p-10 space-y-6"
        >
          {/* Honeypot field — invisible to users, traps bots */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
            <label htmlFor="website">Website</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Name" icon={User}>
              <Input required name="name" placeholder="Your full name" maxLength={200} />
            </Field>
            <Field label="Business Name" icon={Building2}>
              <Input required name="business" placeholder="Company / business" maxLength={200} />
            </Field>
            <Field label="Email" icon={Mail}>
              <Input required type="email" name="email" placeholder="you@business.com" maxLength={320} />
            </Field>
            <Field label="Phone Number" icon={Phone}>
              <Input required name="phone" placeholder="+91 00000 00000" maxLength={20} />
            </Field>
          </div>

          <div>
            <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">
              Service Interested In
            </Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="billing">Billing Software</SelectItem>
                <SelectItem value="web">Website Development</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="ai">AI Automation & Solutions</SelectItem>
                <SelectItem value="social">Social Media Management</SelectItem>
                <SelectItem value="other">Not sure yet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Field label="Message" icon={MessageSquare}>
            <Textarea
              required
              name="message"
              rows={5}
              maxLength={2000}
              placeholder="Tell us a bit about your business and what you're trying to solve."
            />
          </Field>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pt-2">
            <p className="text-xs text-muted-foreground">
              No spam, no sales pressure — just a real conversation about your business needs.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-3 rounded-md px-7 py-3.5 text-sm font-semibold text-primary-foreground bg-chrome shadow-[var(--shadow-chrome)] hover:brightness-110 transition disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Message"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Label>
      {children}
    </div>
  );
}

/* -------------------------------- Footer --------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <SapphireGem className="h-5 w-5" />
          <span className="font-display font-black tracking-widest text-chrome">
            SPHIREX
          </span>
          <span className="text-xs text-muted-foreground ml-3">
            Smart Solutions. Real Growth.
          </span>
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Sphirex on Instagram"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground font-mono hover:text-chrome-bright transition-colors"
        >
          <Instagram className="h-4 w-4" />@{INSTAGRAM_HANDLE}
        </a>

        <div className="text-xs text-muted-foreground font-mono">
          © {new Date().getFullYear()} Sphirex. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* --------------------------------- Page ---------------------------------- */

function SphirexLanding() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence>
        {loading && <SapphireLoader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
