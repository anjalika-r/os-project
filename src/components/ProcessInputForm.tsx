import { useState } from 'react';
import { Process } from '@/types/scheduling';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Play, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface ProcessInputFormProps {
  onSimulate: (processes: Process[], timeQuantum?: number) => void;
  algorithmType: string;
}

export const ProcessInputForm = ({ onSimulate, algorithmType }: ProcessInputFormProps) => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
  ]);
  const [timeQuantum, setTimeQuantum] = useState(2);

  const needsPriority = algorithmType.includes('Priority');
  const needsTimeQuantum = algorithmType === 'RR';

  const addProcess = () => {
    const newId = `P${processes.length + 1}`;
    setProcesses([...processes, { id: newId, arrivalTime: 0, burstTime: 1, priority: 1 }]);
  };

  const removeProcess = (index: number) => {
    if (processes.length <= 1) {
      toast.error('At least one process is required');
      return;
    }
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const updateProcess = (index: number, field: keyof Process, value: number) => {
    const updated = [...processes];
    updated[index] = { ...updated[index], [field]: value };
    setProcesses(updated);
  };

  const handleSimulate = () => {
    // Validation
    for (const p of processes) {
      if (p.burstTime <= 0) {
        toast.error(`${p.id}: Burst Time must be greater than 0`);
        return;
      }
      if (p.arrivalTime < 0) {
        toast.error(`${p.id}: Arrival Time cannot be negative`);
        return;
      }
      if (needsPriority && (p.priority === undefined || p.priority < 1)) {
        toast.error(`${p.id}: Priority must be at least 1`);
        return;
      }
    }

    if (needsTimeQuantum && timeQuantum <= 0) {
      toast.error('Time Quantum must be greater than 0');
      return;
    }

    toast.success('Simulation started!');
    onSimulate(processes, needsTimeQuantum ? timeQuantum : undefined);
  };

  const handleReset = () => {
    setProcesses([
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
      { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
    ]);
    setTimeQuantum(2);
    toast.info('Form reset to defaults');
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Process Configuration</h3>
        <div className="flex gap-2">
          <Button onClick={addProcess} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Process
          </Button>
          <Button onClick={handleReset} size="sm" variant="outline">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
          <div className="col-span-2">ID</div>
          <div className="col-span-3">Arrival Time</div>
          <div className="col-span-3">Burst Time</div>
          {needsPriority && <div className="col-span-3">Priority</div>}
          <div className="col-span-1"></div>
        </div>

        {processes.map((process, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-2">
              <Input
                value={process.id}
                onChange={(e) => updateProcess(index, 'id', e.target.value as any)}
                className="font-medium"
              />
            </div>
            <div className="col-span-3">
              <Input
                type="number"
                min="0"
                value={process.arrivalTime}
                onChange={(e) => updateProcess(index, 'arrivalTime', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="col-span-3">
              <Input
                type="number"
                min="1"
                value={process.burstTime}
                onChange={(e) => updateProcess(index, 'burstTime', parseInt(e.target.value) || 1)}
              />
            </div>
            {needsPriority && (
              <div className="col-span-3">
                <Input
                  type="number"
                  min="1"
                  value={process.priority || 1}
                  onChange={(e) => updateProcess(index, 'priority', parseInt(e.target.value) || 1)}
                />
              </div>
            )}
            <div className={needsPriority ? "col-span-1" : "col-span-4 flex justify-end"}>
              <Button
                onClick={() => removeProcess(index)}
                size="icon"
                variant="ghost"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {needsTimeQuantum && (
        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
          <label className="font-medium">Time Quantum:</label>
          <Input
            type="number"
            min="1"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
            className="w-24"
          />
        </div>
      )}

      <Button onClick={handleSimulate} className="w-full bg-gradient-primary" size="lg">
        <Play className="w-4 h-4 mr-2" />
        Run Simulation
      </Button>
    </Card>
  );
};
