import { Cause, Data, Effect, Exit, ManagedRuntime, Option, Schema } from "effect";
import { FetchHttpClient } from "effect/http";
import { HttpApiClient } from "effect/http-api";

import { Api } from "@/contract/api";
import { ContractError } from "@/contract/errors/ContractError";

// Network failures, unexpected statuses and undecodable responses: nothing the user can act
// on beyond retrying, so they share one error.
export class UnexpectedApiError extends Data.TaggedError("UnexpectedApiError")<{ readonly cause: unknown }> {}

export type ApiError = ContractError | UnexpectedApiError;

const runtime = ManagedRuntime.make(FetchHttpClient.layer);

const client = HttpApiClient.make(Api, { baseUrl: globalThis.location?.origin });

type ApiClient = Effect.Success<typeof client>;

const isContractError = Schema.is(ContractError);

// Anything that is not an error from the contract becomes an `UnexpectedApiError`.
export const toApiError = (error: unknown): ApiError =>
  isContractError(error) || error instanceof UnexpectedApiError ? error : new UnexpectedApiError({ cause: error });

// The bridge between Effect and the Promise-based world of TanStack Query: resolves with the
// endpoint's success value, rejects with an `ApiError`.
export const callApi = async <A, E>(request: (api: ApiClient) => Effect.Effect<A, E>): Promise<A> => {
  const exit = await runtime.runPromiseExit(client.pipe(Effect.flatMap(request), Effect.mapError(toApiError)));
  if (Exit.isSuccess(exit)) return exit.value;
  throw Option.getOrElse(Cause.findErrorOption(exit.cause), () => new UnexpectedApiError({ cause: exit.cause }));
};
