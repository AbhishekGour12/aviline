export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E1ECD2] via-[#D4E5C3] to-[#E1ECD2]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#588157] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[#344E41] font-semibold">
        Loading Dashboard...
      </p>
      <p className="text-[#52796F] text-sm mt-1">
        Fetching your store insights
      </p>
    </div>
  </div>
);

export const TableLoader = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-[#CADDB7] rounded w-3/4"></div>
    <div className="h-4 bg-[#CADDB7] rounded w-full"></div>
    <div className="h-4 bg-[#CADDB7] rounded w-5/6"></div>
    <div className="h-4 bg-[#CADDB7] rounded w-2/3"></div>
  </div>
);

export const ChartLoader = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-[#588157] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-[#52796F] text-sm">
        Loading analytics...
      </p>
    </div>
  </div>
);