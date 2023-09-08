E-Commerce Server with Flask

# Project Overview

 Welcome to the E-Commerce Server project! This application serves as the server system for an e-commerce-marketplace-style website. The primary focus of this project is to provide a robust foundation for handling user authentication, product management, cart functionality, and more. The server is built using Flask, a micro web framework, with an emphasis on supporting seamless integration with a React frontend.

## Project Highlights

- **User Authentication**: Users can create accounts, log in securely, and manage their profiles. The backend uses bcrypt for password hashing to ensure user data remains protected.
    
- **Shopping Cart**: The application includes a comprehensive shopping cart feature that allows users to add products, review their selections, and proceed to checkout. Users can add products to their cart, and the cart dynamically tracks the quantity of each selected item. As prices may fluctuate, the cart does not provide an immediate total cost. Instead, users can review the individual prices and quantities of their selected items. When ready to proceed, users can seamlessly transition to the checkout process.

- **Purchase History:** Once the checkout process is complete the users current cart is marked paid and a new one is created. The product price at time of purchase is recorded for accurate display in the future. 
    
- **Inventory Management**: Product inventory is maintained with real-time quantity updates. When users purchase items from their carts, the available quantities are deducted accordingly.  If items are no longer available at time of checkout the checkout process is aborted and an array of unavailable products is returned.
    
- **Product Listings and Search**: The application offers a comprehensive listing of products available for users to explore. Users have the ability to search for specific products based on various criteria, enhancing the user experience and making it easier to find desired items. The search functionality allows users to search by product name, category, or description. This feature provides a convenient way for users to quickly locate products that match their interests or needs. Whether searching for a specific product or simply browsing through the diverse range of offerings, the search feature enhances the visibility and accessibility of products within the platform.

- **Pagination**: The project includes a robust pagination system that allows efficient handling of large datasets, ensuring a smooth user experience even when dealing with a substantial number of products. Pagination is implemented in the product listings to enhance performance and usability.

- **Product Reviews**: Products can receive reviews from users. These reviews can include ratings and written feedback, contributing to an engaging shopping experience.
    
- **React Integration**: The backend is structured with the goal of seamless integration with a React frontend. API calls return data in a standardized format, making it easier for the frontend to process and display information.
    
- **JWT Authentication**: JSON Web Tokens (JWT) are used for secure authentication. Users receive a token upon successful login or registration, allowing them to access protected routes.




## API Endpoints

### <u>Users API </u>
#### User Registration

**Endpoint**: `/api/users/register`  
**Method**: `POST`  
**Description**: Registers a new user.  
**Request Body**:

```json
{  
	"first_name": "example",
	"last_name": "example",
	"address": "example",
	"email": "example@example.com",
	"password": "example",
	"confirm_password": "example", 
}
```

**Response**:

- Success (Status 200):
``` json
{   
	"message": "User created",   
	"data": {
		"user_id": 1,
		"first_name": "example",
		"last_name": "example",
		"address": "example",
		"email": "example@example.com",
		"created_at": "2023-08-25T12:00:00",
		"updated_at": "2023-08-25T12:00:00"
	},
	"token": "JWT_TOKEN"
}
```

- Error (Status 400):
```json
{
	"message": "Invalid data",
	"error": {
		"first_name": ["First name is required."],
		"last_name": ["Last name is required."],
		"address": ["Address is required.", "Invalid address format"],
		"email": ["Email is required.", "Invalid email format."],
		"password": ["Password is required.", "Invalid password format.". "Password does not match"],
		"confirm_password": ["Password is required.", "Invalid password format.", "Password does not match]
	}
}
 ```

#### User Login

**Endpoint**: `/api/users/login`  
**Method**: `POST`  
**Description**: Authenticates a user and provides a JWT token.  
**Request Body**:

```json
{
	"email": "example@example.com",
	"password": "example"
}
```

**Response**:

- Success (Status 200):
```json
{
	"message": "Valid credentials",
	"token": "JWT_TOKEN",
	"data": {
		"user_id": 1,
		"first_name": "example",
		"last_name": "example",
		"address": "example",
		"email": "example@example.com",
		"created_at": "2023-08-25T12:00:00",
		"updated_at": "2023-08-25T12:00:00"
	}
}
```
    
- Error (Status 400):
``` json
{
	"message": "Invalid credentials",
	"error": "Invalid credentials" }
```



#### Get User by ID

**Endpoint**: `/api/users/<int:user_id>`  
**Method**: `GET`  
**Description**: Retrieves user details by user ID.  
**Response**:

- Success (Status 200):
 ```json
{   
	"message": "User found",
	"data": {
		"id": 1,
		"first_name": "example",
		"last_name": "example",
		"address": "example",
		"email": "example@example.com",
		"created_at": "2023-08-25T12:00:00",
		"updated_at": "2023-08-25T12:00:00"
	}
}
```
   
- Error (Status 404):
    
```json
{   
	"message": "User not found",
	"error": "Invalid user id"
}
```


### <u>Products API</u>

#### Product Create

**Endpoint**: `/api/products/create`  
**Method**: `POST`  
**Description**: *Requires user authentication.* Creates a new product. Also allows image upload.  Image upload should be called after product creation. If image upload fails error messages will be received and the product will be assigned the default image.

Note: Category can be one word or multiple words, however, multiple words are required to have comma separation. Currently there is no control over category creation.  They are stored as a comma separated string.  Categories table on to do. The only rules are a single category entered as: category1 or multiple categories entered as : category1, category2, category3, etc... 
###### 1.  Create product

- Make a `POST` request to `/api/products/create` with the necessary product details in the request body as JSON.

```json
{
    "name": "example",
    "description": "example",
    "category": "example, example, example",
    "quantity": 1,
    "price": 1.99
}
```

**Response**

- Success (Status 201):
```json
{
    "data": {
        "product_id": 1,
        "user_id": 4,
        "name": "example",
        "category": "example, example, example",
        "price": 1.99,
        "quantity": 1,
        "description": "example",
        "img_filename": "default.png",
        "reviews": [],
        "seller": {
	        "user_id": 1,
	        "first_name": "example",
            "last_name": "example",
            "address": "example",
            "email": "example",
            "created_at": "Tue, 22 Aug 2023 20:57:27 GMT",
            "updated_at": "Tue, 22 Aug 2023 20:57:27 GMT"
        },
        "created_at": "Sun, 27 Aug 2023 20:48:28 GMT",
        "updated_at": "Sun, 27 Aug 2023 20:48:28 GMT"
    },
    "message": "Product created",
    "status": "success"
}
```

- Error (Status 400)
```json
{
    "error": {
        "category": [
            "Category cannot be blank"
        ],
        "description": [
            "Description cannot be blank"
        ],
        "name": [
            "Name cannot be blank"
        ],
        "price": [
            "Price can't be less than 0.01"
        ],
        "quantity": [
            "Quantity can't be less than 0"
        ]
    },
    "message": "Invalid data"
}
```

###### 2. Additional steps for image upload upon create

1. After successfully creating the product, you will receive a response containing the product details, including the `product_id` of the newly created product.
    
2. Use the `product_id` received from step 1 in the next API call to upload the product image.
    
	**Endpoint**: `/api/img/upload/product`  
	**Method**: `POST`  
	**Description**: *Requires authorization.* Uploads the product image associated with a specific product. Current max image size is set to 2 MB. Accepted file types : txt, pdf, png, jpg, jpeg, gif.

	1. Make a `POST` request to `/api/img/product/upload` with the following from data:
    
	    - `file`: The image file to be uploaded.
	    - `product_id`: The `id` of the product for which the image is being uploaded.
    
	    **Note**: Ensure that the `product_id` matches the `id` of the product you created in the previous step.

	**Response:**
	
    - Success  (Status 200):
``` json
{
	"message": "File upload complete"
}
```

   - Error (Status 400):
``` json
{
	"message": "File upload failed"
}
```

``` json
{
	"message": "File size exceeds allowed limit"
}
```

``` json
{
	"message": "File type not allowed"
}
```

#### Get all products

**Endpoint**: `/api/products/` 
**Method**: `GET`  
**Description**: Gets all products in the database as an array of products.  Paginated results. Default return is page 1 of 10 results. Use query params to adjust.

```bash
GET /api/products?page=2
```

```bash
GET /api/products?page=7&per_page=4
```

#### Get one product

**Endpoint**: `/api/products/product_id` 
**Method**: `GET`  
**Description**: Gets product by its id. 

**Response:**

- Success (Status 200)
```json
{
    "data": {
        "category": "example",
        "created_at": "Tue, 22 Aug 2023 02:32:48 GMT",
        "creator": {
            "address": "example",
            "created_at": "Tue, 22 Aug 2023 02:05:32 GMT",
            "email": "example@example.com",
            "first_name": "example",
            "last_name": "example",
            "updated_at": "Tue, 22 Aug 2023 02:05:32 GMT",
            "user_id": 3
        },
        "description": "example",
        "img_url": "product_id_uniqueIdentifier_filename.jpg",
        "name": "example",
        "price": 1.99,
        "product_id": 1,
        "quantity": 1,
        "reviews": [
            {
                "content": "example",
                "created_at": "2023-08-24 04:31:41",
                "creator": {
                    "address": "example",
                    "created_at": "2023-08-22 02:05:32",
                    "email": "example@example.com",
                    "first_name": "example",
                    "last_name": "example",
                    "updated_at": "2023-08-22 02:05:32",
                    "user_id": 3
                },
                "product_id": 1,
                "rating": 1,
                "review_id": 11,
                "updated_at": "2023-08-27 21:18:50",
                "user_id": 3
            }
        ],
        "updated_at": "Sun, 27 Aug 2023 19:46:42 GMT",
        "user_id": 3
    },
    "message": "Product found"
}
```

- Error (Status 404)
```
{
    "error": "Invalid product id",
    "message": "Product not found"
}
```

#### Search for product by name

**Endpoint**: `/api/products/name/search_term` 
**Method**: `GET`  
**Description**: Gets an array of products with search term in product name. Empty array returned on no search result found. Paginated results. Default return is page 1 of 10 results. Use query params to adjust.

```bash
GET /api/products/name/search_term?page=7&per_page=4
```

**Response:**

- Success (Status 200)
```json
{
    "data": [],
    "message": "All products by name"
}
```

#### Search for product by category

**Endpoint**: `/api/products/category/search_term` 
**Method**: `GET`  
**Description**: Gets an array of products with search term in product category. See product create for category requirements. Empty array returned on no search result found. Paginated results. Default return is page 1 of 10 results. Use query params to adjust.

```bash
GET /api/products/category/search_term?page=7&per_page=4
```

**Response:**

- Success (Status 200)
```json
{
    "data": [],
    "message": "All products by category"
}
```

#### Search for product by description

**Endpoint**: `/api/products/description/search_term` 
**Method**: `GET`  
**Description**: Gets an array of products with search term in product description. Empty array returned on no search result found. Paginated results. Default return is page 1 of 10 results. Use query params to adjust.

```bash
GET /api/products?page=7&per_page=4
```

**Response:**

- Success (Status 200)
```json
{
    "data": [],
    "message": "All products by description"
}
```

#### Get products by user

**Endpoint**: `/api/products/user/user_id` 
**Method**: `GET`  
**Description**: Gets an array of all products the user_id has for sale, including items with a zero quantity. An invalid user_id will return the same results. Paginated results. Default return is page 1 of 10 results. Use query params to adjust.

```bash
GET /api/products/user/user_id?page=7&per_page=4
```

**Response:**

- Success (Status 200)
```json
{
    "data": [],
    "message": "All products by user_id"
}
```

#### Edit a product

**Endpoint**: `/api/products/edit/` 
**Method**: `PUT`  
**Description**: *Requires user authentication.* Edits all product details except the product image. To update the product image use the `/api/img/products/upload` call.
**Request Body**

```json
{
    "product_id": 1,
    "name": "example",
    "description": "example",
    "category": "example",
    "quantity": 0,
    "price": 0.01
}
```

**Reponse:**

- Success (Status 200)
```json
{
    "data": {
        "category": "example",
        "created_at": "Sun, 27 Aug 2023 20:48:28 GMT",
        "seller": {
            "address": "555 ",
            "address": "## example st, example, AA, #####",
            "created_at": "Tue, 22 Aug 2023 20:57:27 GMT",
            "email": "example@example.com",
            "first_name": "example",
            "last_name": "example",
            "updated_at": "Tue, 22 Aug 2023 20:57:27 GMT",
            "user_id": 4
        },
        "description": "example",
        "img_filename": "default.png",
        "name": "example",
        "price": 0.01,
        "product_id": 101,
        "quantity": 0,
        "reviews": [],
        "updated_at": "Mon, 28 Aug 2023 00:07:23 GMT",
        "user_id": 4
    },
    "message": "success"
}

```

- Error (Status 400)
```json
{
    "error": {
        "category": [
            "Category cannot be blank"
        ],
        "description": [
            "Description cannot be blank"
        ],
        "name": [
            "Name cannot be blank"
        ],
        "price": [
            "Price cannot be less than 0.01"
        ],
        "quantity": [
            "Quantity cannot be less than 0"
        ]
    },
    "message": "Invalid data"
}
```

#### Delete a product

**Endpoint**: `/api/products/delete/product_id` 
**Method**: `DELETE`  
**Description**: *Requires user authentication.* Deletes a product from the database.

**Response:**

- Success (Status 200)
```json
{
    "message": "Product deleted"
}
```

- Error (Status 401)
```json
{
    "message": "Unauthorized access"
}
```

### <u>Reviews API</u>

#### Create review

**Endpoint**: `/api/reviews/create`  
**Method**: `POST`  
**Description**: *Requires authorization* Creates a review for a product.  
**Request Body**:

```json
{
    "product_id" : 58,
    "content" : "example",
    "rating" : 1
}
```

**Response:**

- Success (Status 201)
```json
{
    "message": "Review added successfully"
}
```

- Error (Status 400)
```json
{
    "error": {
        "content": [
            "Review cannot be blank"
        ],
        "rating": [
            "Rating must be a number"
        ]
    },
    "message": "Invalid data"
}
```

- Error (Status 400)
```json
{
    "error": {
        "product_id": [
            "Invalid product id"
        ]
    },
    "message": "Invalid data"
}
```

### <u>Carts API</u>

#### Add to Cart

**Endpoint**: `/api/carts/add_product`  
**Method**: `PUT`  
**Description**: *Requires authorization.* Adds a product to the users current cart.  Authorization token provides user_id. This is used to get the current cart_id.
**Request Body**:

```json
{
	"product_id" : 1,
	"quantity_to_purchase" : 1
}
```

**Response:**

- Success (Status 200)
```json
{
    "message": "Item added to cart",
    "status": "success"
}
```

- Error (Status 400)
```json
{
    "message": "Item quantity unavailable",
    "status": "fail"
}
```

#### View current unpaid cart

**Endpoint**: `/api/carts/view/active
**Method**: `GET`  
**Description**: *Requires authorization.* Returns users current cart.  Authorization token provides user_id. This is used to get the current cart_id.

**Response:**

- Success (Status 200)
```JSON
{
    "data": {
        "cart_id": 5,
        "created_at": "Wed, 30 Aug 2023 16:49:24 GMT",
        "is_paid": 0,
        "products_in_cart": [],
        "updated_at": "Wed, 30 Aug 2023 16:49:24 GMT",
        "user_id": 3
    }
}
```

#### View all carts marked paid

**Endpoint**: `/api/carts/view/paid
**Method**: `GET`  
**Description**: *Requires authorization.* Returns an array of all of the users carts where is_paid is True. Price in paid cart reflects price at time of purchase.  

#### Edit item quantity in cart

**Endpoint**: `/api/carts/edit
**Method**: `PUT`  
**Description**: *Requires authorization.* Edits the product quantity to purchase in the users current cart. Set quantity_to_purchase to 0 to remove item from cart.
**Request body: (note: cart_id required here)**

```json
{
	"cart_id" : 1,
    "product_id" : 1,
    "quantity_to_purchase" : 1
}
```

**Response:**

- Success (Status 200)
```json
{
    "message": "Quantity in cart updated",
    "status": "success"
}
```

- Error (Status 400)
```json
{
	"message": "Something went wrong"
}
```

#### Checkout cart

**Endpoint**: `/api/carts/checkout
**Method**: `PUT`  
**Description**: *Requires authorization.* Validates product item quantity in cart is within product available quantity.  If all item quantities are available the quantity in the cart is subtracted from the quantity in inventory.  If items quantities are not available the checkout process is halted and an array of unavailable products is returned. Authorization token provides user_id. This is used to get the current cart_id.

#### Empty current cart

**Endpoint**: `/api/carts/empty
**Method**: `PUT`  
**Description**: *Requires authorization.* Removes all items from the users current cart. Authorization token provides user_id. This is used to get the current cart_id.

### <u>Image API</u>

#### Product Image

##### Upload Product Image

**Endpoint**: `/api/img/products/upload`  
**Method**: `POST`  
**Description**: *Requires authorization.* Uploads the product image associated with a specific product. 
 - Current max image size is set to 2 MB. 
 - Accepted file types : txt, pdf, png, jpg, jpeg, gif.
 - Images are stored in /server/uploads/product_images/product_id/ where product_id is the products id.  If a replacement image is uploaded the previously uploaded image is deleted. Multiple pictures on to do.

**Required Parameters:**

- `file`: The image file to upload. Make sure the key for this parameter is `file`.
- `product_id`: The ID of the product for which you're uploading the image. Make sure the key for this parameter is `product_id`.

**Response:**

- Success (Status 200)
``` json
{
	"message": "File upload complete"
}
```

- Error (Status 400)
``` json
{
	"message": "File upload failed"
}
```

``` json
{
	"message": "File size exceeds allowed limit"
}
```

``` json
{
	"message": "File type not allowed"
}
```

##### Retrieve Product Image

**Endpoint**: `/api/img/products/img_filename`  
**Method**: `GET`  
**Description**: Retrieves the selected filename and returns the image. If the filename is not found the default image is returned. The img_filename is found in product data.

## Authentication

- Authentication is handled by JWT tokens and should be transmitted as a Bearer token on authorization required routes.  If an invalid or no token is transmitted a 401 is returned.
- Token payload = user_id

- Example use
```javascript
const apiUrl = 'https://localhost:5000/api/route';
const token = 'the-jwt-token';

const headers = {
  Authorization: `Bearer ${token}`
};

axios.get(apiUrl, { headers })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
```

- Response status 401
```json
{
    "message": "Unauthorized"
}
``` 

## Usage Examples

- TBD

  



## Error Handling

- Most errors are returned in response.error.  Additional try catch error handling on to do.

  



## Rate Limiting and Quotas

- None

  



## Environment Variables

-  In /server create .env file. Add the following:
	- SECRET_KEY=your_secret_key
	- DATABASE_NAME=your_database_name
		- ( Note the included ERD is called ecommerce_schema )

  



## Deployment Instructions

- TBD

  



## Dependencies

To run this project, you will need to have the following dependencies installed:

- **Flask**: A micro web framework for building web applications.
- **PyMySQL**: A pure-Python MySQL client library.
- **Flask-Bcrypt**: An extension for hashing passwords securely.
- **PyJWT**: A library for encoding and decoding JSON Web Tokens (JWT).
- **python-dotenv**: A package for managing environment variables in a `.env` file.
- **flask-cors**: Set for use with vite@latest on port 5173. Adjust in main.py.

You can install these packages by:
- Open server folder in terminal
- Enter the following command :
``` bash
pipenv shell
```
- Now enter :
``` bash
pipenv install
```
 - To run server enter :
 ``` bash
 python3 main.py
```


## Testing

  - Routes were tested in postman.  Please test as needed.
  



## Conclusion

This has been a fun project to work on.  I learned a lot more about properly using jsonify and setting up a user authenticated server using jwt tokens.  There is still much more to be done.  A small list of to do's are below.

- Additional error handling
- Add user privileges table
- Add Categories table
- Add Multiple product images
- Add image to review
- Add address and billing address tables
- Add seller rating.
- Fix bugs...