import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { CommandTemplate } from '../types';
import { Plus, Trash2, Save } from 'lucide-react';

interface CommandTemplatesProps {
  templates: CommandTemplate[];
  onSaveTemplate: (name: string, description: string) => void;
  onDeleteTemplate: (templateId: string) => void;
  onSelectTemplate: (template: CommandTemplate) => void;
}

export const CommandTemplates: React.FC<CommandTemplatesProps> = ({
  templates,
  onSaveTemplate,
  onDeleteTemplate,
  onSelectTemplate
}) => {
  const [newTemplateName, setNewTemplateName] = React.useState('');
  const [newTemplateDescription, setNewTemplateDescription] = React.useState('');
  const [showNewTemplateForm, setShowNewTemplateForm] = React.useState(false);

  const handleSaveTemplate = () => {
    if (newTemplateName.trim() && newTemplateDescription.trim()) {
      onSaveTemplate(newTemplateName.trim(), newTemplateDescription.trim());
      setNewTemplateName('');
      setNewTemplateDescription('');
      setShowNewTemplateForm(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Command Templates</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          onClick={() => setShowNewTemplateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </CardHeader>
      <CardContent>
        {showNewTemplateForm && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-white font-medium mb-2">Create New Template</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Template Name</label>
                <Input
                  value={newTemplateName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTemplateName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <Input
                  value={newTemplateDescription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTemplateDescription(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                  placeholder="Enter template description"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                onClick={handleSaveTemplate}
                disabled={!newTemplateName.trim() || !newTemplateDescription.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{template.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use Template
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => onDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div>Namespace: {template.namespace}</div>
                  <div>Version: {template.version}</div>
                  <div>Created: {new Date(template.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No templates available
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}; 