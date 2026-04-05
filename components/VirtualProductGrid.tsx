'use client';

import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Product } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

interface VirtualProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
}

export default function VirtualProductGrid({ products, viewMode = 'grid' }: VirtualProductGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // For a grid, we need to calculate rows based on column count
  // We'll estimate columns based on standard responsive breakpoints
  const colCount = viewMode === 'list' ? 1 : 4; // Simplified for initial version
  const rowCount = Math.ceil(products.length / colCount);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => viewMode === 'list' ? 150 : 380, // Pixels
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={`h-[800px] overflow-auto scrollbar-hide no-scroll-jank content-visibility-auto perf-gpu`}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const startIndex = virtualRow.index * colCount;
          const rowItems = products.slice(startIndex, startIndex + colCount);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6" : "space-y-4 px-2"}
            >
              {rowItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
