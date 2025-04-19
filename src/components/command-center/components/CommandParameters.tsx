import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CommandParameter, YamcsParameter } from '../types';

interface CommandParametersProps {
  parameters: CommandParameter[] | YamcsParameter[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  isYamcs?: boolean;
}

export const CommandParameters: React.FC<CommandParametersProps> = ({
  parameters,
  values,
  onChange,
  isYamcs = false
}) => {
  const handleParameterChange = (name: string, value: any) => {
    onChange({ ...values, [name]: value });
  };

  const renderParameterInput = (param: CommandParameter | YamcsParameter) => {
    const value = values[param.name] ?? param.defaultValue;

    switch (param.type) {
      case 'string':
        return (
          <Input
            value={value}
            onChange={(e) => handleParameterChange(param.name, e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        );

      case 'number':
      case 'integer':
      case 'float':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleParameterChange(param.name, parseFloat(e.target.value))}
            min={param.min}
            max={param.max}
            step={'step' in param ? param.step : 1}
            className="bg-gray-800 border-gray-700 text-white"
          />
        );

      case 'boolean':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleParameterChange(param.name, checked)}
          />
        );

      case 'enum':
        if ('enumValues' in param && param.enumValues) {
          return (
            <Select
              value={value}
              onValueChange={(value) => handleParameterChange(param.name, value)}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {param.enumValues.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Command Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {parameters.map((param) => (
            <div key={param.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white">{param.name}</Label>
                {isYamcs && 'required' in param && (
                  <span className="text-xs text-gray-400">
                    {param.required ? 'Required' : 'Optional'}
                  </span>
                )}
              </div>
              {renderParameterInput(param)}
              <p className="text-sm text-gray-400">{param.description}</p>
              {isYamcs && 'units' in param && param.units && (
                <span className="text-xs text-gray-500">Units: {param.units}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 