import { ManualsIndex } from "@/components/manuals/ManualsIndex";
import { loadAuthorPrompts } from "@/lib/manuals/author-prompts.server";

export default async function ManualsPage() {
  const prompts = await loadAuthorPrompts();
  return <ManualsIndex prompts={prompts} />;
}
