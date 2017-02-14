# Node.js API
Basically an API RESTful made with Node.js and Express. 
The database run with MongoDB with the popular ODM Mongoose.

Features are :

- User CRUD and authentification
- API documentation available as a HTML page
- Multilingual

Generate the documentation (Linux CLI):

apidoc -i routes/ -o apidoc/ && see apidoc/index.html OR npm run doc

Run the project : 

npm install && npm start