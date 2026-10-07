import * as React from "react";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileDropzoneProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  error?: string;
  className?: string;
}

export function FileDropzone({
  value,
  onChange,
  accept = ".pdf,.doc,.docx,.ppt,.pptx",
  maxSizeMB = 25,
  error: controlledError,
  className,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const error = controlledError || internalError;

  const handleFile = (file: File) => {
    setInternalError(null);
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setInternalError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2",
            isDragOver
              ? "border-primary bg-primary/5 scale-[1.005]"
              : "border-border hover:border-primary/50 hover:bg-muted/30 bg-surface",
            error && "border-destructive/60 bg-destructive/5"
          )}
        >
          <div className="size-10 rounded-full bg-[#EDEFFC] text-primary flex items-center justify-center">
            <UploadCloud className="size-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-foreground">
              <span className="text-primary font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              PDF, DOC, DOCX, PPT, PPTX (up to {maxSizeMB}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-primary/30 bg-[#EDEFFC]/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <File className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {value.name}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{formatFileSize(value.size)}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="size-3" /> Ready
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="size-7 rounded-lg hover:bg-black/5 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors cursor-pointer"
            title="Remove file"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}
