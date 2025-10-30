// src/components/nurse/NurseModal.tsx
import React, { useState } from "react";
import { nurseService } from "../../lib/nurseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Nurse = {
  id?: number;
  name: string;
  age: number;
  license_number: string;
  dob: string;
};

type NurseModalProps = {
  type: "create" | "edit" | "view" | "delete";
  nurse: Nurse | null;
  onClose: () => void;
  onDelete: (id: number) => void;
};

export default function NurseModal({
  type,
  nurse,
  onClose,
  onDelete,
}: NurseModalProps) {
  const [form, setForm] = useState<Nurse>(
    nurse || { name: "", age: 0, license_number: "", dob: "" }
  );
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Nurse) =>
      type === "edit"
        ? nurseService.updateNurse(data.id!, data)
        : nurseService.createNurse(data),
    onSuccess: () => {
      toast.success(
        `Nurse ${type === "edit" ? "updated" : "created"} successfully!`
      );
      queryClient.invalidateQueries({ queryKey: ["nurses"] });
      onClose();
    },
  });

  if (type === "delete") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md w-96">
          <p>Are you sure you want to delete this nurse?</p>
          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="mr-2 px-4 py-1 border rounded">
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(nurse?.id!);
                onClose();
              }}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl mb-4 capitalize">{type} Nurse</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(form);
          }}
          className="space-y-3"
        >
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              placeholder="Enter name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={type === "view"}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">
              License Number
            </label>
            <input
              placeholder="Enter license number"
              value={form.license_number}
              onChange={(e) =>
                setForm({ ...form, license_number: e.target.value })
              }
              disabled={type === "view"}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={
                form.dob ? new Date(form.dob).toISOString().split("T")[0] : ""
              }
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              readOnly={type === "view"}
              className={`w-full border p-2 rounded ${
                type === "view" ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Age</label>
            <input
              placeholder="Enter age"
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: +e.target.value })}
              disabled={type === "view"}
              className="w-full border p-2 rounded"
            />
          </div>
          {type !== "view" && (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {type === "edit" ? "Save Changes" : "Create Nurse"}
            </button>
          )}
        </form>

        <button onClick={onClose} className="mt-3 text-gray-500 w-full">
          Close
        </button>
      </div>
    </div>
  );
}
