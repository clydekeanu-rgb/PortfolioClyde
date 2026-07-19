import { redirect } from "next/navigation";

/** Sandbox route retired — permanent redirect handled in next.config too. */
export default function HomepageRedoRedirect() {
  redirect("/");
}
