import { redirect } from "next/navigation";

export const metadata = {
  title: "Usage",
};

export default function UsageRedirect() {
  redirect("/meta?source=live");
}
