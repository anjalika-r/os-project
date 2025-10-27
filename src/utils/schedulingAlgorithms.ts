import { Process, GanttChartItem, SchedulingResult } from '@/types/scheduling';

// Helper function to calculate metrics
const calculateMetrics = (processes: Process[]): { avgWaitingTime: number; avgTurnaroundTime: number } => {
  const n = processes.length;
  const totalWaitingTime = processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTurnaroundTime = processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
  
  return {
    avgWaitingTime: totalWaitingTime / n,
    avgTurnaroundTime: totalTurnaroundTime / n,
  };
};

// First Come First Serve (FCFS)
export const fcfs = (inputProcesses: Process[]): SchedulingResult => {
  const processes = JSON.parse(JSON.stringify(inputProcesses)) as Process[];
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;
  
  processes.forEach(process => {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }
    
    process.startTime = currentTime;
    ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
    });
    
    currentTime += process.burstTime;
    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
  });
  
  const metrics = calculateMetrics(processes);
  
  return {
    processes,
    ganttChart,
    ...metrics,
    totalTime: currentTime,
  };
};

// Shortest Job First (SJF) - Non-Preemptive
export const sjf = (inputProcesses: Process[]): SchedulingResult => {
  const processes = JSON.parse(JSON.stringify(inputProcesses)) as Process[];
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  const remaining = [...processes];
  let currentTime = 0;
  
  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }
    
    available.sort((a, b) => a.burstTime - b.burstTime);
    const process = available[0];
    const index = remaining.indexOf(process);
    remaining.splice(index, 1);
    
    process.startTime = currentTime;
    ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
    });
    
    currentTime += process.burstTime;
    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
    
    completed.push(process);
  }
  
  const metrics = calculateMetrics(completed);
  
  return {
    processes: completed,
    ganttChart,
    ...metrics,
    totalTime: currentTime,
  };
};

// Shortest Remaining Time First (SRTF) - Preemptive SJF
export const srtf = (inputProcesses: Process[]): SchedulingResult => {
  const processes = JSON.parse(JSON.stringify(inputProcesses)) as Process[];
  processes.forEach(p => p.remainingTime = p.burstTime);
  
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  let currentTime = 0;
  let lastProcessId = '';
  
  while (completed.length < processes.length) {
    const available = processes.filter(
      p => p.arrivalTime <= currentTime && p.remainingTime! > 0
    );
    
    if (available.length === 0) {
      currentTime++;
      continue;
    }
    
    available.sort((a, b) => a.remainingTime! - b.remainingTime!);
    const process = available[0];
    
    if (process.startTime === undefined) {
      process.startTime = currentTime;
    }
    
    if (lastProcessId !== process.id) {
      ganttChart.push({
        processId: process.id,
        startTime: currentTime,
        endTime: currentTime + 1,
      });
      lastProcessId = process.id;
    } else {
      ganttChart[ganttChart.length - 1].endTime++;
    }
    
    process.remainingTime!--;
    currentTime++;
    
    if (process.remainingTime === 0) {
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      completed.push(process);
    }
  }
  
  const metrics = calculateMetrics(processes);
  
  return {
    processes,
    ganttChart,
    ...metrics,
    totalTime: currentTime,
  };
};

// Round Robin (RR)
export const roundRobin = (inputProcesses: Process[], timeQuantum: number): SchedulingResult => {
  const processes = JSON.parse(JSON.stringify(inputProcesses)) as Process[];
  processes.forEach(p => p.remainingTime = p.burstTime);
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const ganttChart: GanttChartItem[] = [];
  const queue: Process[] = [];
  const completed: Process[] = [];
  let currentTime = 0;
  let index = 0;
  
  while (completed.length < processes.length) {
    // Add newly arrived processes to queue
    while (index < processes.length && processes[index].arrivalTime <= currentTime) {
      queue.push(processes[index]);
      index++;
    }
    
    if (queue.length === 0) {
      currentTime = processes[index].arrivalTime;
      continue;
    }
    
    const process = queue.shift()!;
    
    if (process.startTime === undefined) {
      process.startTime = currentTime;
    }
    
    const executionTime = Math.min(timeQuantum, process.remainingTime!);
    
    ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + executionTime,
    });
    
    currentTime += executionTime;
    process.remainingTime! -= executionTime;
    
    // Add newly arrived processes
    while (index < processes.length && processes[index].arrivalTime <= currentTime) {
      queue.push(processes[index]);
      index++;
    }
    
    if (process.remainingTime === 0) {
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      completed.push(process);
    } else {
      queue.push(process);
    }
  }
  
  const metrics = calculateMetrics(processes);
  
  return {
    processes,
    ganttChart,
    ...metrics,
    totalTime: currentTime,
  };
};

// Priority Scheduling - Non-Preemptive
export const priorityNonPreemptive = (inputProcesses: Process[]): SchedulingResult => {
  const processes = JSON.parse(JSON.stringify(inputProcesses)) as Process[];
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  const remaining = [...processes];
  let currentTime = 0;
  
  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }
    
    // Lower priority number = higher priority
    available.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    const process = available[0];
    const index = remaining.indexOf(process);
    remaining.splice(index, 1);
    
    process.startTime = currentTime;
    ganttChart.push({
      processId: process.id,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
    });
    
    currentTime += process.burstTime;
    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
    
    completed.push(process);
  }
  
  const metrics = calculateMetrics(completed);
  
  return {
    processes: completed,
    ganttChart,
    ...metrics,
    totalTime: currentTime,
  };
};

// Priority Scheduling - Preemptive
export const priorityPreemptive = (inputProcesses: Process[]): SchedulingResult => {
  const processes = JSON.parse(JSON.stringify(inputProcesses)) as Process[];
  processes.forEach(p => p.remainingTime = p.burstTime);
  
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  let currentTime = 0;
  let lastProcessId = '';
  
  while (completed.length < processes.length) {
    const available = processes.filter(
      p => p.arrivalTime <= currentTime && p.remainingTime! > 0
    );
    
    if (available.length === 0) {
      currentTime++;
      continue;
    }
    
    // Lower priority number = higher priority
    available.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    const process = available[0];
    
    if (process.startTime === undefined) {
      process.startTime = currentTime;
    }
    
    if (lastProcessId !== process.id) {
      ganttChart.push({
        processId: process.id,
        startTime: currentTime,
        endTime: currentTime + 1,
      });
      lastProcessId = process.id;
    } else {
      ganttChart[ganttChart.length - 1].endTime++;
    }
    
    process.remainingTime!--;
    currentTime++;
    
    if (process.remainingTime === 0) {
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      completed.push(process);
    }
  }
  
  const metrics = calculateMetrics(processes);
  
  return {
    processes,
    ganttChart,
    ...metrics,
    totalTime: currentTime,
  };
};
