import React from 'react';
import { ShieldCheck, Info, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#06080d] py-10 px-4 sm:px-6 lg:px-8 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-white font-bold font-display text-base">scholarmatch-ai</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                CX0705 — MUSA CODEX 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              “Safer Applications. Brighter Tomorrows.” — An intelligent decision-support platform that safeguards students against administrative disqualification by validating cross-scheme mutual-exclusivity and quota compatibility before application.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-400">
              <span>Domain: Smart Education (EdTech)</span>
              <span>•</span>
              <span>State Focus: Maharashtra (MahaDBT) + Central (NSP)</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Safety Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-purple-300 transition-colors cursor-pointer">Aadhaar-Portal Deduplication Check</li>
              <li className="hover:text-purple-300 transition-colors cursor-pointer">Central vs State Tuition Conflict Matrix</li>
              <li className="hover:text-purple-300 transition-colors cursor-pointer">CSR Private Aid Complementarity</li>
              <li className="hover:text-purple-300 transition-colors cursor-pointer">NLP PDF Rule Parsing Engine</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Official Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                  <span>MahaDBT Maharashtra</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                  <span>National Scholarship Portal (NSP)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.aicte-india.org" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                  <span>AICTE Portals</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Prominent Mandatory Safety Disclaimer */}
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-400 flex items-start space-x-3">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="text-purple-300 font-semibold">Important Prototype Notice & Disclaimer:</span> scholarmatch-ai provides advisory decision-support based on configured rules and scholarship schemes loaded into this prototype. Rules and portal eligibility conditions are subject to revision by respective government and private awarding bodies. Always verify the latest official scholarship guidelines before submitting an application.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 scholarmatch-ai — MUSA CODEX Hackathon Prototype.</p>
          <p className="mt-2 sm:mt-0 font-mono">Prototype Build v2.4 • Maharashtra Region Engine</p>
        </div>
      </div>
    </footer>
  );
};
