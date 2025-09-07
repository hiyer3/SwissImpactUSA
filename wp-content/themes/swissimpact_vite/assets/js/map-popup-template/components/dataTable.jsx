import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

const DataTable = ({
  data,
  columns,
  onSort,
  sortConfig,
  cellWidth = "150px",
  idColumnWidth = "45px",
}) => {
  const [openItems, setOpenItems] = useState(new Set());

  // Initialize all items as open when data changes
  useEffect(() => {
    const allItemIds = new Set(data.map((item, index) => item.id || index));
    setOpenItems(allItemIds);
  }, [data]);

  const handleSort = (column) => {
    if (onSort) {
      onSort(column);
    }
  };

  const toggleItem = (itemId) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const renderCellContent = (column, item) => {
    if (column.allowHTML) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: item[column.key] }}
        />
      );
    } else if (column.render) {
      return column.render(item[column.key], item);
    } else {
      return item[column.key];
    }
  };

  return (
    <div className="mt-4 pb-8 min-w-0 xl:h-full min-h-[350px] max-h-[650px] overflow-y-auto popup-table-content">
      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="border-separate data-table border-spacing-y-1 table-fixed w-full sa-table-data">
          <thead>
            <tr>
              {/* ID column - always first */}
              <th
                className="text-left text-sm font-semibold text-gray-700 cursor-pointer px-2"
                style={{ width: idColumnWidth, minWidth: idColumnWidth }}
                onClick={() => handleSort("id")}
              >
                ID
                {sortConfig && sortConfig.key === "id" && (
                  <span className={`sort-icon ${sortConfig.direction} ml-1`}>
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left text-sm font-semibold text-gray-700 cursor-pointer px-2"
                  style={{
                    width: column.width || cellWidth,
                    minWidth: column.minWidth || column.width || cellWidth,
                  }}
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  {sortConfig && sortConfig.key === column.key && (
                    <span className={`sort-icon ${sortConfig.direction} ml-1`}>
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                {/* ID column - always first */}
                <td
                  className="text-sm text-gray-800 overflow-hidden px-2"
                  style={{ width: idColumnWidth, minWidth: idColumnWidth }}
                >
                  {item.id}
                </td>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="text-sm text-gray-800 overflow-hidden px-2"
                    style={{
                      width: column.width || cellWidth,
                      minWidth: column.minWidth || column.width || cellWidth,
                    }}
                    title={
                      column.render
                        ? String(column.render(item[column.key], item))
                        : String(item[column.key] || "")
                    }
                  >
                    {renderCellContent(column, item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Accordion View */}
      <div className="md:hidden">
        {data.map((item, index) => {
          const itemId = item.id || index;
          const isOpen = openItems.has(itemId);
          
          return (
            <div
              key={itemId}
              className="border-b border-gray-200 bg-white shadow-sm"
            >
              {/* Accordion Header */}
              <button
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => toggleItem(itemId)}
              >
                <div className="flex items-center">
                  {/* Show only first column value as main content */}
                  {columns.length > 0 && (
                    <span className="text-sm font-semibold text-gray-900">
                      {renderCellContent(columns[0], item)}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="space-y-3 pt-3">
                    {columns.map((column) => (
                      <div key={column.key} className="flex flex-col space-y-1">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          {column.label}
                        </div>
                        <div className="text-sm text-gray-800 break-words">
                          {renderCellContent(column, item)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Empty state */}
        {data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;