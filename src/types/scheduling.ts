export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  remainingTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  startTime?: number;
}

export interface GanttChartItem {
  processId: string;
  startTime: number;
  endTime: number;
}

export interface SchedulingResult {
  processes: Process[];
  ganttChart: GanttChartItem[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  totalTime: number;
}

export type AlgorithmType = 
  | 'FCFS' 
  | 'SJF' 
  | 'SRTF' 
  | 'RR' 
  | 'Priority-Preemptive' 
  | 'Priority-NonPreemptive';
