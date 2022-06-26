
//* Incorporate current page's url (parameter) into GraphQL Querry to get product data by it's id */

const GET_PRODUCT_PAGE_BY_ID = `
    query ProductByID($id: String!) {
        product(id: $id) {
            id
            name
            inStock
            gallery
            description
            attributes {
                id
                name
                type
                items {
                    displayValue
                    value
                    id
                }
            }
            prices {
                currency {
                    label
                    symbol
                }
                amount
            }
            brand
        }
    }
`;

export default GET_PRODUCT_PAGE_BY_ID;