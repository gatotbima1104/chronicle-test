# Distributed E-Commerce Order System

## Features
- **Product Management**
- **RBAC Implemented**
- **Order with Background Task (Celery)**
- **Docker Compose Implemented**
- **API Cahced use Redis**
- **Rate Limiter**

## Tech Stack
- **API: Express-Typescript & Flask-Python**
- **Database: Postgresql**
- **ORM: Prisma**
- **Background Worker: Celery**
- **Caching: Redis**
- **Containerization: Docker Compose**


## Scenarios to test
1. Create a product
- Register as role: ADMIN
- Login as registered account with role: ADMIN
- Create a product

2. Order
- Register as role: USER
- Login as registered account with role: USER
- Create an order

<img width="1126" height="230" alt="Screenshot 2026-01-08 at 12 56 43" src="https://github.com/user-attachments/assets/21799daf-c425-4c3b-a11e-ab5d803441f7" />


## Setup using Docker
- **Docker Installed**

```
    1. rename .env.example to .env file in the project root
    2. Fill with your credentials
    3. Build & Run the App
        
        ```
            docker compose down
            docker compose build
            docker compose up
        ```

```

## Handling Race Condition (Stock Management)
To avoid overselling during the concurrent purchases, the app uses Atomic database-level operations to provide it, why?

```
    UPDATE table
    SET stock = stock - %s
    WHERE id = %s AND stock >= %s
```

The query is atomic, then the pg is guarantees only one transaction succeds if, if the stock is < 1 transaction must be failed.


## Postman Collection

This project includes a complete **Postman Collection** for testing all available APIs:
- Authentication
- Product CRUD
- Order creation (with background processing)
- Note there is rate limit for each API's testing

<img width="681" height="159" alt="Screenshot 2026-01-08 at 18 03 30" src="https://github.com/user-attachments/assets/aa50a7a8-5ebb-4d1f-88f5-5c61367a0964" />


### How to Use

1. Open **Postman | Apidog | your favorite platforms**
2. Click **Import**
3. Paste the JSON below **or** save it as `chronicle.postman_collection.json` and import the file
4. Set the environment variable:


### JSON with default host (http://localhost:8000)

```json
{
"info": {
 "name": "Chronicle",
 "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
},
"item": [
 {
   "name": "chronicle-test",
   "item": [
     {
       "name": "auth",
       "item": [
         {
           "name": "register",
           "request": {
             "method": "POST",
             "body": {
               "mode": "raw",
               "raw": "{\n  \"email\": \"test1@gmail.com\",\n  \"password\": \"test1\",\n  \"role\": \"USER\"\n}",
               "options": { "raw": { "language": "json" } }
             },
             "url": {
               "raw": "{{baseUrl}}/auth/register",
               "host": ["{{baseUrl}}"],
               "path": ["auth", "register"]
             }
           }
         },
         {
           "name": "login",
           "request": {
             "method": "POST",
             "body": {
               "mode": "raw",
               "raw": "{\n  \"email\": \"test1@gmail.com\",\n  \"password\": \"test1\"\n}",
               "options": { "raw": { "language": "json" } }
             },
             "url": {
               "raw": "{{baseUrl}}/auth/login",
               "host": ["{{baseUrl}}"],
               "path": ["auth", "login"]
             }
           }
         }
       ]
     },
     {
       "name": "product",
       "item": [
         {
           "name": "create",
           "request": {
             "method": "POST",
             "body": {
               "mode": "raw",
               "raw": "{\n  \"name\": \"mangga\",\n  \"stock\": 10,\n  \"price\": 2\n}",
               "options": { "raw": { "language": "json" } }
             },
             "url": {
               "raw": "{{baseUrl}}/product",
               "host": ["{{baseUrl}}"],
               "path": ["product"]
             }
           }
         },
         {
           "name": "get",
           "request": {
             "method": "GET",
             "header": [
               {
                 "key": "Authorization",
                 "value": "Bearer <JWT_TOKEN>"
               }
             ],
             "url": {
               "raw": "{{baseUrl}}/product",
               "host": ["{{baseUrl}}"],
               "path": ["product"]
             }
           }
         },
         {
           "name": "update",
           "request": {
             "method": "PATCH",
             "body": {
               "mode": "raw",
               "raw": "{\n  \"price\": 6\n}",
               "options": { "raw": { "language": "json" } }
             },
             "url": {
               "raw": "{{baseUrl}}/product/:id",
               "host": ["{{baseUrl}}"],
               "path": ["product", ":id"]
             }
           }
         },
         {
           "name": "delete",
           "request": {
             "method": "DELETE",
             "url": {
               "raw": "{{baseUrl}}/product/:id",
               "host": ["{{baseUrl}}"],
               "path": ["product", ":id"]
             }
           }
         }
       ]
     },
     {
       "name": "order",
       "item": [
         {
           "name": "create",
           "request": {
             "method": "POST",
             "header": [
               {
                 "key": "Authorization",
                 "value": "Bearer <JWT_TOKEN>"
               }
             ],
             "body": {
               "mode": "raw",
               "raw": "{\n  \"items\": [\n    {\n      \"id\": \"PRODUCT_ID_1\",\n      \"quantity\": 2\n    },\n    {\n      \"id\": \"PRODUCT_ID_2\",\n      \"quantity\": 1\n    }\n  ]\n}",
               "options": { "raw": { "language": "json" } }
             },
             "url": {
               "raw": "{{baseUrl}}/order",
               "host": ["{{baseUrl}}"],
               "path": ["order"]
             }
           }
         }
       ]
     }
   ]
 }
]
}
