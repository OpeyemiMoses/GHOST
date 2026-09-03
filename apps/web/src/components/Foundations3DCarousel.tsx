import React, { useState, useRef } from 'react';
import { Lock, Cpu, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

interface PrincipleItem {
  id: number;
  title: string;
  description: string;
  codeSnippet?: string;
  metaLabel: string;
  metaValue: string;
  icon: React.ElementType;
}

export const Foundations3DCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const principles: PrincipleItem[] = [
    {
      id: 0,
      title: 'Encrypted by Construction',
      description: 'Balances are encrypted client-side using authorized wallet keys into euint64 data types before broadcasting to Ethereum RPC nodes.',
      codeSnippet: 'euint64 balance = FHE.asEuint64(input)',
      metaLabel: 'Primitive',
      metaValue: 'Zama fhEVM Sepolia',
      icon: Lock,
    },
    {
      id: 1,
      title: 'Homomorphic Computation',
      description: 'Smart contracts compute math over ciphertexts. Enc(A) + Enc(B) = Enc(A+B) executes onchain without ever decrypting intermediate values.',
      codeSnippet: 'euint64 newTotal = FHE.add(bal, dep)',
      metaLabel: 'Coprocessor',
      metaValue: 'Torus FHE Engine',
      icon: Cpu,
    },
    {
      id: 2,
      title: 'Public Verifiability',
      description: 'Protocol state roots, commitment hashes, and contract transitions remain 100% auditable and verifiable on Sepolia Etherscan by any observer.',
      codeSnippet: 'bytes32 stateRoot = keccak256(handles)',
      metaLabel: 'Proof',
      metaValue: 'Merkle State Commitments',
      icon: Shield,
    },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      // Swiped Left -> Move forward
      setActiveIndex((prev) => (prev + 1) % principles.length);
    } else if (diff < -45) {
      // Swiped Right -> Move backward
      setActiveIndex((prev) => (prev - 1 + principles.length) % principles.length);
    }
  };

  const getCardStyle = (index: number) => {
    const total = principles.length;
    const diff = (index - activeIndex + total) % total;

    if (diff === 0) {
      // Center Card (In Focus, Elevated, High Contrast)
      return {
        transform: 'translate3d(0px, 0px, 60px) scale(1.05) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'blur(0px)',
        cardBg: 'bg-black text-white border-zinc-700 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] ring-2 ring-white/10',
        iconBg: 'bg-zinc-900 border-zinc-800 text-emerald-400',
        textColor: 'text-white',
        descColor: 'text-zinc-300',
        metaBorder: 'border-zinc-800 text-zinc-500',
      };
    } else if (diff === 1) {
      // Right Card (Receded in depth)
      return {
        transform: 'translate3d(240px, 0px, -70px) scale(0.88) rotateY(-14deg)',
        zIndex: 10,
        opacity: 0.65,
        filter: 'blur(1.5px)',
        cardBg: 'bg-white text-zinc-900 border-[#eae2d5] shadow-xl',
        iconBg: 'bg-[#faf8f5] border-[#e4dcd0] text-zinc-900',
        textColor: 'text-zinc-950',
        descColor: 'text-zinc-600',
        metaBorder: 'border-zinc-100 text-zinc-400',
      };
    } else {
      // Left Card (Receded in depth)
      return {
        transform: 'translate3d(-240px, 0px, -70px) scale(0.88) rotateY(14deg)',
        zIndex: 10,
        opacity: 0.65,
        filter: 'blur(1.5px)',
        cardBg: 'bg-white text-zinc-900 border-[#eae2d5] shadow-xl',
        iconBg: 'bg-[#faf8f5] border-[#e4dcd0] text-zinc-900',
        textColor: 'text-zinc-950',
        descColor: 'text-zinc-600',
        metaBorder: 'border-zinc-100 text-zinc-400',
      };
    }
  };

  return (
    <div className="relative w-full py-12 select-none">
      
      {/* 3D Perspective Stage */}
      <div
        className="relative w-full max-w-4xl mx-auto h-[440px] flex items-center justify-center [perspective:1200px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {principles.map((item, idx) => {
          const style = getCardStyle(idx);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              style={{
                transform: style.transform,
                zIndex: style.zIndex,
                opacity: style.opacity,
                filter: style.filter,
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`absolute w-full max-w-[340px] sm:max-w-[380px] h-[360px] p-8 rounded-[2.5rem] border cursor-pointer flex flex-col justify-between ${style.cardBg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${style.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono opacity-50 font-bold">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className={`font-bold text-lg mb-2.5 tracking-tight ${style.textColor}`}>
                  {item.title}
                </h3>

                <p className={`text-xs leading-relaxed mb-4 ${style.descColor}`}>
                  {item.description}
                </p>

                {item.codeSnippet && (
                  <div className="p-2.5 rounded-xl bg-black/10 dark:bg-zinc-900/80 border border-black/5 dark:border-zinc-800 text-[11px] font-mono opacity-90 truncate">
                    <code>{item.codeSnippet}</code>
                  </div>
                )}
              </div>

              <div className={`pt-4 border-t text-[11px] font-mono flex items-center justify-between ${style.metaBorder}`}>
                <span>{item.metaLabel}</span>
                <span className="font-medium text-right">{item.metaValue}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel Controls & Endless Dots */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + principles.length) % principles.length)}
          className="w-8 h-8 rounded-full bg-white border border-[#e4dcd0] text-zinc-700 hover:text-black flex items-center justify-center shadow-xs transition-transform hover:scale-105"
          aria-label="Previous Principle"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {principles.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-6 bg-zinc-900' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setActiveIndex((prev) => (prev + 1) % principles.length)}
          className="w-8 h-8 rounded-full bg-white border border-[#e4dcd0] text-zinc-700 hover:text-black flex items-center justify-center shadow-xs transition-transform hover:scale-105"
          aria-label="Next Principle"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
