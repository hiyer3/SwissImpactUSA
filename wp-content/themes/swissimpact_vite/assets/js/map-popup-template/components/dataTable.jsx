import { h } from "preact";

const DataTable = ({
  data,
  columns,
  onSort,
  sortConfig,
  cellWidth = "150px",
  idColumnWidth = "45px",
}) => {
  const handleSort = (column) => {
    if (onSort) {
      onSort(column);
    }
  }; 

  return ( 
    <div className="mt-4 pb-8 min-w-0 h-[350px] xl:h-full min-h-[350px] max-h-[650px] overflow-y-auto popup-table-content">
      <div className="w-full overflow-x-auto">
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
                    {column.allowHTML  ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: item[column.key] }}
                      />
                    ) : column.render ? (
                      column.render(item[column.key], item)
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
