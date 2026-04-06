export const ProductSkeleton = () => (
  <div className="card h-full p-4 space-y-4 animate-pulse">
    <div className="aspect-square bg-sand-200 rounded-2xl w-full" />
    <div className="space-y-2">
      <div className="h-4 bg-sand-200 rounded w-3/4" />
      <div className="h-4 bg-sand-200 rounded w-1/2" />
    </div>
    <div className="flex justify-between items-center pt-4">
      <div className="h-6 bg-sand-200 rounded w-1/4" />
      <div className="h-10 bg-sand-200 rounded-xl w-1/3" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);
