
//* Query for fetching products by category on the StorePage.js */
  
const GET_ALL_PRODUCTS_BY_CATEGORY = `
  query AllProducts($title: String!) {
    category(input: {
        title: $title
    }) {
      name
      products {
        id
        name
        inStock
        gallery
        category
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
      }
    }
}`;

export default GET_ALL_PRODUCTS_BY_CATEGORY;