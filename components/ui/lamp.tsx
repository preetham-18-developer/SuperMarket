"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0 perf-gpu",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        {/* Optimized Left Light */}
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "15rem" }} // Reduced for mobile, desktop handled by media query classes
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[15rem] md:w-[30rem] bg-gradient-conic from-orange-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top] will-change-[width,opacity,transform] translate-z-0"
        >
          <div className="absolute w-full left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-full left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Optimized Right Light */}
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "15rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[15rem] md:w-[30rem] bg-gradient-conic from-transparent via-transparent to-orange-500 text-white [--conic-position:from_290deg_at_center_top] will-change-[width,opacity,transform] translate-z-0"
        >
          <div className="absolute w-40 h-full right-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Backdrop and Blurs - Significantly reduced for mobile */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-xl md:blur-2xl opacity-50 md:opacity-100"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-sm sm:backdrop-blur-md"></div>
        
        {/* Core Glow - Optimized size and blur */}
        <div className="absolute inset-auto z-50 h-24 sm:h-36 w-[12rem] sm:w-[28rem] -translate-y-1/2 rounded-full bg-orange-500 opacity-30 sm:opacity-40 blur-xl sm:blur-3xl"></div>
        
        {/* Central Beams */}
        <motion.div
          initial={{ width: "4rem" }}
          whileInView={{ width: "10rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-orange-400 blur-xl sm:blur-2xl will-change-[width]"
        ></motion.div>

        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "15rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-orange-400 will-change-[width]"
        ></motion.div>

        {/* Bottom masking */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950 "></div>
      </div>

      {/* Children container with slight offset adjustment for smaller screens */}
      <div className="relative z-50 flex -translate-y-40 sm:-translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};


