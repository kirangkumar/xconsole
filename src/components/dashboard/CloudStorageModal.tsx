import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CloudStorageConfig from "./CloudStorageConfig";

interface CloudStorageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: any) => void;
}

const CloudStorageModal: React.FC<CloudStorageModalProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Configure Cloud Storage</DialogTitle>
        </DialogHeader>
        <CloudStorageConfig onSave={onSave} />
      </DialogContent>
    </Dialog>
  );
};

export default CloudStorageModal; 