import { Layer } from "effect";
import { HttpRouter } from "effect/http";

import { ApiHandlers } from "@/server/http";
import { AppConfig, AuthConfig } from "@/server/infra/Config";
import { Db } from "@/server/infra/Db";
import { ItemRepositoryDrizzle } from "@/server/repositories/ItemRepositoryDrizzle";
import { LoginAttemptRepositoryDrizzle } from "@/server/repositories/LoginAttemptRepositoryDrizzle";
import { SectionRepositoryDrizzle } from "@/server/repositories/SectionRepositoryDrizzle";
import { SessionRepositoryDrizzle } from "@/server/repositories/SessionRepositoryDrizzle";
import { PinVerifierArgon2 } from "@/server/security/PinVerifierArgon2";

const RepositoriesDrizzle = Layer.mergeAll(
  SectionRepositoryDrizzle,
  ItemRepositoryDrizzle,
  SessionRepositoryDrizzle,
  LoginAttemptRepositoryDrizzle,
).pipe(Layer.provide(Db.layer), Layer.provide(AppConfig.layer));

const Production = Layer.merge(RepositoriesDrizzle, PinVerifierArgon2.pipe(Layer.provide(AuthConfig.layer)));

// Built once per server instance. If a Layer fails to build (missing variable, for instance),
// every request fails with that error and it is logged with its explicit message.
const { handler } = HttpRouter.toWebHandler(ApiHandlers.pipe(Layer.provide(Production)));

// Next route handlers receive `(request, context)`: this keeps the exported signature to `(request)`.
export const handleApiRequest = (request: Request) => handler(request);
