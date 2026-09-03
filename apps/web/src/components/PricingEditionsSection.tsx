import React from 'react';
import { useGhost } from '../context/GhostContext';

export const PricingEditionsSection: React.FC = () => {
  const { setCurrentView } = useGhost();

  // Exactly matching Oscilla M1 Screenshot 1 "EDITIONS":
  // STUDIO £1,890 / SIGNATURE £2,640 / COLLECTOR £4,200
  const editions = [
    {
      id: 'studio',
      tier: 'STUDIO',
      price: '£1,890',
      description: 'The instrument as drawn. Walnut cheeks, anodised fascia, forty-nine keys.',
      features: [
        '3 × VCO · noise · ladder filter',
        'Monophonic, 49 keys',
        'American walnut, oiled',
        '2048² anodised fascia',
      ],
      isHighlighted: false,
      cta: 'HEAR THIS ONE',
    },
    {
      id: 'signature',
      tier: 'SIGNATURE',
      price: '£2,640',
      description: 'Adds the polyphonic struck-string voice and the flight case it should have come in.',
      features: [
        'Everything in Studio',
        'Polyphonic struck-string engine',
        'Sustain pedal and dampers',
        'Fitted flight case',
      ],
      isHighlighted: true, // Orange button and highlight border
      cta: 'HEAR THIS ONE',
    },
    {
      id: 'collector',
      tier: 'COLLECTOR',
      price: '£4,200',
      description: 'Hand-numbered, brass fascia, and a service contract for an instrument that cannot break.',
      features: [
        'Everything in Signature',
        'Brass fascia, hand-numbered',
        'Matched oscillator set',
        'Lifetime service',
      ],
      isHighlighted: false,
      cta: 'HEAR THIS ONE',
    },
  ];

  return (
    <section className="relative w-full py-24 bg-[#07080a] border-t border-white/10 px-6 sm:px-12 lg:px-20 text-white select-none">
      
      {/* 3 TIERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
        {editions.map((ed) => (
          <div
            key={ed.id}
            className={`p-8 rounded-2xl bg-[#0e1117] flex flex-col justify-between transition-all ${
              ed.isHighlighted
                ? 'border border-[#f97316]/60 shadow-[0_0_30px_rgba(249,115,22,0.1)]'
                : 'border border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className={`font-mono text-xs font-bold uppercase tracking-widest mb-3 ${
                ed.isHighlighted ? 'text-[#f97316]' : 'text-slate-500'
              }`}>
                {ed.tier}
              </div>

              <div className="font-display text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
                {ed.price}
              </div>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-8 font-sans">
                {ed.description}
              </p>

              <div className="space-y-3 font-mono text-xs text-slate-300 mb-8 border-t border-white/10 pt-6">
                {ed.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-slate-600">—</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`w-full py-3.5 rounded-sm font-mono text-xs font-bold tracking-widest uppercase transition-all ${
                  ed.isHighlighted
                    ? 'bg-[#f97316] text-white hover:bg-[#ea580c] shadow-lg'
                    : 'bg-white/5 border border-white/15 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {ed.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTNOTE DISCLAIMER (Exact Oscilla M1 Disclaimer) */}
      <div className="text-center font-mono text-[10px] text-slate-600 uppercase tracking-widest">
        NO INSTRUMENT IS FOR SALE — NO ORDER CAN BE PLACED — THIS IS A RENDERING EXERCISE
      </div>

    </section>
  );
};
