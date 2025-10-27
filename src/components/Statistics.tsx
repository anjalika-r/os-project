import { Card } from '@/components/ui/card';
import { Clock, TrendingUp } from 'lucide-react';

interface StatisticsProps {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
}

export const Statistics = ({ avgWaitingTime, avgTurnaroundTime }: StatisticsProps) => {
  if (avgWaitingTime === 0 && avgTurnaroundTime === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 space-y-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Waiting Time</p>
            <p className="text-3xl font-bold text-primary">{avgWaitingTime.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Turnaround Time</p>
            <p className="text-3xl font-bold text-primary">{avgTurnaroundTime.toFixed(2)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
