import { h } from "preact";

export const LoadingState = ({ message = "Loading data..." }) => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    <span className="ml-3 text-gray-600">{message}</span>
  </div>
);

export const ErrorState = ({ error }) => (
  <div className="flex justify-center items-center py-20">
    <div className="text-red-600">
      <p className="text-lg font-semibold">Error loading data</p>
      <p className="text-sm">{error}</p>
    </div>
  </div>
);

export const EmptyState = ({ message }) => (
  <div className="flex justify-center items-center py-20">
    <div className="text-gray-600">
      <p className="text-lg font-semibold">No Data Available</p>
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

export const NoResultsState = ({ searchTerm, entityLabel = "items" }) => (
  <div className="flex justify-center items-center py-20">
    <div className="text-gray-600">
      <p className="text-lg font-semibold">No Results Found</p>
      <p className="text-sm">
        No {entityLabel} match your search &ldquo;{searchTerm}&rdquo;
      </p>
    </div>
  </div>
);
