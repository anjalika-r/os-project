import { GanttChartItem } from '@/types/scheduling';
import { Card } from '@/components/ui/card';

interface GanttChartProps {
  ganttChart: GanttChartItem[];
  totalTime: number;
}

const processColors = [
  'bg-[hsl(var(--process-1))]',
  'bg-[hsl(var(--process-2))]',
  'bg-[hsl(var(--process-3))]',
  'bg-[hsl(var(--process-4))]',
  'bg-[hsl(var(--process-5))]',
  'bg-[hsl(var(--process-6))]',
  'bg-[hsl(var(--process-7))]',
  'bg-[hsl(var(--process-8))]',
  'bg-[hsl(var(--process-9))]',
  'bg-[hsl(var(--process-10))]',
];

const getColorForProcess = (processId: string): string => {
  const num = parseInt(processId.replace(/\D/g, ''));
  return processColors[(num - 1) % processColors.length];
};

export const GanttChart = ({ ganttChart, totalTime }: GanttChartProps) => {
  if (ganttChart.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Gantt Chart</h3>
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Run a simulation to see the Gantt chart
        </div>
      </Card>
    );
  }

  const scale = 100 / totalTime;

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Gantt Chart</h3>
      
      <div className="space-y-4">
        {/* Main Gantt Chart */}
        <div className="relative h-16 bg-secondary/30 rounded-lg overflow-hidden">
          {ganttChart.map((item, index) => (
            <div
              key={index}
              className={`absolute top-0 h-full ${getColorForProcess(item.processId)} border-r-2 border-background flex items-center justify-center text-white font-semibold transition-all duration-500 animate-scale-in hover:z-10 hover:shadow-lg`}
              style={{
                left: `${item.startTime * scale}%`,
                width: `${(item.endTime - item.startTime) * scale}%`,
                animationDelay: `${index * 50}ms`,
              }}
              title={`${item.processId}: ${item.startTime} - ${item.endTime}`}
            >
              <span className="text-sm">{item.processId}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative h-8">
          {Array.from({ length: totalTime + 1 }, (_, i) => i).map((time) => (
            <div
              key={time}
              className="absolute flex flex-col items-center"
              style={{ left: `${time * scale}%` }}
            >
              <div className="h-2 w-px bg-border"></div>
              <span className="text-xs text-muted-foreground mt-1">{time}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-2">
          {Array.from(new Set(ganttChart.map(item => item.processId))).map((processId) => (
            <div key={processId} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${getColorForProcess(processId)} rounded`}></div>
              <span className="text-sm font-medium">{processId}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
