import { Progress as PrimitiveProgress } from "@/shared/ui/primitives/progress";

type ProgressProps = {
  done: number;
  total: number;
  // Read by assistive technologies: "3 sur 7 cochés".
  label: string;
  // Shown next to the bar: "3/7".
  summary: string;
};

export const Progress = ({ done, total, label, summary }: ProgressProps) => (
  <div className="flex shrink-0 items-center gap-2">
    <PrimitiveProgress value={total === 0 ? 0 : (done / total) * 100} aria-label={label} className="w-14" />
    <span aria-hidden className="text-xs text-muted-foreground tabular-nums">
      {summary}
    </span>
  </div>
);
