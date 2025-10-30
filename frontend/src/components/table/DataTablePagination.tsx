// import React from "react";
// import { CustomizePageSize } from "./CustomizePageSize"; // adjust path
// import type { Table } from "@tanstack/react-table";

// interface DataTablePaginationProps<TData> {
//   skip: number;
//   take: number;
//   setSkip: (value: number) => void;
//   setTake: (value: number) => void;
//   totalRecords: number;
//   table?: Table<TData>; // ✅ Add table here
// }

// export function DataTablePagination<TData>({
//   skip,
//   take,
//   setSkip,
//   setTake,
//   totalRecords,
//   table,
// }: DataTablePaginationProps<TData>) {
//   console.log(skip,take,">>>>>>>>>>>>>>>>>>>>>>>>>");
  
//   const totalPages = Math.ceil(totalRecords / take);

//   const goToPage = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setSkip(page);
//   };

//   return (
//     <div className="flex items-center justify-between mt-4 text-amber-50">
//       {/* Page Size Selector */}
//       <CustomizePageSize
//         take={take}
//         setTake={setTake}
//         setSkip={setSkip}
//         table={table}
//       />

//       {/* Pagination Buttons */}
//       <div className="flex items-center space-x-2">
//         <button
//           className="px-2 py-1 border rounded bg-amber-50 text-black"
//           onClick={() => goToPage(skip - 1)}
//           disabled={skip === 1}
//         >
//           Prev
//         </button>
//         <span>
//           Page {skip} of {totalPages}
//         </span>
//         <button
//           className="px-2 py-1 border rounded bg-amber-50 text-black"
//           onClick={() => {
//             goToPage(skip + 1); // call your pagination function
//             // alert("clicked"); // optional alert
//           }}
//           disabled={skip === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { CustomizePageSize } from "./CustomizePageSize"; 
import type { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<TData> {
  skip: number;
  take: number;
  setSkip: (value: number) => void;
  setTake: (value: number) => void;
  totalRecords: number;
  table?: Table<TData>;
}

export function DataTablePagination<TData>({
  skip,
  take,
  setSkip,
  setTake,
  totalRecords,
  table,
}: DataTablePaginationProps<TData>) {
  const totalPages = Math.ceil(totalRecords / take);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setSkip(page);
  };

  return (
    <div className="flex items-center justify-between mt-4 text-black">
      {/* Page size dropdown */}
      <CustomizePageSize
        take={take}
        setTake={setTake}
        setSkip={setSkip}
        table={table}
      />

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50"
          onClick={() => goToPage(skip - 1)}
          disabled={skip === 1}
        >
          Prev
        </button>

        <span>
          Page {skip} of {totalPages || 1}
        </span>

        <button
          className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50"
          onClick={() => goToPage(skip + 1)}
          disabled={skip === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}
