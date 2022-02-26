# Babyfoot Manager

Babyfoot Manager is a collaborative application for creating foosball games. Users can in real time create games to play by indicating the name of the participants as well as edit the games to enter the score.

## Prerequisites

npm or yarn

NodeJs

Postgresql


## Installation

1. Clone the repo

  By ssh 
  ```sh
  git clone git@github.com:BarbierAlexis/Babyfoot_Manager.git
  ```
  By HTTPS
  ```sh
  git clone https://github.com/BarbierAlexis/Babyfoot_Manager.git
  ```

2. Move to the project folder 
  ```sh
  cd Babyfoot_Manager
  ```
   
3. Install dependencies 
  ```sh
  yarn
  ```
  or
  ```sh
  npm install
  ```
   
4. Create a postgresql database for the project
 
5. Copy environement file
  ```sh
  cp .env.exemple .env
  ```
  Complete the .env file
  
6. Launch the database client
  ```sh
  yarn start
  ```
  or
  ```sh
  npm start
  ```
   
7. Init the database
  ```sh
  yarn db:init
  ```
  or
  ```sh
  npm db:init
  ```
## Start project 

  ```sh
  yarn start
  ```
  or
  ```sh
  npm start
  ```
You can access to the application by following the link in the console 🚀

Enjoy !

## Author
Alexis Barbier
