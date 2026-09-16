import { redirect } from "next/navigation";

export default function UsageRedirect() {
  redirect("/meta?source=live");
}
