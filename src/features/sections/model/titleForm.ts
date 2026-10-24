import { SectionTitle } from "@/contract/schemas/Section";
import { textFormResolver } from "@/shared/lib/textFormResolver";

export const titleResolver = textFormResolver(SectionTitle);
