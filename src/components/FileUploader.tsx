
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  label: string;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
}

const FileUploader = ({
  onFilesSelected,
  accept,
  multiple = false,
  label,
  selectedFiles,
  setSelectedFiles
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const files = Array.from(fileList);
      
      // Check file types
      const validFiles = files.filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ['pdf', 'doc', 'docx'].includes(ext || '');
      });
      
      if (validFiles.length !== files.length) {
        toast.error("Some files were rejected. Only PDF, DOC, and DOCX files are allowed.");
      }
      
      setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles);
      onFilesSelected(multiple ? [...selectedFiles, ...validFiles] : validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    // Check file types
    const validFiles = files.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'doc', 'docx'].includes(ext || '');
    });
    
    if (validFiles.length !== files.length) {
      toast.error("Some files were rejected. Only PDF, DOC, and DOCX files are allowed.");
    }
    
    setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles);
    onFilesSelected(multiple ? [...selectedFiles, ...validFiles] : validFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div
        className={`drop-zone ${isDragging ? 'drop-zone-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="h-10 w-10 text-primary" />
          <h3 className="text-lg font-semibold">{label}</h3>
          <p className="text-sm text-muted-foreground">
            Drag & drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: PDF, DOC, DOCX
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
          </p>
          <div className="max-h-40 overflow-y-auto border rounded-md p-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item group">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate flex-1">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
