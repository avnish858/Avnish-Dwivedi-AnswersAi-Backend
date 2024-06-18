# Node.js AnswerAi Application

This is a Node.js application written in TypeScript. The application uses environment variables for configuration and can be containerized using Docker.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Docker](#docker)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.x)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (if using Docker)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/avnish858/Avnish-Dwivedi-AnswersAi-Backend.git
   cd Avnish-Dwivedi-AnswersAi-Backend

2. Install dependencies:

  ```bash
  npm install
  ```
3. Create a .env file in the root directory and add your environment variables. For example:
   
   ```
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=root
    DB_DATABASE=avnish
    ANTHROPIC_API_KEY=your-api-key
   
   ```
4. To start the application, run:

  ```bash
  npm run start

  ```

## Docker
### Dockerfile

Here's an example of a Dockerfile for this application:

```
FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

```

To build the Docker image, run:

```bash
docker build -t answerai .

```

To run the Docker container, use:

```bash
docker run -p 3000:3000 --env-file .env answerai

```
### DB Schema Explanation

```
CREATE TABLE users (
id int PRIMARY KEY,
username VARCHAR(100) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
id VARCHAR(36) PRIMARY KEY,
user_id int NOT NULL,
content TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

```

schema consists of two tables: users and questions.

#### users Table
- id: An integer that serves as the primary key.
- username: A string (VARCHAR) with a maximum length of 100 characters that cannot be null.
- email: A string (VARCHAR) with a maximum length of 255 characters that is unique and cannot be null.
- password: A string (VARCHAR) with a maximum length of 255 characters that cannot be null.
- created_at: A timestamp that defaults to the current timestamp when the record is created.

#### questions Table
- id: A string (VARCHAR) with a maximum length of 36 characters that serves as the primary key. This is typically used to store id.
- user_id: An integer that cannot be null and serves as a foreign key referencing the id in the users table.
- content: A text field that cannot be null.
- created_at: A timestamp that defaults to the current timestamp when the record is created.
- The user_id foreign key ensures referential integrity by linking each question to a specific user. If a user is deleted,    all their associated questions will also be deleted (ON DELETE CASCADE).

