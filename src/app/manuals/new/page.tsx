"use client";

import { emptyManual } from "@/content/manuals";
import { ManualForm } from "@/components/manuals/ManualForm";
import { newLocalId } from "@/stores/manuals";
import { useMemo } from "react";

export default function NewManualPage() {
  const initial = useMemo(() => emptyManual(newLocalId()), []);
  return <ManualForm mode="create" initial={initial} />;
}
