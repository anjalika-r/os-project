import { useState } from 'react';
import { AlgorithmType, Process, SchedulingResult } from '@/types/scheduling';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';
import { ProcessInputForm } from '@/components/ProcessInputForm';
import { GanttChart } from '@/components/GanttChart';
import { ResultsTable } from '@/components/ResultsTable';
import { Statistics } from '@/components/Statistics';
import { Cpu } from 'lucide-react';
import {
  fcfs,
  sjf,
  srtf,
  roundRobin,
  priorityNonPreemptive,
  priorityPreemptive,
} from '@/utils/schedulingAlgorithms';

const Index = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('FCFS');
  const [result, setResult] = useState<SchedulingResult>({
    processes: [],
    ganttChart: [],
    avgWaitingTime: 0,
    avgTurnaroundTime: 0,
    totalTime: 0,
  });

  const handleSimulate = (processes: Process[], timeQuantum?: number) => {
    let simulationResult: SchedulingResult;

    switch (selectedAlgorithm) {
      case 'FCFS':
        simulationResult = fcfs(processes);
        break;
      case 'SJF':
        simulationResult = sjf(processes);
        break;
      case 'SRTF':
        simulationResult = srtf(processes);
        break;
      case 'RR':
        simulationResult = roundRobin(processes, timeQuantum || 2);
        break;
      case 'Priority-NonPreemptive':
        simulationResult = priorityNonPreemptive(processes);
        break;
      case 'Priority-Preemptive':
        simulationResult = priorityPreemptive(processes);
        break;
      default:
        simulationResult = fcfs(processes);
    }

    setResult(simulationResult);
  };

  const getAlgorithmDescription = () => {
    const descriptions: Record<AlgorithmType, string> = {
      'FCFS': 'First Come First Serve - Processes are executed in the order they arrive',
      'SJF': 'Shortest Job First - Selects the process with smallest burst time',
      'SRTF': 'Shortest Remaining Time First - Preemptive version of SJF',
      'RR': 'Round Robin - Each process gets a fixed time quantum in circular order',
      'Priority-NonPreemptive': 'Priority Scheduling - Lower priority number executes first (non-preemptive)',
      'Priority-Preemptive': 'Priority Scheduling - Lower priority number executes first (preemptive)',
    };
    return descriptions[selectedAlgorithm];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CPU Scheduling Visualizer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive visualization tool for understanding CPU scheduling algorithms in Operating Systems
          </p>
        </div>

        {/* Algorithm Selector */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <AlgorithmSelector selected={selectedAlgorithm} onSelect={setSelectedAlgorithm} />
          <p className="text-sm text-muted-foreground text-center">
            {getAlgorithmDescription()}
          </p>
        </div>

        {/* Input Form */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <ProcessInputForm
            onSimulate={handleSimulate}
            algorithmType={selectedAlgorithm}
          />
        </div>

        {/* Results Section */}
        {result.processes.length > 0 && (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Statistics
                avgWaitingTime={result.avgWaitingTime}
                avgTurnaroundTime={result.avgTurnaroundTime}
              />
            </div>

            {/* Gantt Chart */}
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <GanttChart ganttChart={result.ganttChart} totalTime={result.totalTime} />
            </div>

            {/* Results Table */}
            <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <ResultsTable
                processes={result.processes}
                showPriority={selectedAlgorithm.includes('Priority')}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <p>Educational tool for visualizing CPU scheduling algorithms • Built with React & TypeScript</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
