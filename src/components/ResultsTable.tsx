import { Process } from '@/types/scheduling';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ResultsTableProps {
  processes: Process[];
  showPriority?: boolean;
}

export const ResultsTable = ({ processes, showPriority }: ResultsTableProps) => {
  if (processes.length === 0 || processes[0].completionTime === undefined) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Results Table</h3>
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Run a simulation to see the results
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Results Table</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Process ID</TableHead>
              <TableHead className="font-semibold">Arrival Time</TableHead>
              <TableHead className="font-semibold">Burst Time</TableHead>
              {showPriority && <TableHead className="font-semibold">Priority</TableHead>}
              <TableHead className="font-semibold">Completion Time</TableHead>
              <TableHead className="font-semibold">Turnaround Time</TableHead>
              <TableHead className="font-semibold">Waiting Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process, index) => (
              <TableRow key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <TableCell className="font-medium">{process.id}</TableCell>
                <TableCell>{process.arrivalTime}</TableCell>
                <TableCell>{process.burstTime}</TableCell>
                {showPriority && <TableCell>{process.priority}</TableCell>}
                <TableCell>{process.completionTime}</TableCell>
                <TableCell>{process.turnaroundTime}</TableCell>
                <TableCell>{process.waitingTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
