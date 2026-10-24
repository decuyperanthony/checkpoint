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

// Relative URLs, resolved against the page: the client only runs in the browser.
const client = HttpApiClient.make(Api);

type ApiClient = Effect.Success<typeof client>;

const isContractError = Schema.is(ContractError);

// Anything that is not an error from the contract becomes an `UnexpectedApiError`.
export const toApiError = (error: unknown): ApiError =>
  isContractError(error) || error instanceof UnexpectedApiError ? error : new UnexpectedApiError({ cause: error });

// The bridge between Effect and the Promise-based world of TanStack Query: resolves with the
// endpoint's success value, rejects with an `ApiError`.
// `signal` comes from TanStack Query, so unmounted or cancelled queries abort their request.
export const callApi = async <A, E>(
  request: (api: ApiClient) => Effect.Effect<A, E>,
  options?: { readonly signal?: AbortSignal },
): Promise<A> => {
  const exit = await runtime.runPromiseExit(client.pipe(Effect.flatMap(request)), options);
  if (Exit.isSuccess(exit)) return exit.value;
  const error = toApiError(Option.getOrElse(Cause.findErrorOption(exit.cause), () => exit.cause));
  // Unexpected failures only reach the user as a generic message: keep the details for debugging.
  if (error instanceof UnexpectedApiError) console.error(Cause.pretty(exit.cause));
  throw error;
};
