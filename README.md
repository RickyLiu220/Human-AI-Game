# Human-AI-Game
# Motivation
In the past, there was this game called Human or Not: A Social Turing game. In this game, the user got to either speak with a real human or an LLM. However, there were often times where the player would send a message and the other side would never respond. This essentially made the game a guessing game most of the time (since you would have 0 information about the opposing side).

To solve this issue, I decided to remove the game's dependence on requiring another person who often would not talk. Instead, I use pre-generated prompts for the player to choose from. 
# Implementation
In this game, I wanted players to have something to work towards. To accomplish this, I decided to save each player's high score. This meant that I would require a system where the player could make an account and subsequently store their high score.

For the backend, I used Node.js to create an API that handles account creation, login, and updating high scores. The database is powered by SQLite, which stores all user information and high scores.

Along with this backend, I created a frontend with HTML and CSS, inspired by the original game’s theme. The frontend communicates with the Node.js API to provide a seamless and interactive experience for players.

# Key Technologies

*Backend: Node.js, Express.js
*Database: SQLite
*Frontend: HTML, CSS
