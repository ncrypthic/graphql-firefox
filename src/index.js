/**
 * This GraphiQL example illustrates how to use some of GraphiQL's props
 * in order to enable reading and updating the URL parameters, making
 * link sharing of queries a little bit easier.
 *
 * This is only one example of this kind of feature, GraphiQL exposes
 * various React params to enable interesting integrations.
 */
// Parse the search string to get url parameters.
const React    = require('react');
const ReactDOM = require('react-dom');
const Promise  = require('es6-promise');
const GraphiQL = require('graphiql');
require('graphiql/graphiql.css');
const R = React.createElement;

var search = window.location.search;
var parameters = {};
search.substr(1).split('&').forEach(function (entry) {
  var eq = entry.indexOf('=');
  if (eq >= 0) {
    parameters[decodeURIComponent(entry.slice(0, eq))] =
      decodeURIComponent(entry.slice(eq + 1));
  }
});
// if variables was provided, try to format it.
if (parameters.variables) {
  try {
    parameters.variables =
      JSON.stringify(JSON.parse(parameters.variables), null, 2);
  } catch (e) {
    // Do nothing, we want to display the invalid JSON as a string, rather
    // than present an error.
  }
}
// When the query and variables string is edited, update the URL bar so
// that it can be easily shared
function onEditQuery(newQuery) {
  parameters.query = newQuery;
  updateURL();
}

function onEditVariables(newVariables) {
  parameters.variables = newVariables;
  updateURL();
}

function onEditOperationName(newOperationName) {
  parameters.operationName = newOperationName;
  updateURL();
}

function updateURL() {
  var newSearch = '?' + Object.keys(parameters).filter(function (key) {
    return Boolean(parameters[key]);
  }).map(function (key) {
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(parameters[key]);
  }).join('&');
  history.replaceState(null, null, newSearch);
}

function InitialComponent(props) {
  const [server, setServer] = React.useState(null);
  const inputRef = React.createRef();
  function graphQLFetcher(graphQLParams) {
    if(!server) {
      return new Promise((_, reject) => reject('Please set graphql endpoint'));
    }
    // This example expects a GraphQL server at the path /graphql.
    // Change this to point wherever you host your GraphQL server.
    return fetch(server, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQLParams),
    }).then(function (response) {
      return response.text();
    }).then(function (responseBody) {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });
  }
  const graphiqlProps = {
    fetcher: graphQLFetcher,
    onEditOperationName,
    onEditVariables,
    onEditQuery,
  }
  return R(GraphiQL, graphiqlProps,
      R(GraphiQL.Toolbar, {}, [
        R(GraphiQL.Button, {onClick: () => window.g.handlePrettifyQuery(), label: 'Prettify'}),
        R(GraphiQL.Button, {onClick: () => window.g.handleToggleHistory(), label: 'History'}),
        R('input', {type: 'text', ref: inputRef}),
        R(GraphiQL.Button, {onClick: () => setServer(inputRef.current.value), label: 'Set Location'}),
      ])
    );
}

ReactDOM.render(R(InitialComponent), document.getElementById('graphiql'));
