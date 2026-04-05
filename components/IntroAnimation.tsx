"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import Image from 'next/image';

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if it's mobile to reduce animation load
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 1000); // Allow exit animation to finish
    }, 3500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, [onComplete]);

  // High-performance mobile fallback
  if (isMobile && show) {
     return (
        <motion.div
           initial={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.8 }}
           className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950"
        >
           <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center"
           >
              <h1 className="bg-gradient-to-br from-white to-orange-400 py-4 bg-clip-text text-center text-5xl font-black tracking-tight text-transparent">
                 SuperMarket
              </h1>
              <div className="h-0.5 w-24 bg-orange-500 mx-auto rounded-full mt-2" />
           </motion.div>
        </motion.div>
     );
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950"
        >
          <LampContainer>
            <motion.h1
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="mt-8 bg-gradient-to-br from-white to-orange-400 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
            >
              SuperMarket <br />
              <span className="text-2xl md:text-4xl font-light tracking-widest text-orange-200/50">
                QUALITY YOU CAN TRUST
              </span>
            </motion.h1>
          </LampContainer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

