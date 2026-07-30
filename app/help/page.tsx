"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import {
  HelpCircle,
  ShieldCheck,
  FileText,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Mail,
  PhoneCall,
} from "lucide-react";

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Jonomot (জনমত) and how does it improve civic transparency?",
      a: "Jonomot is an open, citizen-powered platform for Bangladesh where citizens can discover government offices, view accurate office hours, and share verified personal service experiences to foster public accountability.",
    },
    {
      q: "How are citizen reports verified by moderators?",
      a: "When submitting a report, citizens can attach supporting proof of visit (such as a token slip, bank challan receipt, or timestamped queue photo). Our volunteer civic moderators review these before awarding the 'Verified Visit' badge.",
    },
    {
      q: "Can I report corruption or misconduct anonymously?",
      a: "Yes. While standard reports display your username, you can contact the Anti-Corruption Commission (ACC) directly via national shortcode 106 or submit reports under an anonymized citizen profile in our settings.",
    },
    {
      q: "How can I add a missing government office to the directory?",
      a: "Click on 'Add Office' from the homepage or navigation bar. Fill in the institution name, address, and division. Once checked by a moderator, it will go live for everyone.",
    },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-on-surface-variant hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Dashboard</span>
        </Link>
      </div>

      {/* Hero Help */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark rounded-3xl p-8 sm:p-12 text-white shadow-md text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6 text-emerald-300" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          How Can We Help You Today?
        </h1>
        <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto font-light">
          Explore transparency guidelines, learn about the verification process, or get assistance from our civic moderation team.
        </p>
      </div>

      {/* Grid Quick Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-outline rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-background text-brand-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-brand-on-surface">
            Verification Standards
          </h3>
          <p className="text-sm text-brand-on-surface-variant leading-relaxed">
            Learn what makes a report verified and how our community maintains high trust and accuracy without bias.
          </p>
        </div>

        <div className="bg-white border border-brand-outline rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-background text-brand-primary flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-brand-on-surface">
            Required Documents Guide
          </h3>
          <p className="text-sm text-brand-on-surface-variant leading-relaxed">
            Discover check-lists for passport renewal, driving licenses, trade licenses, and municipal tax holdings.
          </p>
        </div>

        <div className="bg-white border border-brand-outline rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-background text-brand-primary flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-brand-secondary" />
          </div>
          <h3 className="text-lg font-bold text-brand-on-surface">
            National Emergency Contacts
          </h3>
          <p className="text-sm text-brand-on-surface-variant leading-relaxed">
            Direct access to National Helpline 999, ACC Anti-Corruption 106, and National Information Center 333.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-brand-outline rounded-3xl p-6 sm:p-10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-on-surface">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-brand-outline rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-brand-background transition-colors"
                >
                  <span className="font-semibold text-brand-on-surface text-sm sm:text-base">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-brand-on-surface-variant shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-5 pt-2 text-sm text-brand-on-surface-variant bg-white border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Footer */}
      <div className="bg-brand-background border border-brand-outline rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-brand-on-surface">
            Still Have Questions or Need Moderation Help?
          </h3>
          <p className="text-sm text-brand-on-surface-variant">
            Reach out to our civic volunteers and moderation coordinators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" className="gap-2">
            <Mail className="w-4 h-4" />
            <span>support@jonomot.com</span>
          </Button>
          <Button variant="secondary" className="gap-2">
            <PhoneCall className="w-4 h-4" />
            <span>Call 333</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
