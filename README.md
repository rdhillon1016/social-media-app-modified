# social-media-app

### Description
This project demonstrates the development of a modern web application that utilizes a RESTful API to provide efficient communication between the server and client applications. The application is dockerized, making it easy to deploy and portable across different environments. Hosted on Google Cloud, it offers scalability and reliability to ensure seamless user experience.

The use of JSON Web Tokens (JWT) for authentication ensures secure access to the API, allowing only authorized users to access specific parts of the application. MongoDB provides a flexible and scalable NoSQL database solution for storing user data and posts.

The application features a range of user-friendly functions such as creating and viewing posts, accessing friends' posts, and updating the user's profile picture, username, and bio. These functions enhance the user experience and provide greater flexibility and control.

Overall, this project is a testament to the power of modern web development technologies and best practices, creating a robust and feature-rich application that meets the needs of today's users.

### Technologies 
This project showcases the development of a high-performance RESTful API using **Node.js** and **ExpressJS**. The framework is lightweight and has a large community behind it, making it a popular choice for building web applications. **MongoDB** was chosen to store user data due to its flexibility and scalability. PassportJS with JWT Strategy was implemented for authentication, ensuring that user data is secure and confidential.

**Jest**, a popular testing framework for JavaScript, was used to test the API, ensuring its robustness and reliability.

On the frontend, **ReactJS**, the most popular frontend library, was used to create a smooth, interactive user interface. **CSS** was used for styling the application, ensuring a sleek and modern appearance. **Tan-Stack React Query** was utilized for fetch requests and caching, which provides a powerful and simple caching solution for ReactJS applications.

For deployment infrastructure, AWS ECS was used to host the backend behind an Application Load Balancer listening for HTTPS requests using a self-signed certificate (for testing purposes). Amplify was used to deploy the frontend. All of this was provisioned using Terraform.

### Dev notes

To run the frontend development server + backend API + MongoDB locally, you have two options:

Run the docker-compose:
`docker-compose -f docker-compose-dev.yml up`

Or you can run the frontend dev server + backend server outside of a container, and run mongo inside one:

#### Start mongo (equipped with initial data)

`cd mongo-test`

`docker build . -t mymongo`

`docker run -p 27017:27017 mymongo`

#### Start API with live reload

`cd api`

`DB_NAME=test MONGO_URI=mongodb://localhost:27017 FE_URL=http://localhost:3000 SECRET=something GOOGLE_CLIENT_ID=something GOOGLE_SECRET=something npm run serverstart`

#### Start frontend server with live reload

`cd frontend`

`REACT_APP_API_URL=http://localhost:3002/ npm start`
