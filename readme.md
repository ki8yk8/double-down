# Game Preview
<img width="1366" height="694" alt="image" src="https://github.com/user-attachments/assets/ec903efb-ee30-4c32-bb35-a3395bdfba37" />

- Demo available at [https://double-down-one.vercel.app/](https://double-down-one.vercel.app/)

# About the Game
1. User gets 8 coin initially.
2. The goal is to earn 10 coins or more to enter into the real game of typing. 
3. The one with highest score in typing game shows at up at leaderboard. Show your skills to stay at the top.

## How to earn coins?


https://github.com/user-attachments/assets/d02d118f-3c43-4b5f-a6a9-5a64ce2d8207


1. Play Tic-Tac-Toe (1 coin to enter), you win get 3 coins and you lose you get nothing.


https://github.com/user-attachments/assets/a6ceb98a-ccbd-4eb7-87ab-ce14cb45bce8


   
2. Range Game, select a range between one and hundred then, a random number is generated between 1 and 100;
- If the random number doesn't falls in the given range, you lose everything.
- If the random number falls in the given range, your coins get multipled.
- The multiplication factor is inversely proportional to the interval of your range.

## What happens at typing game?


https://github.com/user-attachments/assets/3d36f6ef-df35-45fa-a1f4-a6ca34b58978


1. Type a given paragraph. Every one gets the same. 
2. Score is computed based on your WPM and accuracy.
3. The more you have coin, the more multiplier you can buy and increase your score.

# Everything is about COIN here 💰💸

# Some tricks I have used
## To prevent bot always winning in TicTacToe
There is use of probability in every move suchh that bot sometime make mistakes and there is randomness in the game.
- If bot wins in next move, then only 90% of the time the bot plays the winning move,
- If user is going to win on next move, bot blocks it 75% of the time,
- Bot tries to go with center piece only 20% of the time,
- Similarly, corner pieces are favored 30% of the time.

This also prevents high draws and let user win occasionally.

# Tools Used
1. React JS
2. For sliders I used `react-siders` by Airbnb.
