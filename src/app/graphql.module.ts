import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS, Apollo} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';

import {InMemoryCache} from 'apollo-cache-inmemory';
import {Subject} from 'rxjs';
import {WebSocketLink} from 'apollo-link-ws';
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';

// tslint:disable-next-line:max-line-length
const TOKEN = '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkdWRpQHRpbWV0YWJsZS5jby5pbCIsInZlcmlmaWVkIjp0cnVlLCJyb2xlcyI6W3siaWQiOjEsIm5hbWUiOiJERUZBVUxUX1JPTEVfQURNSU4iLCJkZXNjcmlwdGlvbiI6bnVsbCwicmVhZCI6WyIxMDczNzQxNzg3IiwiNCJdLCJ1cGRhdGUiOlsiMTA3Mzc0MTc3NyIsIjQiXSwiZGVzdHJveSI6WyIxMDczNzQxNzg3IiwiNCJdLCJyZWFkT3RoZXIiOlsiMTA3Mzc0MTc3NyIsIjQiXSwidXBkYXRlT3RoZXIiOlsiMTA3Mzc0MTc4NyIsIjQiXSwiZGVzdHJveU90aGVyIjpbIjEwNzM3NDE3ODciLCI0Il0sImFwcGx5T25PdGhlcnMiOmZhbHNlLCJyb2xlTGV2ZWwiOjR9XSwibGVnYWxOYW1lIjoiRHVkaSBQYXJ0dXNoIiwiYWNjb3VudElkIjoxLCJhY2Nlc3NMZXZlbCI6NCwiYnVja2V0TmFtZSI6bnVsbCwiZW1wbG95ZWVDaGF0SWQiOiI1ZWQ0YzA0ZmQwMDk2NDE0YTVhMGMyZmUiLCJjaGF0QXBwSWQiOiI1ZWQ0YzA0ZmQwMDk2NDQ2MDFhMGMyZmQiLCJpYXQiOjE1OTEwMDE2OTgsImV4cCI6MTU5MTYwNjQ5OH0.SrgZKzWeVikCg9jyLo0cPQScKkeWvAsOq_dLy7eJ0Qc"'


const uri = 'http://graphql.vdi.co.il/graphql'; // <-- add the URL of the GraphQL server here
const socketUri = 'ws://graphql.vdi.co.il/graphql';
const errorSubject = new Subject<any>();
const getErrorSubject = () => errorSubject.asObservable();

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
})
export class GraphQLModule {
  constructor(
    private apollo: Apollo, httpLink: HttpLink
  ) {
    const ws = new WebSocketLink({
      uri: socketUri,
      options: {
        reconnect: true,
        connectionParams: {
          authToken: TOKEN // get from localstorage //
        }
      },
    });
    const http = httpLink.create({
      uri
    });
    const link = split(({query}) => {
      const {kind, operation}: any = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    }, ws, http);

    apollo.create({
      link,
      cache: new InMemoryCache({
        //  dataIdFromObject : (object) => object.id
      }),
    });

    getErrorSubject().subscribe((res) => {
      console.log(res);
    });

  }

}
