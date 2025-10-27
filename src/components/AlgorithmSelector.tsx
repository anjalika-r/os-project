import { AlgorithmType } from '@/types/scheduling';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AlgorithmSelectorProps {
  selected: AlgorithmType;
  onSelect: (algorithm: AlgorithmType) => void;
}

const algorithms: { value: AlgorithmType; label: string }[] = [
  { value: 'FCFS', label: 'FCFS' },
  { value: 'SJF', label: 'SJF' },
  { value: 'SRTF', label: 'SRTF' },
  { value: 'RR', label: 'Round Robin' },
  { value: 'Priority-NonPreemptive', label: 'Priority (NP)' },
  { value: 'Priority-Preemptive', label: 'Priority (P)' },
];

export const AlgorithmSelector = ({ selected, onSelect }: AlgorithmSelectorProps) => {
  return (
    <Tabs value={selected} onValueChange={(value) => onSelect(value as AlgorithmType)}>
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 bg-secondary/50 p-1">
        {algorithms.map((algo) => (
          <TabsTrigger
            key={algo.value}
            value={algo.value}
            className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white font-medium transition-all"
          >
            {algo.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
