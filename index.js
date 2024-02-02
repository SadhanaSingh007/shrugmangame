import chalk from "chalk";
import promptSync from "prompt-sync";
const prompt = promptSync();

class Shrugman {
  constructor() {
    this.games = [];
    this.playRound();
  }

  playRound() {
    // Clear the console and display the welcome message
    console.clear();
    console.log(chalk.bold.cyan("Welcome to Shrugman - The Guessing Game!\n"));

    // Define available categories
    const categories = ["movies", "books"];

    // Select a category to play
    const selectedCategory = this.chooseCategory(categories);

    // Check if the player chose to exit
    if (!selectedCategory) {
      console.log(chalk.bold.cyan("Exiting the game."));
      this.displayGameResults(this.games);
      return;
    }

    // Get a random word from the selected category
    const word = this.getRandomWord(selectedCategory);
    const attempts = 12; // Maximum attempts allowed
    const guesses = [];
    let maskedWord = this.maskWord(word);
    let remainingAttempts = attempts;
    const attemptedLetters = [];

     console.clear();

    // Main game loop
    while (remainingAttempts > 0) {
      // Display game information
      console.log(
        `Category: ${
          selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
        }`
      );
      console.log(
        `Attempts remaining: ${remainingAttempts}\n\n${maskedWord}\n`
      );
      console.log(
        chalk.bold.magenta(
          `\n${"¯\\_(:/)_/¯".slice(
            0,
            attempts - remainingAttempts
          )} \n (Attempts left: ${remainingAttempts}/${attempts})\n`
        )
      );

      console.log(
        chalk.cyan(`Attempted Letters: ${attemptedLetters.join(", ")}`)
      );

      // Get user input for guessing a letter
      const guess = this.getUserInput("Guess a letter: ").toLowerCase();

      // Check if the guessed letter has already been attempted
      if (attemptedLetters.includes(guess)) {
        console.log(chalk.red("You already guessed that letter. Try again."));
        continue; // Continue the loop if the letter has already been guessed
      }

      // Clear the console for a cleaner display
      console.clear();

      // Validate the guess
      if (guess.length === 1 && guess.match(/[a-z]/)) {
        guesses.push(guess);

        attemptedLetters.push(guess);

        // Check if the guessed letter is in the word
        if (!word.includes(guess)) {
          remainingAttempts--; // Decrease attempts on a wrong guess
        } else {
          maskedWord = this.updateMaskedWord(word, maskedWord, guess);
        }
      } else {
        console.log(chalk.red("Invalid guess. Please enter a single letter."));
      }

      // Check if the word is fully guessed
      if (!maskedWord.includes("_")) {
        // Display winning message and record the game result
        console.clear();
        console.log(`Congratulations, you won! The word was: ${word}`);
        this.games.push({
          category: selectedCategory,
          result: "win",
          attempts: attempts - remainingAttempts,
          attemptedLetters,
        });
        break; // Exit the loop if the word is guessed
      }
    }

    // Game over, display the result
    if (remainingAttempts === 0) {
      console.clear();
      console.log(`Better luck next time. The word was: ${word}`);
      this.games.push({
        category: selectedCategory,
        result: "loss",
        attempts: attempts - remainingAttempts,
        attemptedLetters,
      });
    }

    // Ask if the player wants to play again
    if (this.playAgain()) {
      this.playRound(); // Restart the game
    } else {
      this.displayGameResults(this.games); // Display game results if not playing again
    }
    console.clear(); // Clear the console at the end of the game
  }

  // Choose the category to play
  chooseCategory(categories) {
    while (true) {
      console.log("Choose a category to play (or enter 'exit' to quit):");
      categories.forEach((category) => console.log(category));

      const input = this.getUserInput(
        "Enter the name of your choice: "
      ).toLowerCase();

      // Check if the player wants to exit
      if (input === "exit") {
        return null;
      }

      // Validate the chosen category
      if (categories.includes(input)) {
        return input;
      }

      // If the input is not 'exit' and not a valid category, display an error message
      console.log(
        chalk.red(
          "Invalid category. Please enter a valid category or 'exit' to quit."
        )
      );
    }
  }

  // Get a random word from the specified category
  getRandomWord(category) {
    const words = {
      movies: ["inception", "titanic", "avatar", "interstellar", "jaws"],
      books: ["harrypotter", "lordoftherings", "twilight", "gatsby"],
    };

    return words[category][Math.floor(Math.random() * words[category].length)];
  }

  // Create a masked version of the word
  maskWord(word) {
    return word
      .split("")
      .map((char) => (char !== " " ? "_" : " "))
      .join("");
  }

  // Update the masked word with the correctly guessed letter
  updateMaskedWord(word, maskedWord, guess) {
    return word
      .split("")
      .map((char, index) => (char === guess ? guess : maskedWord[index]))
      .join("");
  }

  // Get user input with the specified prompt
  getUserInput(promptText) {
    return prompt(promptText);
  }

  // Check if the player wants to play again
  playAgain() {
    return (
      this.getUserInput(
        "Play again with the same category (y/n)? "
      ).toLowerCase() === "y"
    );
  }

  // Display the results of all played games
  displayGameResults(games) {
    // Clear the console to provide a clean display
    console.clear();

    // Display a bold cyan header for the game results
    console.log(chalk.bold.cyan("Game Results:\n"));

    // Iterate through each game in the provided array
    games.forEach((game, index) => {
      // Determine the result text based on whether the game was a win or loss
      const resultText = game.result === "win" ? "win" : "loss";

      // Display information about each game, including category, result, and attempts
      console.log(
        `${index + 1}. ${game.category} - ${resultText} - Attempts: ${
          game.attempts
        }`
      );

      // Display the attempted letters for the corresponding game
      console.log(`Attempted Letters: ${game.attemptedLetters.join(", ")}`);
    });
  }
}

// Start the game by creating an instance of Shrugman
const game = new Shrugman();
