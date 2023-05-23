// Author: Thomas Roden

// Function that starts the game
function startGame() {
  let startGameButton = document.querySelector('button:first-of-type');
// go to Game.html on click
  startGameButton.addEventListener('click', function() {
    window.location.href = 'js/Game.html';
  });

}

// Functions that will make the webpage operational
function calculate() {
  // Get the budget from the previous day's calculation
  let budget = parseInt(document.querySelector('p:first-of-type').textContent.split('$')[1]);

  // Calculate the sum based on the checked checkboxes
  let sum = budget;
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach(function(checkbox) {
    sum -= parseFloat(checkbox.value);
  });

  // Display the result
  document.getElementById("result").innerHTML = sum;

  // Enable the Next Day button
  const nextDayButton = document.querySelector('button:last-of-type');
  nextDayButton.disabled = false;
}

// variable to keep track of the current day
let currentDay = 1;

// Function to reset the form, and makes the result the starting number
function nextDay() {
  // Reset the checkboxes
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }

  // if budget is greater than 0, go to the next day
  let budget = parseInt(document.querySelector('#result').textContent);
  if (budget > 0) {
    // Get the selected options for the day
    let selectedOptions = [];
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        selectedOptions.push({
          option: checkbox.parentElement.textContent.trim(),
          cost: parseInt(checkbox.value)
        });
      }
    });

    // Save the selected options and their costs to local storage
    let currentDay = parseInt(localStorage.getItem('currentDay')) || 1;
    localStorage.setItem('day' + currentDay, JSON.stringify(selectedOptions));
    localStorage.setItem('day' + currentDay + '_cost', selectedOptions.reduce(function(total, option) {
      return total + option.cost;
    }, 0));

    // Update the image and title
    let img = document.querySelector('img');
    let h1 = document.querySelector('h1');
    currentDay++;
    localStorage.setItem('currentDay', currentDay);
    img.src = './day' + currentDay + '.png';
    img.alt = 'Forecasted Streamflow for day ' + currentDay;
    h1.textContent = 'Serious Game: Day ' + currentDay;

    // Update the budget for the next day
    let budgetParagraph = document.querySelector('p:first-of-type');
    budgetParagraph.textContent = 'Budget: $' + budget;

    // Clear the previous day's result
    document.querySelector('#result').textContent = '';

  } else {
    // Display a customized alert with a button to proceed to the results page
    let confirmation = confirm('Game Over! It appears your budget has run out. Would you like to see the results?');

    if (confirmation) {
      // Proceed to the results page
      window.location.href = 'Results.html';
      displayResults();
    }
  }
}

// Function to display the results of the game
function displayResults() {
  // retrieve from local storage the number of days played and the total cost and display in a table
  let totalDays = parseInt(localStorage.getItem('currentDay')) - 1;
  let totalCost = 0;
  let table = document.getElementById('resultsTable'); // Get the table element by ID

  for (let i = 1; i <= totalDays; i++) {
    let row = document.createElement('tr');
    let day = document.createElement('td');
    day.textContent = 'Day ' + i;
    row.appendChild(day);

    let cost = document.createElement('td');
    cost.textContent = '$' + localStorage.getItem('day' + i + '_cost');
    totalCost += parseInt(localStorage.getItem('day' + i + '_cost'));
    row.appendChild(cost);

    table.appendChild(row);
  }

  // Update the total cost in the HTML
  let totalCostParagraph = document.querySelector('p:nth-of-type(1)');
  totalCostParagraph.textContent = 'You spent in total: $' + totalCost;
  let totalSavedParagraph = document.querySelector('p:nth-of-type(2)');
  totalSavedParagraph.textContent = 'You saved in total: $' + (120 - totalCost); // Assuming the starting budget is $100
}
