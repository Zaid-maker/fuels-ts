/* 

  Replaces `graphql-request` and `graphql-tag` dependencies with a simple
  `fetch` implementation, reducing the final bundle size by 15.68 kB.

  More:
    https://github.com/FuelLabs/fuels-ts/discussions/1592#discussioncomment-8003515

*/

import type { DocumentNode } from 'graphql';
import { print } from 'graphql';

import { fuelGraphQLSubscriber } from './fuel-graphql-subscriber';

function isSubscription(query: DocumentNode) {
  const opDefinition = query.definitions.find((x) => x.kind === 'OperationDefinition') as {
    operation: string;
  };
  return opDefinition?.operation === 'subscription';
}

async function handleQueryAndMutation(fetchFn: typeof fetch, url: string, request: RequestInit) {
  const response = await fetchFn(url, request);

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

  return data;
}

export function fuelGraphQLRequest(
  fetchFn: typeof fetch,
  url: string,
  operation: DocumentNode,
  variables: Record<string, unknown>
) {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: print(operation), variables }),
  };

  if (isSubscription(operation)) {
    return fuelGraphQLSubscriber({
      fetchFn,
      url,
      request,
    });
  }

  return handleQueryAndMutation(fetchFn, url, request);
}
