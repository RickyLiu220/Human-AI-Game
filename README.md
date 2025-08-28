# Human-AI-Game
# Motivation
In the past, there was this game called Human or Not: A Social Turing game. In this game, the user got to either speak with a real human or an LLM. However, there were often times where the player would send a message and the other side would never respond. This essentially made the game a guessing game most of the time (since you would have 0 information about the opposing side).

To solve this issue, I decided to remove the game's dependence on requiring another person who often would not talk. Instead, I use pre-generated prompts for the player to choose from. 
# Implementation
In this game, I wanted players to have something to work towards. To accomplish this, I decided to save each player's high score. This meant that I would require a system where the player could make an account an subsequently I would be able to store that high score stat with his account. For this, I used SQLite for the database and created a backend that would respond to API calls for creating accounts, logging in, and updating high scores. 

Along with this backend, I created a front end with HTML and CSS with a theme that is inspired by the original game. 
