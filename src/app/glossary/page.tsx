import Link from "next/link";
import { PageFrame } from "@/components/chrome/PageFrame";
import { TERMS } from "@/content/glossary";

export const metadata = {
  title: "Glossary",
  description: "Jobs, styles, and the words other guides use.",
};

export default function GlossaryPage() {
  return (
    <PageFrame variant="reading">
      <h1 className="text-4xl font-semibold tracking-tight">Glossary</h1>
      <p className="mt-3 text-muted">Jobs, styles, and the words other guides use.</p>
      <dl className="mt-10 space-y-8">
        {TERMS.map((x) => (
          <div key={x.t}>
            <dt className="text-xl font-semibold">{x.t}</dt>
            <dd className="mt-2 text-muted">
              {x.d}
              {x.href ? (
                <>
                  {" "}
                  <Link href={x.href} className="underline">
                    Read more
                  </Link>
                </>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </PageFrame>
  );
}
