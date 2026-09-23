import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';

interface VerifiedCheckmarkProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showGlow?: boolean;
  className?: string;
}

export const VerifiedCheckmark: React.FC<VerifiedCheckmarkProps> = ({
  size = 'md',
  showGlow = true,
  className = ''
}) => {
  const dimensions = {
    xs: { box: 16, stroke: 2.2, r: 7 },
    sm: { box: 20, stroke: 2.4, r: 8 },
    md: { box: 36, stroke: 2.8, r: 15 },
    lg: { box: 52, stroke: 3.4, r: 22 }
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Subtle expanding halo ring for newly verified state */}
      {showGlow && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0.9 }}
          animate={{ scale: [0.8, 1.35, 1.55], opacity: [0.9, 0.4, 0] }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-emerald-400/40 pointer-events-none"
        />
      )}

      {/* Main SVG Checkmark with drawn path */}
      <motion.svg
        width={dimensions.box}
        height={dimensions.box}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 24
        }}
        className="relative z-10 drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)]"
      >
        {/* Background Circle Border */}
        <motion.circle
          cx="20"
          cy="20"
          r="17"
          className="fill-emerald-950/40 stroke-emerald-400/80"
          strokeWidth={dimensions.stroke}
          initial={{ pathLength: 0, scale: 0.8 }}
          animate={{ pathLength: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* Inner Solid Badge Accent */}
        <motion.circle
          cx="20"
          cy="20"
          r="14"
          className="fill-emerald-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.12, duration: 0.28, type: 'spring', stiffness: 380, damping: 22 }}
        />

        {/* Drawn Checkmark Path */}
        <motion.path
          d="M12 20.5L17.5 26L28 14.5"
          stroke="white"
          strokeWidth={dimensions.stroke + 0.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { delay: 0.22, duration: 0.38, ease: [0.2, 0.8, 0.2, 1] },
            opacity: { delay: 0.18, duration: 0.1 }
          }}
        />
      </motion.svg>
    </div>
  );
};

interface DigiLockerSuccessToastProps {
  notification: {
    docName: string;
    issuer?: string;
    docId?: string;
  } | null;
  onClose: () => void;
}

export const DigiLockerSuccessToast: React.FC<DigiLockerSuccessToastProps> = ({
  notification,
  onClose
}) => {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/50 shadow-2xl shadow-emerald-950/80 backdrop-blur-xl text-left"
        >
          <div className="flex items-start space-x-3.5">
            {/* Subtle Animated Checkmark in Toast */}
            <div className="shrink-0 mt-0.5">
              <VerifiedCheckmark size="md" showGlow={true} />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    DIGILOCKER VERIFIED
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    IT Act Sec 9A
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  title="Close notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug truncate">
                {notification.docName}
              </h4>

              <p className="text-[11px] text-slate-300 leading-tight">
                Cryptographically retrieved & approved. Scrutiny exemption active for FY 2026-27.
              </p>

              {notification.issuer && (
                <div className="pt-1 text-[10px] font-mono text-emerald-300/80 truncate">
                  Issuer: {notification.issuer}
                </div>
              )}
            </div>
          </div>

          {/* Bottom subtle progress line */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 4.5, ease: 'linear' }}
            className="h-0.5 bg-emerald-400/60 rounded-full mt-3"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
