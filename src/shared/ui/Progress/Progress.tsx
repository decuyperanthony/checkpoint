type ProgressProps = {
  // Read by assistive technologies: "3 stations parcourues sur 7, ligne Courses".
  label: string;
  // Shown beside the line's name: "3/7". The travelled track already draws the rest.
  summary: string;
};

// How far a line has travelled, as a count.
export const Progress = ({ label, summary }: ProgressProps) => (
  <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
    <span aria-hidden>{summary}</span>
    <span className="sr-only">{label}</span>
  </span>
);
