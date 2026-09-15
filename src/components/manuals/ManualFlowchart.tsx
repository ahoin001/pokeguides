"use client";

import { DecisionTree } from "@/components/learn/DecisionTree";
import type { ManualFlow } from "@/content/manuals";

export function ManualFlowchart({ flow }: { flow: ManualFlow }) {
  return <DecisionTree flow={flow} />;
}
