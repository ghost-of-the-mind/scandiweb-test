
//* Query for fetching product categories from GraphQL for NavSection.js and Store.js */

const GET_CATEGORIES = `
    query Categories {
	    categories {
        name
        }
    }
`;

export default GET_CATEGORIES;