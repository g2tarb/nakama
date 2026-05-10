'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Hauteur max en vh (défaut 85) */
  maxHeightVh?: number;
}

/**
 * Bottom sheet glissable façon iOS / Android natifs.
 * - Drag handle en haut, ferme en swipe down si user dépasse 100 px ou velocity > 500
 * - Backdrop tap = ferme
 * - Esc key = ferme
 * - Body scroll lock pendant ouverture
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  maxHeightVh = 85,
}: BottomSheetProps) {
  // Lock scroll body
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  function handleDragEnd(_e: unknown, info: PanInfo) {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Bottom sheet'}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 36,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            style={{
              maxHeight: `${maxHeightVh}vh`,
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            className="bg-card border-border/60 fixed inset-x-0 bottom-0 z-[61] flex flex-col rounded-t-[22px] border-t shadow-[var(--shadow-elevated)]"
          >
            {/* Drag handle */}
            <div className="flex cursor-grab justify-center pt-3 pb-2 active:cursor-grabbing">
              <span
                aria-hidden="true"
                className="bg-text-tertiary/50 h-1 w-10 rounded-full"
              />
            </div>

            {title && (
              <div className="border-border/40 flex items-center justify-between border-b px-5 pb-3">
                <h3 className="text-text-primary text-[15px] font-semibold">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fermer"
                  className="text-text-tertiary hover:text-text-primary -mr-2 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div className="overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
