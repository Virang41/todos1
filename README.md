To-Do List App — Node.js, Express.js & MongoDB


 Tech Stack

 Layer       Technology                           Why I Used It                                                        
 
 Runtime     Node.js                             JavaScript on the server  
 Framework   Express.js                          Lightweight, easy to set up route                    
 Database    MongoDB (Atlas)                     NoSQL, use for storing tasks        
 ODM         Mongoose                            Makes easy to define schemas and interact with MongoDB           
 Frontend    React.js + Vite                     Component-based UI           
 Styling     TailwindCSS                         Utility-first CSS                   
 HTTP        Axios                               Promise-based HTTP client    



Project Structure


MERN-Todo/
│
├── client/                           Frontend (React + Vite)
│   ├── public/                       Static assets (favicon, images)
│   ├── src/
│   │   ├── App.jsx                   Root component
│   │   ├── ToDoList.jsx              Main todo list with form
│   │   ├── ListItem.jsx              Individual task rendering
│   │   ├── ListItemSkeleton.jsx      Loading skeleton UI
│   │   └── Tooltip.jsx               Reusable tooltip component
│   ├── index.html                    HTML entry point
│   ├── index.jsx                     React DOM render
│   ├── index.css                     Global styles + Tailwind
│   ├── vite.config.js                Vite configuration
│   ├── tailwind.config.js            Tailwind configuration
│   └── .env                          Frontend environment variables
│
├── server/                           Backend (Node.js + Express)
│   ├── controllers/
│   │   └── todoController.js         All CRUD logic lives here
│   ├── models/
│   │   └── todoModel.js              Mongoose schema for tasks
│   ├── routes/
│   │   └── todoRoutes.js             API route definitions
│   ├── index.js                      Server entry point
│   ├── .env                          Backend environment variables
│   ├── .gitignore                    Files to exclude from git
│   └── vercel.json                   Vercel deployment config
│
└── README.md                         This file



Projeect Setting

Condtions

Before start so first install this dependencies and language our machine.

- Node.js (v16 or above) 
- npm (come with Node.js)
- MongoDB Atlas account** — [Sign up here](https://www.mongodb.com/atlas) (or you can use a local MongoDB instance)
- Git — 

Step 1: Clone the Repository

git clone <your-github-repo-url>



Step 2: Set Up Environment Variables

You need to create `.env` files in both the `server` and `client` directories.

Server `.env` file (`server/.env`):

```
MONGODB_ATLAS_CONNECTION = your_mongodb_connection_string_here
PORT = 5000
```

Replace `your_mongodb_connection_string_here` with your actual MongoDB Atlas connection string. You can get this from your MongoDB Atlas dashboard under **Connect > Drivers > Node.js**.

Client `.env` file (`client/.env`):


VITE_API_BASE_URL = http://localhost:5000/api


Step 3: Install Dependencies

Open two terminal windows.

Terminal 1 — Install server dependencies:

cd server
npm install
```

Terminal 2 — Install client dependencies:

cd client
npm install


Step 4: Run the Application

Start the backend server:

cd server
npm run dev


You should see:

 Server is running on port 5000
 DB Connected Successfully


Start the frontend:


cd client
npm run dev


The app is live in `http://localhost:3000` and the API server is running `http://localhost:5000`.



2. Configuring MongoDB

I used MongoDB Atlas for this project. let start set-up

1. Created a free-tier cluster on MongoDB Atlas.
2. Set up a database user with a username and password.
3. Whitelisted my IP address (or used `0.0.0.0/0` for development so any IP can connect).
4. the connection string from the Atlas dashboard and pasted it into my `server/.env` file.

The connection string looks something like this:

mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0


Mongoose handles the actual connection in `index.js`:

javascript
const source = process.env.MONGODB_ATLAS_CONNECTION;

mongoose
  .connect(source)
  .then(() => console.log("✅ DB Connected Successfully"))
  .catch((error) => console.log(error));




3. API Implementation

Controller-Service-Routes Structure

I followed best methos to code clean and maintainable:

- Routes  — Define which URL path maps to which controller function. 
- Controllers  — Handle the actual logic- 
- Models  — the shape of the data using Mongoose schemas.


 Mongoose Schema (Model)


javascript
const todoSchema = new mongoose.Schema(
  {
    task: { type: String, required: true },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
```


 API Endpoints

 all four API endpoints I implemented:

---

 1. Create a Task

POST `/api/new`

Creates a new to-do item.

Request Body:
json
{
  "task": "Complete the assignment"
}


**Success Response (201):**
```json
{
  "message": "Task created successfully.",
  "newList": {
    "_id": "65f...",
    "task": "Complete the assignment",
    "isCompleted": false,
    "createdAt": "2026-02-16T...",
    "updatedAt": "2026-02-16T..."
  }
}
```

Error Response (400):
```json
{
  "errorMessage": "Task is not valid."
}
```

---

 2. Get All Tasks

GET `/api/get`

Fetches every task from the database.

Success Response (200):
```json
[
  {
    "_id": "65f...",
    "task": "Complete the assignment",
    "isCompleted": false,
    "createdAt": "2026-02-16T...",
    "updatedAt": "2026-02-16T..."
  }
]
```

---

 3. Update a Task

PUT `/api/update/:id`

Updates an existing task by its `_id`. You can update the task text, the completion status, or both.

Request Body :
json
{
  "isCompleted": true
}


Success Response (200):
```json
{
  "message": "Task updated successfully.",
  "updated": {
    "_id": "65f...",
    "task": "Complete the assignment",
    "isCompleted": true,
    "createdAt": "2026-02-16T...",
    "updatedAt": "2026-02-16T..."
  }
}
```

Error Response (404):
```json
{
  "errorMessage": "Task not found."
}
```

---

 4. Delete a Task

DELETE `/api/delete/:id`

Removes a task from the database permanently.

Success Response (200):
```json
{
  "message": "Task deleted successfully.",
  "deleted": {
    "_id": "65f...",
    "task": "Complete the assignment",
    "isCompleted": false,
    "createdAt": "2026-02-16T...",
    "updatedAt": "2026-02-16T..."
  }
}
```

Error Response (404):
json
{
  "errorMessage": "Task not found."
}


5. Error Handling and Validation

  1.  Input Validation

- Create Task: Before saving, user is create new task for user api and input validation in ths todo list app.
javascript
if (!task || typeof task !== "string") {
  return res.status(400).json({ errorMessage: "Task is not valid." });
}


- Update Task: Mongoose's `runValidators: true` option during updates,  So you can't update a task with invalid data.

 Error Responses

Every controller is wrapped in a `try-catch` block. If something unexpected happens (like the database going down), the API returns a `500 Internal Server Error` with the actual error message:

javascript
catch (err) {
  res.status(500).json({ errorMessage: err.message });
}


this operatin is specified to delete and update task and result is null. — which means no task was found with that ID — and return a `404 Not Found`:

javascript
if (!deleted) {
  return res.status(404).json({ errorMessage: "Task not found." });
}

HTTP Status Codes Used

 Code  Meaning                 When It's Used                             

 200 -  OK                    - Successful GET, PUT, DELETE               
 201 -  Created               - Successful POST (create new task)        
 400 -  Bad Request           - Invalid or missing input                  
 404 -  Not Found             - Task ID doesn't exist in the database     
 500 -  Internal Server Error - Unexpected server-side errors             



6.  Testing with Postman

i use postman for reason is connect a api endpoint for fronted

1. Open Postman and server is running in npm to dev

2. Create a Task:
   - Method: `POST`
   - URL: `http://localhost:5000/api/new`
   - Body → raw → JSON:
     json
     { "task": "Buy groceries" }
     

3. Get All Tasks:
   - Method: `GET`
   - URL: `http://localhost:5000/api/get`

4. Update a Task:
   - Method: `PUT`
   - URL: `http://localhost:5000/api/update/<paste_task_id_here>`
   - Body → raw → JSON:
     json
     { "task": "Buy groceries and fruits", "isCompleted": true }
     

5. Delete a Task:
   - Method: `DELETE`
   - URL: `http://localhost:5000/api/delete/<paste_task_id_here>`

Each request should return the appropriate JSON response with the correct status code.


=> Challenges I Faced

1. CORS Issues

CORS (Cross-Origin Resource Sharing) Issues Explain - this is brouser security feature and use case is origin middle block for react and node.js

javascript
const cors = require("cors");
app.use(cors());



 2. Environment Variable Management

there are three key feature in variable management. and our website file manage two method 1. dotenv 2. dotenv-flow
this three feature is 1. multiple-files 2. auto-load 3. Dev vs prod separation.
1. multiple-files - dotenv single and dotenv-flow - environment-wise
2. auto-load - dotenv manual set file in system and dotenv-flow  NODE_ENV pramane style adjust file
3. Dev vs prod separation - dotenv system file manage is very difficult but dotenv-flow is easy for file manage.

 3. Handling Invalid MongoDB ObjectIDs
Invalid MongoDB Objectid example - vk123 is facing cast error and try to catch this server but better to validation middleware.
- first check our id is valid in 24-character
- 400 bad request return
- send clear message to ID format is invalid.
- and save database call.


 4. Missing `nodemon` Dependency
  nodemon development tool is change code automatically detect and restart server and this nodemon install in dependency -D other wise install package.json reference.
- npm run dev is working
- dependency working fast ( and not manual restart requirement)
- production deploy not include unused packages


 5. Frontend Loading States
use loading status to UI is not freeze and there are 3 main component 1. skeleton loader 2. button loading states and 3. optimistic UI
1. data fetch time just seen to skeleton effect and load page to list is fetch and benefit is screen is not seen blank and user info to load data.
2. button click after show processing. use is add,update and delete and benefit is duplicate data is not create.
3. APi request is not show that first immediate feedback. delete this task gray and create this task show in immediate list and benefit is app is working very fast and better user experience for user.

 Asynchronous Programming

Every database operation in the controllers uses `async/await` instead of `.then()` chains.  For example:

javascript
exports.getTask = async (req, res) => {
  try {
    const allTask = await Todo.find();
    res.status(200).json(allTask);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};


The frontend also uses `async/await` with Axios for all API calls, wrapped in try-catch-finally blocks to handle errors and manage loading states properly.


 Environment Variables

 Variable                     File           Description                                        

 MONGODB_ATLAS_CONNECTION  -  server/.env - MongoDB Atlas connection string                    
 PORT                      -  server/.env - Port number for the backend server (default: 5000) 
 VITE_API_BASE_URL         -  client/.env - Base URL for the backend API                       



=> How to Submit

1. Push the entire codebase to your GitHub repository:
  
   git add .
   git commit -m To-Do List API add Node.js, Express.js, and MongoDB
   git push origin main
 

2. Make sure your repository includes:
   - Server entry point (server/index.js)
   - Route files (`server/routes/todoRoutes.js)
   - Controller files (server/controllers/todoController.js)
   - Model files (server/models/todoModel.js)
   - This is README.md with setup instructions and environment variable details
  

3. Submit your GitHub repository link in the provided Google Form.


