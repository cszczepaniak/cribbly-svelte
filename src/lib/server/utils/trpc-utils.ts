// trpc-helper.ts
import type { Router } from "$lib/server/trpc/router";
import type {
  inferProcedureOutput,
  inferProcedureInput,
} from "@trpc/server";

/**
 * Enum containing all api query paths
 */
export type TQuery = keyof Router["_def"]["queries"];

/**
 * Enum containing all api mutation paths
 */
export type TMutation = keyof Router["_def"]["mutations"];

/**
 * Enum containing all api subscription paths
 */
export type TSubscription = keyof Router["_def"]["subscriptions"];

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  Router["_def"]["queries"][TRouteKey]
>;

/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  Router["_def"]["queries"][TRouteKey]
>;

/**
 * This is a helper method to infer the output of a mutation resolver
 * @example type HelloOutput = InferMutationOutput<'hello'>
 */
export type InferMutationOutput<TRouteKey extends TMutation> =
  inferProcedureOutput<Router["_def"]["mutations"][TRouteKey]>;

/**
 * This is a helper method to infer the input of a mutation resolver
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferMutationInput<TRouteKey extends TMutation> =
  inferProcedureInput<Router["_def"]["mutations"][TRouteKey]>;

/**
 * This is a helper method to infer the output of a subscription resolver
 * @example type HelloOutput = InferSubscriptionOutput<'hello'>
 */
export type InferSubscriptionOutput<TRouteKey extends TSubscription> =
  inferProcedureOutput<Router["_def"]["subscriptions"][TRouteKey]>;

/**
 * This is a helper method to infer the input of a subscription resolver
 * @example type HelloInput = InferSubscriptionInput<'hello'>
 */
export type InferSubscriptionInput<TRouteKey extends TSubscription> =
  inferProcedureInput<Router["_def"]["subscriptions"][TRouteKey]>;
