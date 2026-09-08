import { ProblemNoise } from "@/components/problem/ProblemNoise";

export function Problem() {
  return (
    <section
      id="problem"
      className="relative z-20 overflow-x-hidden bg-paper text-night"
    >
      <ProblemNoise />
    </section>
  );
}
