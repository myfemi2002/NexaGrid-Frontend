"use client";

import { UploadCloud, X } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  label: string;
  file: File | null;
  existingFileName?: string | null;
  accept?: string;
  hint?: string;
  onChange: (file: File | null) => void;
};

export function FileDropzone({
  label,
  file,
  existingFileName,
  accept = ".png,.jpg,.jpeg,.pdf",
  hint = "PNG, JPG or PDF (Max 5MB)",
  onChange,
}: FileDropzoneProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const activeName = file?.name ?? existingFileName ?? null;

  return (
    <div>
      <label className="mb-3 block text-lg font-medium text-[#0b1c30]" htmlFor={id}>
        {label}
      </label>
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const nextFile = event.dataTransfer.files?.[0] ?? null;
          onChange(nextFile);
        }}
        className={cn(
          "flex min-h-[270px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[#c6d2c3] bg-[#eef4ff] px-6 py-8 text-center transition",
          dragging && "border-[#003b1b] bg-[#e6efff]"
        )}
      >
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#c8efd1] text-[#003b1b]">
          <UploadCloud className="size-9" />
        </div>
        <p className="mt-6 text-[2rem] font-medium tracking-[-0.03em] text-[#0b1c30]">Drag and drop or click to browse</p>
        <p className="mt-2 text-lg text-[#4a5f50]">{hint}</p>
        {activeName ? (
          <div className="mt-6 flex items-center gap-3 rounded-full bg-white px-5 py-3 text-base font-medium text-[#0b1c30] shadow-sm">
            <span className="max-w-[220px] truncate">{activeName}</span>
            <button
              className="rounded-full p-1 text-[#5a6575] transition hover:bg-[#eef4ff] hover:text-[#003b1b]"
              type="button"
              onClick={(event) => {
                event.preventDefault();
                onChange(null);
              }}
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}
        <input
          id={id}
          className="hidden"
          type="file"
          accept={accept}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
