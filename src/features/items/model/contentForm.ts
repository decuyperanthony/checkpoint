import { ItemContent } from "@/contract/schemas/Item";
import { textFormResolver } from "@/shared/lib/textFormResolver";

export const contentResolver = textFormResolver(ItemContent);
