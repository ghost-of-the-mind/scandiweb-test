
//* Query for fetching all avaiable currencies from GraphQL for NavSection.js */

const GET_CURRENCIES = `
    query Currencies {
      currencies {
        label
        symbol
      }
    }
`;

export default GET_CURRENCIES;