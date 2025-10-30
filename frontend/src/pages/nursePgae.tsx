import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../components/table/DataTable";
import {
  EllipsisVertical,
  LoaderIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";
import { nurseService } from "../lib/nurseService";
import type { ColumnDef } from "@tanstack/react-table";
import NurseModal from "../components/nurse/NurseModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type Nurse = {
  id: number;
  name: string;
  age: number;
  license_number: string;
  dob: string;
};

type SortConfig = {
  key: keyof Nurse | null;
  direction: "asc" | "desc" | null;
};

export default function NurseList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [modalType, setModalType] = useState<
    "create" | "edit" | "view" | "delete" | null
  >(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["nurses", page, limit],
    queryFn: () => nurseService.fetchNurses({ page, limit }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => nurseService.deleteNurse(id),
    onSuccess: () => {
      toast.success("Nurse deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["nurses"] });
    },
  });

  // Handle sorting
  const handleSort = (key: keyof Nurse) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    if (!data?.data) return [];

    const term = searchTerm.trim().toLowerCase();
    let filtered = data.data;

    // 🔹 Filtering
    if (term) {
      filtered = data.data.filter((nurse: Nurse) => {
        const ageMatch = nurse.age.toString().includes(term);
        const nameMatch = nurse.name.toLowerCase().includes(term);
        const licenseMatch = nurse.license_number.toLowerCase().includes(term);
        const dobMatch = nurse.dob.toLowerCase().includes(term);
        return nameMatch || licenseMatch || dobMatch || ageMatch;
      });
    }

    // 🔹 Sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, data, sortConfig]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!data?.data) return [];
    return filteredAndSortedData;
  }, [filteredAndSortedData]);

  const handleDownload = (type: "csv" | "xlsx") => {
    const dataToExport = filteredAndSortedData.map((nurse: any) => ({
      ID: nurse.id,
      Name: nurse.name,
      Age: nurse.age,
      License: nurse.license_number,
      "Date of Birth": nurse.dob,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nurses");

    if (type === "csv") {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "nurses.csv");
    } else {
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "nurses.xlsx");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof Nurse }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 ml-2 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-2 text-blue-500" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-2 text-blue-500" />
    );
  };

  const columns: ColumnDef<Nurse>[] = [
    {
      accessorKey: "id",
      header: () => (
        <button
          onClick={() => handleSort("id")}
          className="flex items-center hover:text-blue-600 font-semibold"
        >
          ID
          <SortIcon columnKey="id" />
        </button>
      ),
    },
    {
      accessorKey: "name",
      header: () => (
        <button
          onClick={() => handleSort("name")}
          className="flex items-center hover:text-blue-600 font-semibold"
        >
          Name
          <SortIcon columnKey="name" />
        </button>
      ),
    },

    {
      accessorKey: "license_number",
      header: () => (
        <button
          onClick={() => handleSort("license_number")}
          className="flex items-center hover:text-blue-600 font-semibold"
        >
          License Number
          <SortIcon columnKey="license_number" />
        </button>
      ),
    },
    {
      accessorKey: "dob",
      header: () => (
        <button
          onClick={() => handleSort("dob")}
          className="flex items-center hover:text-blue-600 font-semibold"
        >
          Date of Birth
          <SortIcon columnKey="dob" />
        </button>
      ),
      cell: ({ row }) => {
        const dob = row.original.dob;
        if (!dob) return "N/A";
        const date = new Date(dob);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
      },
    },
    {
      accessorKey: "age",
      header: () => (
        <button
          onClick={() => handleSort("age")}
          className="flex items-center hover:text-blue-600 font-semibold"
        >
          Age
          <SortIcon columnKey="age" />
        </button>
      ),
    },
    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const nurse = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-gray-100">
                <EllipsisVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedNurse(nurse);
                  setModalType("view");
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedNurse(nurse);
                  setModalType("edit");
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedNurse(nurse);
                  setModalType("delete");
                }}
                className="text-red-600"
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center mt-10">Failed to load nurses.</p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center mt-10 px-4">
      {/* Header */}
      <div className="w-full max-w-7xl mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">
          Nurse Management
        </h1>
        <p className="text-gray-500 text-center">
          CRUD Operations Using Node.js With MySQL
        </p>
      </div>

      {/* Search bar & Buttons */}
      <div className="flex gap-3 w-full max-w-7xl mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search Here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={() => handleDownload("csv")}
          variant="outline"
          className="bg-white"
        >
          Download CSV
        </Button>
        <Button
          onClick={() => handleDownload("xlsx")}
          variant="outline"
          className="bg-white"
        >
          Download Excel
        </Button>
        <Button
          onClick={() => {
            setModalType("create");
            setSelectedNurse(null);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Row
        </Button>
      </div>

      {/* Data Table */}
      <div className="w-full max-w-7xl bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={paginatedData}
          pagination={{
            page,
            limit,
            totalRecords: data?.total || 0, // ✅ use backend total count
            onPageChange: setPage,
            onPageSizeChange: setLimit,
          }}
        />
      </div>

      {/* Modal for Create/Edit/View/Delete */}
      {modalType && (
        <NurseModal
          type={modalType}
          nurse={selectedNurse}
          onClose={() => setModalType(null)}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}
    </div>
  );
}
