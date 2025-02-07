# Tackle Trivia - Quiz Game Rugby

## Description
**Tackle Trivia** is an interactive web platform focused on Rugby-themed quizzes. Its goal is to provide an educational and entertaining experience, allowing users to test their knowledge, compete in rankings, and learn more about the sport. The system includes secure authentication, user management, a database to store quizzes and scores, and a multilingual interface (Portuguese and English).

## Main Objective
To create a gamified learning environment that encourages interaction among Rugby fans through challenging quizzes and a competitive ranking system.

## Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js with Express.js
- **Database:** MySQL
- **Authentication & Security:** bcrypt for password hashing, JWT for authentication
- **Hosting & Deployment:** Microsoft Azure

## Features
- **Secure Registration & Login:** Users can create accounts and authenticate securely.
- **Thematic Quizzes:** Questions about Rugby history, players, and events, with instant feedback.
- **Ranking System:** Stores scores and allows comparison with other players.
- **Password Reset & Change:** Verification via email.
- **Language Switching:** Support for Portuguese and English.
- **Light/Dark Mode:** Interface customization for a better user experience.

## Requirements
Before running the project, ensure you have installed:
- **Node.js** (version 16 or later)
- **MySQL**
- **Git**

## Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/afonseca00/quiz-game-rugby.git
   ```
2. Navigate to the project directory:
   ```sh
   cd quiz-game-rugby
   ```
3. Install backend dependencies:
   ```sh
   npm install
   ```
4. Configure environment variables (create a `.env` file and fill in the required credentials):
   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   ```
5. Start the server:
   ```sh
   npm start
   ```

## Usage
- Access `http://localhost:3000` to interact with the application.
- Use tools like Postman to test the available APIs.

## Project Structure
```
quiz-game-rugby/
│── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│── tests/
│── config/
│── package.json
│── README.md
```

## Testing
If there are automated tests, run them using the following command:
```sh
npm test
```

## Contribution
1. Fork the repository
2. Create a branch for your feature/bug fix:
   ```sh
   git checkout -b my-feature
   ```
3. Commit your changes:
   ```sh
   git commit -m "Feature description"
   ```
4. Push to the remote repository:
   ```sh
   git push origin my-feature
   ```
5. Open a Pull Request

## License
This project is licensed under the **MIT** License. See the `LICENSE` file for more details.

---
Developed by Alexandre Rodrigues 🚀
