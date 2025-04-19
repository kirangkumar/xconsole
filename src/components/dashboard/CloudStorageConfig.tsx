import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Cloud, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface CloudStorageConfig {
  provider: string;
  accessKey: string;
  secretKey: string;
  region: string;
  bucket: string;
  endpoint?: string;
}

interface CloudStorageConfigProps {
  onSave: (config: CloudStorageConfig) => void;
}

const CloudStorageConfig: React.FC<CloudStorageConfigProps> = ({ onSave }) => {
  const [config, setConfig] = useState<CloudStorageConfig>({
    provider: "",
    accessKey: "",
    secretKey: "",
    region: "",
    bucket: "",
    endpoint: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic validation
    if (!config.provider || !config.accessKey || !config.secretKey || !config.region || !config.bucket) {
      setError("Please fill in all required fields");
      return;
    }

    // Save configuration
    onSave(config);
    setSuccess(true);
  };

  const handleChange = (field: keyof CloudStorageConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Cloud className="mr-2 h-5 w-5 text-blue-400" />
          Cloud Storage Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-white">Cloud Provider</Label>
            <Select
              value={config.provider}
              onValueChange={(value) => handleChange("provider", value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="aws">Amazon S3</SelectItem>
                <SelectItem value="gcp">Google Cloud Storage</SelectItem>
                <SelectItem value="azure">Azure Blob Storage</SelectItem>
                <SelectItem value="minio">MinIO</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessKey" className="text-white">Access Key</Label>
            <Input
              id="accessKey"
              type="text"
              value={config.accessKey}
              onChange={(e) => handleChange("accessKey", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter access key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secretKey" className="text-white">Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              value={config.secretKey}
              onChange={(e) => handleChange("secretKey", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter secret key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="text-white">Region</Label>
            <Input
              id="region"
              type="text"
              value={config.region}
              onChange={(e) => handleChange("region", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter region (e.g., us-east-1)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bucket" className="text-white">Bucket Name</Label>
            <Input
              id="bucket"
              type="text"
              value={config.bucket}
              onChange={(e) => handleChange("bucket", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter bucket name"
            />
          </div>

          {config.provider === "minio" && (
            <div className="space-y-2">
              <Label htmlFor="endpoint" className="text-white">Endpoint URL</Label>
              <Input
                id="endpoint"
                type="text"
                value={config.endpoint}
                onChange={(e) => handleChange("endpoint", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter endpoint URL"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-500/10 border-green-500/30">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Cloud storage configuration saved successfully!</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CloudStorageConfig; 