# backend-stagetwo-online

- http://localhost:3000/auth/login
- http://localhost:3000/auth/register
- http://localhost:3000/auth/suppliers/register
- http://localhost:3000/auth/suppliers/login
- http://localhost:3000/auth/products/add
- http://localhost:3000/auth/products/update/:id

Fitur :
[1.]
- register & login = routes>auth.ts & controllers>auth.ts & services>auth.ts
- bcrypt = services>auth.ts
- jwt = utils>jwt.ts
- role = middlewares>auth.ts & routes>auth.ts

[2.]
- Create, read dan update products = controllers>auth.ts & utils>multerProducts.ts & routes>auth.ts
- Semua product = routes>auth.ts
- filtering, sorting dan pagination = 
