import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2, Clock, Download, Filter, Search, RefreshCw, ChevronDown, ChevronUp, FileText, Table, List, Bell, Settings, BarChart2, PieChart, AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for telemetry
const generateMockTelemetryData = () => {
  return Array(24).fill(0).map((_, i) => ({
    time: `${i}:00`,
    temperature: 65 + Math.sin(i / 3) * 15 + Math.random() * 5,
    power: 50 + Math.cos(i / 2) * 10 + Math.random() * 5,
    signalStrength: 75 + Math.sin(i / 4) * 20 + Math.random() * 5,
    altitude: 500 + Math.sin(i / 6) * 50 + Math.random() * 10,
    batteryLevel: 80 + Math.sin(i / 5) * 15 + Math.random() * 5,
    dataRate: 100 + Math.sin(i / 3) * 30 + Math.random() * 10,
    solarPanelEfficiency: 85 + Math.sin(i / 4) * 10 + Math.random() * 3,
    attitudeControl: 90 + Math.sin(i / 5) * 5 + Math.random() * 2,
  }));
};

// Mock data for logs
const generateMockLogs = (count = 50) => {
  const satellites = ['SAT-1', 'SAT-2', 'SAT-3', 'SAT-4', 'SAT-5'];
  const levels = ['info', 'warning', 'error', 'critical'];
  const components = ['Power System', 'Communication', 'Navigation', 'Payload', 'Thermal Control', 'Attitude Control'];
  
  return Array(count).fill(0).map((_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const satellite = satellites[Math.floor(Math.random() * satellites.length)];
    const component = components[Math.floor(Math.random() * components.length)];
    
    let message = '';
    switch(level) {
      case 'info':
        message = `${component} operating within normal parameters`;
        break;
      case 'warning':
        message = `${component} showing elevated ${Math.random() > 0.5 ? 'temperature' : 'power consumption'}`;
        break;
      case 'error':
        message = `${component} reported ${Math.random() > 0.5 ? 'communication failure' : 'calibration error'}`;
        break;
      case 'critical':
        message = `${component} critical failure detected`;
        break;
    }
    
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    const timestamp = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return {
      id: i + 1,
      timestamp,
      level,
      message,
      satellite,
      component,
      raw: `[${timestamp}] [${level.toUpperCase()}] [${satellite}] [${component}] ${message}`,
    };
  });
};

// Alert configuration
interface AlertConfig {
  id: string;
  name: string;
  parameter: string;
  condition: 'above' | 'below' | 'equals';
  value: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  enabled: boolean;
  satellites: string[];
}

const defaultAlertConfigs: AlertConfig[] = [
  {
    id: '1',
    name: 'High Temperature Alert',
    parameter: 'temperature',
    condition: 'above',
    value: 75,
    severity: 'warning',
    enabled: true,
    satellites: ['SAT-1', 'SAT-2', 'SAT-3', 'SAT-4', 'SAT-5'],
  },
  {
    id: '2',
    name: 'Low Signal Strength Alert',
    parameter: 'signalStrength',
    condition: 'below',
    value: 60,
    severity: 'error',
    enabled: true,
    satellites: ['SAT-1', 'SAT-2', 'SAT-3', 'SAT-4', 'SAT-5'],
  },
  {
    id: '3',
    name: 'Critical Battery Alert',
    parameter: 'batteryLevel',
    condition: 'below',
    value: 20,
    severity: 'critical',
    enabled: true,
    satellites: ['SAT-1', 'SAT-2', 'SAT-3', 'SAT-4', 'SAT-5'],
  },
];

const TelemetryDashboard = () => {
  const [telemetryData, setTelemetryData] = useState(generateMockTelemetryData());
  const [logs, setLogs] = useState(generateMockLogs());
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSatellite, setSelectedSatellite] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState('all');
  const [logViewMode, setLogViewMode] = useState('table'); // 'table' or 'raw'
  const [isAutoScroll, setIsAutoScroll] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [chartType, setChartType] = useState('line'); // 'line' or 'area'
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>(defaultAlertConfigs);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState<AlertConfig>({
    id: Date.now().toString(),
    name: '',
    parameter: 'temperature',
    condition: 'above',
    value: 0,
    severity: 'warning',
    enabled: true,
    satellites: ['SAT-1'],
  });
  const logsEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get unique satellites, components and levels for filters
  const satellites = ['all', ...new Set(logs.map(log => log.satellite))];
  const components = ['all', ...new Set(logs.map(log => log.component))];
  const levels = ['all', 'info', 'warning', 'error', 'critical'];
  const parameters = ['temperature', 'power', 'signalStrength', 'altitude', 'batteryLevel', 'dataRate', 'solarPanelEfficiency', 'attitudeControl'];

  useEffect(() => {
    // Simulate real-time updates for telemetry
    const telemetryInterval = setInterval(() => {
      if (isStreaming) {
        setTelemetryData(generateMockTelemetryData());
      }
    }, 5000);

    // Simulate real-time log updates
    const logInterval = setInterval(() => {
      if (isStreaming) {
        const newLogs = [...logs, ...generateMockLogs(2)].slice(-100); // Keep only last 100 logs
        setLogs(newLogs);
        applyFilters(newLogs, searchTerm, selectedSatellite, selectedLevel, selectedComponent);
      }
    }, 3000);

    return () => {
      clearInterval(telemetryInterval);
      clearInterval(logInterval);
    };
  }, [isStreaming, logs, searchTerm, selectedSatellite, selectedLevel, selectedComponent]);

  // Auto-scroll to bottom when new logs arrive and auto-scroll is enabled
  useEffect(() => {
    if (isAutoScroll && logsEndRef.current && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTo({
          top: scrollArea.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [filteredLogs, isAutoScroll]);

  const applyFilters = (logsToFilter = logs, search = searchTerm, satellite = selectedSatellite, level = selectedLevel, component = selectedComponent) => {
    let filtered = logsToFilter;
    
    if (search) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(search.toLowerCase()) || 
        log.satellite.toLowerCase().includes(search.toLowerCase()) ||
        log.component.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (satellite !== 'all') {
      filtered = filtered.filter(log => log.satellite === satellite);
    }
    
    if (level !== 'all') {
      filtered = filtered.filter(log => log.level === level);
    }
    
    if (component !== 'all') {
      filtered = filtered.filter(log => log.component === component);
    }
    
    setFilteredLogs(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(logs, value, selectedSatellite, selectedLevel, selectedComponent);
  };

  const handleSatelliteChange = (value: string) => {
    setSelectedSatellite(value);
    applyFilters(logs, searchTerm, value, selectedLevel, selectedComponent);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    applyFilters(logs, searchTerm, selectedSatellite, value, selectedComponent);
  };

  const handleComponentChange = (value: string) => {
    setSelectedComponent(value);
    applyFilters(logs, searchTerm, selectedSatellite, selectedLevel, value);
  };

  const handleRefresh = () => {
    setLogs(generateMockLogs());
    setTelemetryData(generateMockTelemetryData());
  };

  const handleDownloadLogs = () => {
    const logText = filteredLogs.map(log => log.raw).join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satellite-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddAlert = () => {
    setAlertConfigs([...alertConfigs, newAlert]);
    setIsAlertDialogOpen(false);
    setNewAlert({
      id: Date.now().toString(),
      name: '',
      parameter: 'temperature',
      condition: 'above',
      value: 0,
      severity: 'warning',
      enabled: true,
      satellites: ['SAT-1'],
    });
  };

  const handleToggleAlert = (id: string) => {
    setAlertConfigs(alertConfigs.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const handleDeleteAlert = (id: string) => {
    setAlertConfigs(alertConfigs.filter(alert => alert.id !== id));
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <Clock className="h-4 w-4" />;
      case 'info':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'error':
        return <Badge variant="outline" className="text-red-500">Error</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-yellow-500">Warning</Badge>;
      case 'info':
        return <Badge variant="outline" className="text-blue-500">Info</Badge>;
      default:
        return null;
    }
  };

  const getParameterUnit = (parameter: string) => {
    switch (parameter) {
      case 'temperature':
        return '°C';
      case 'power':
        return 'W';
      case 'signalStrength':
        return '%';
      case 'altitude':
        return 'km';
      case 'batteryLevel':
        return '%';
      case 'dataRate':
        return 'Mbps';
      case 'solarPanelEfficiency':
        return '%';
      case 'attitudeControl':
        return '%';
      default:
        return '';
    }
  };

  const getParameterColor = (parameter: string) => {
    switch (parameter) {
      case 'temperature':
        return '#EF4444';
      case 'power':
        return '#10B981';
      case 'signalStrength':
        return '#3B82F6';
      case 'altitude':
        return '#8B5CF6';
      case 'batteryLevel':
        return '#F59E0B';
      case 'dataRate':
        return '#EC4899';
      case 'solarPanelEfficiency':
        return '#06B6D4';
      case 'attitudeControl':
        return '#84CC16';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className="p-6 space-y-6 pt-16 overflow-y-auto h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Satellite Telemetry & Logs</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsStreaming(!isStreaming)}
            className={"bg-gray-800 border-gray-700 text-white "+isStreaming ? "text-green-500" : "text-gray-400"}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isStreaming ? "animate-spin" : ""}`} />
            {isStreaming ? "Live" : "Paused"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className='bg-gray-800 border-gray-700 text-white'>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadLogs} className='bg-gray-800 border-gray-700 text-white'>
            <Download className="h-4 w-4 mr-2" />
            Download Logs
          </Button>
          <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className='bg-gray-800 border-gray-700 text-white'>
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">Alert Configuration</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Configure alerts for satellite telemetry parameters
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-name">Alert Name</Label>
                  <Input 
                    id="alert-name" 
                    value={newAlert.name} 
                    onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
                    placeholder="High Temperature Alert"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-parameter">Parameter</Label>
                    <Select 
                      value={newAlert.parameter} 
                      onValueChange={(value) => setNewAlert({...newAlert, parameter: value})}
                    >
                      <SelectTrigger id="alert-parameter">
                        <SelectValue placeholder="Select parameter" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameters.map(param => (
                          <SelectItem key={param} value={param}>
                            {param.charAt(0).toUpperCase() + param.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-condition">Condition</Label>
                    <Select 
                      value={newAlert.condition} 
                      onValueChange={(value: 'above' | 'below' | 'equals') => setNewAlert({...newAlert, condition: value})}
                    >
                      <SelectTrigger id="alert-condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Above</SelectItem>
                        <SelectItem value="below">Below</SelectItem>
                        <SelectItem value="equals">Equals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-value">Threshold Value ({getParameterUnit(newAlert.parameter)})</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      id="alert-value"
                      min={0} 
                      max={100} 
                      step={1} 
                      value={[newAlert.value]} 
                      onValueChange={(value) => setNewAlert({...newAlert, value: value[0]})}
                      className="flex-1 [&_.relative]:bg-white [&>span]:bg-white [&>span>span]:bg-blue-500 [&>span:last-child]:bg-white [&>span:last-child]:border-0 [&>span:last-child]:shadow-none [&>span:last-child]:rounded-full"
                    />
                    <span className="text-sm text-gray-400 w-12">{newAlert.value}{getParameterUnit(newAlert.parameter)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-severity">Severity</Label>
                    <Select 
                      value={newAlert.severity} 
                      onValueChange={(value: 'info' | 'warning' | 'error' | 'critical') => setNewAlert({...newAlert, severity: value})}
                    >
                      <SelectTrigger id="alert-severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-enabled">Status</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch 
                        id="alert-enabled" 
                        checked={newAlert.enabled} 
                        onCheckedChange={(checked) => setNewAlert({...newAlert, enabled: checked})}
                      />
                      <Label htmlFor="alert-enabled" className="text-sm">
                        {newAlert.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Satellites</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {satellites.filter(s => s !== 'all').map(satellite => (
                      <div key={satellite} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`satellite-${satellite}`} 
                          checked={newAlert.satellites.includes(satellite)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewAlert({
                                ...newAlert, 
                                satellites: [...newAlert.satellites, satellite]
                              });
                            } else {
                              setNewAlert({
                                ...newAlert, 
                                satellites: newAlert.satellites.filter(s => s !== satellite)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`satellite-${satellite}`} className="text-sm">
                          {satellite}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAlertDialogOpen(false)} className='bg-gray-800 border-gray-700 text-white'>Cancel</Button>
                <Button onClick={handleAddAlert} className='bg-gray-800 border-gray-700 text-white'>Add Alert</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Temperature</CardTitle>
            <Badge variant="outline" className="text-green-500">Normal</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{telemetryData[telemetryData.length - 1].temperature.toFixed(1)}°C</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Power</CardTitle>
            <Badge variant="outline" className="text-yellow-500">Warning</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{telemetryData[telemetryData.length - 1].power.toFixed(1)}W</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Signal Strength</CardTitle>
            <Badge variant="outline" className="text-red-500">Critical</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{telemetryData[telemetryData.length - 1].signalStrength.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Altitude</CardTitle>
            <Badge variant="outline" className="text-green-500">Normal</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{telemetryData[telemetryData.length - 1].altitude.toFixed(1)}km</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <Select value={selectedSatellite} onValueChange={handleSatelliteChange}>
                  <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Satellite" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {satellites.map(satellite => (
                      <SelectItem key={satellite} value={satellite} className="text-white">
                        {satellite === 'all' ? 'All Satellites' : satellite}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={handleLevelChange}>
                  <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {levels.map(level => (
                      <SelectItem key={level} value={level} className="text-white">
                        {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedComponent} onValueChange={handleComponentChange}>
                  <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Component" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {components.map(component => (
                      <SelectItem key={component} value={component} className="text-white">
                        {component === 'all' ? 'All Components' : component}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsAutoScroll(!isAutoScroll)}
                    className={isAutoScroll ? "text-blue-500" : "text-gray-400"}
                  >
                    {isAutoScroll ? "Auto-scroll On" : "Auto-scroll Off"}
                  </Button>
                  <Tabs value={logViewMode} onValueChange={setLogViewMode} className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                      <TabsTrigger value="table" className="data-[state=active]:bg-gray-700">
                        <Table className="h-4 w-4 mr-1" />
                        Table
                      </TabsTrigger>
                      <TabsTrigger value="raw" className="data-[state=active]:bg-gray-700">
                        <FileText className="h-4 w-4 mr-1" />
                        Raw
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="text-sm text-gray-400">
                  {filteredLogs.length} logs found
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-[300px]" ref={scrollAreaRef}>
              <div className="space-y-1">
                {logViewMode === 'table' ? (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 p-2 rounded-lg bg-gray-800/50">
                      <div className={`${getLogLevelColor(log.level)} mt-1`}>
                        {getLogLevelIcon(log.level)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-white">{log.satellite}</p>
                            <span className="text-xs text-gray-300">{log.component}</span>
                            {getLogLevelBadge(log.level)}
                          </div>
                          <p className="text-xs text-gray-300">{log.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-200">{log.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="font-mono text-sm text-white">
                    {filteredLogs.map((log) => (
                      <div key={log.id} className="py-1">
                        <span className="text-gray-300">{log.timestamp}</span>{' '}
                        <span className={getLogLevelColor(log.level)}>[{log.level.toUpperCase()}]</span>{' '}
                        <span className="text-blue-400">[{log.satellite}]</span>{' '}
                        <span className="text-purple-400">[{log.component}]</span>{' '}
                        <span className="text-gray-200">{log.message}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Alert Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertConfigs.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${alert.enabled ? 'bg-blue-500/20' : 'bg-gray-700/50'}`}>
                      <AlertTriangle className={`h-5 w-5 ${alert.enabled ? 'text-blue-500' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">{alert.name}</h3>
                        {getLogLevelBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-gray-300">
                        {alert.parameter.charAt(0).toUpperCase() + alert.parameter.slice(1)} {alert.condition} {alert.value}{getParameterUnit(alert.parameter)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={alert.enabled} 
                      onCheckedChange={() => handleToggleAlert(alert.id)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Telemetry Data</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setChartType('line')}
                className={chartType === 'line' ? 'text-blue-500' : 'text-gray-400'}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setChartType('area')}
                className={chartType === 'area' ? 'text-blue-500' : 'text-gray-400'}
              >
                <PieChart className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={telemetryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="time" stroke="#6B7280" tick={{ fill: "#E5E7EB" }} />
                    <YAxis stroke="#6B7280" tick={{ fill: "#E5E7EB" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#F9FAFB",
                      }}
                    />
                    <Line type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#EF4444" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="power" name="Power (W)" stroke="#10B981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="signalStrength" name="Signal Strength (%)" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="altitude" name="Altitude (km)" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="batteryLevel" name="Battery (%)" stroke="#F59E0B" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="dataRate" name="Data Rate (Mbps)" stroke="#EC4899" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="solarPanelEfficiency" name="Solar Panel (%)" stroke="#06B6D4" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="attitudeControl" name="Attitude (%)" stroke="#84CC16" strokeWidth={2} dot={false} />
                  </LineChart>
                ) : (
                  <AreaChart data={telemetryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="time" stroke="#6B7280" tick={{ fill: "#E5E7EB" }} />
                    <YAxis stroke="#6B7280" tick={{ fill: "#E5E7EB" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#F9FAFB",
                      }}
                    />
                    <Area type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="power" name="Power (W)" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="signalStrength" name="Signal Strength (%)" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="altitude" name="Altitude (km)" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="batteryLevel" name="Battery (%)" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="dataRate" name="Data Rate (Mbps)" stroke="#EC4899" fill="#EC4899" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="solarPanelEfficiency" name="Solar Panel (%)" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="attitudeControl" name="Attitude (%)" stroke="#84CC16" fill="#84CC16" fillOpacity={0.2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelemetryDashboard; 