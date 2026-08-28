const API_URL = '/products';


// ==========================================
// HTML Elements
// ==========================================

const productForm =
  document.getElementById('productForm');

const productsTable =
  document.getElementById('productsTable');

const status =
  document.getElementById('status');


// ==========================================
// GET PRODUCTS
// ==========================================

async function getProducts() {

  try {

    const response =
      await fetch(API_URL);


    if (!response.ok) {

      throw new Error(
        'Failed to get products'
      );

    }


    const products =
      await response.json();


    displayProducts(products);


    status.textContent =
      `Total Products: ${products.length}`;


  } catch (error) {

    console.error(error);


    status.textContent =
      'Failed to load products';

  }

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(products) {

  productsTable.innerHTML = '';


  if (products.length === 0) {

    productsTable.innerHTML = `
      <tr>
        <td colspan="4" class="empty">
          No products found
        </td>
      </tr>
    `;

    return;

  }


  products.forEach(function(product) {

    const row =
      document.createElement('tr');


    row.innerHTML = `
      <td>
        ${product.name}
      </td>

      <td>
        ${product.price}
      </td>

      <td>
        ${product.quantity}
      </td>

      <td>

        <div class="actions">

          <button
            class="edit-btn"
            onclick="editProduct('${product._id}')"
          >
            Edit
          </button>

          <button
            class="delete-btn"
            onclick="deleteProduct('${product._id}')"
          >
            Delete
          </button>

        </div>

      </td>
    `;


    productsTable.appendChild(row);

  });

}


// ==========================================
// ADD PRODUCT
// ==========================================

productForm.addEventListener(
  'submit',
  async function(event) {

    event.preventDefault();


    const name =
      document.getElementById('name').value;


    const price =
      document.getElementById('price').value;


    const quantity =
      document.getElementById('quantity').value;


    try {

      const response =
        await fetch(
          API_URL,
          {

            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({

              name: name,

              price: Number(price),

              quantity: Number(quantity)

            })

          }
        );


      if (!response.ok) {

        throw new Error(
          'Failed to add product'
        );

      }


      const product =
        await response.json();


      console.log(
        'Product added:',
        product
      );


      productForm.reset();


      await getProducts();


      status.textContent =
        'Product added successfully';


    } catch (error) {

      console.error(error);


      status.textContent =
        'Failed to add product';

    }

  }
);


// ==========================================
// EDIT PRODUCT
// ==========================================

async function editProduct(id) {

  const newName =
    prompt(
      'Enter new product name:'
    );


  if (newName === null) {
    return;
  }


  const newPrice =
    prompt(
      'Enter new price:'
    );


  if (newPrice === null) {
    return;
  }


  const newQuantity =
    prompt(
      'Enter new quantity:'
    );


  if (newQuantity === null) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {

          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({

            name: newName,

            price: Number(newPrice),

            quantity: Number(newQuantity)

          })

        }
      );


    if (!response.ok) {

      throw new Error(
        'Failed to update product'
      );

    }


    const updatedProduct =
      await response.json();


    console.log(
      'Product updated:',
      updatedProduct
    );


    await getProducts();


    status.textContent =
      'Product updated successfully';


  } catch (error) {

    console.error(error);


    status.textContent =
      'Failed to update product';

  }

}


// ==========================================
// DELETE PRODUCT
// ==========================================

async function deleteProduct(id) {

  const confirmed =
    confirm(
      'Are you sure you want to delete this product?'
    );


  if (!confirmed) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE'
        }
      );


    if (!response.ok) {

      throw new Error(
        'Failed to delete product'
      );

    }


    const result =
      await response.json();


    console.log(
      'Product deleted:',
      result
    );


    await getProducts();


    status.textContent =
      'Product deleted successfully';


  } catch (error) {

    console.error(error);


    status.textContent =
      'Failed to delete product';

  }

}


// ==========================================
// LOAD PRODUCTS
// ==========================================

getProducts();