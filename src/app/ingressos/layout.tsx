import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("site_config")
    .select("key, value")
    .in("key", ["ingressos_title", "ingressos_description"]);

  const config: Record<string, string> = {};
  data?.forEach((item) => {
    config[item.key] = item.value;
  });

  return {
    title: config.ingressos_title || "Ingressos | Nacional de Sinuca",
    description:
      config.ingressos_description ||
      "Garanta seu lugar no maior evento de sinuca do Brasil.",
  };
}

export default function IngressosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}