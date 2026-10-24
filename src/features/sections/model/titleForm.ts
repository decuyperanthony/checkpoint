import { effectTsResolver } from "@hookform/resolvers/effect-ts";

import { SectionTitlePayload } from "@/contract/schemas/Section";

// Forms validate with the same schema the API decodes with.
export const titleResolver = effectTsResolver(SectionTitlePayload);
