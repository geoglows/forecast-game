// Author: Thomas Roden

// function that saves the table to local storage
function saveCheckboxTable() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const checkboxIds = Array.from(checkboxes).map(cb => cb.id);
  localStorage.setItem('checkedCheckboxIds', JSON.stringify(checkboxIds));
}

// function that loads and displays the table from local storage
function loadCheckboxTable() {
  const checkboxIds = JSON.parse(localStorage.getItem('checkedCheckboxIds'));
  if (!checkboxIds || !Array.isArray(checkboxIds)) {
    return; // No checkbox IDs found in storage or invalid format
  }

  checkboxIds.forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
  handleCheckboxSelections();
  calculateFinal();
  document.getElementById("costOfProtection").textContent = document.getElementById("overallTotal").textContent;
}

// Function that starts the game
function startGame() {
  let startGameButton = document.querySelector('button:first-of-type');
// go to Game.html on click
  startGameButton.addEventListener('click', function() {
    window.location.href = '../Game.html';
  });

}

// variable to keep track of the current day
let currentDay = 10;

// this function helps the game progress and determines when the game is over
function nextDay() {
  // If the current day is greater than 1, go to the next day
  if (currentDay === 1) {// save the table to local storage as resultTable
    saveCheckboxTable();

    // Display a customized alert with a button to proceed to the results page
    let confirmation = confirm('Game Over! It appears your time has run out. Hit OK to see the results or ' +
      'Cancel to play again.');
    if (confirmation) {
      // Proceed to the results page
      window.location.href = 'Results.html';
      window.onload = function(){loadCheckboxTable()};
    } else {
      window.location.href = 'Game.html';
    }
  } else {
    // lock the checkboxes that have already been checked
      const table = document.getElementById('checkboxTable');
      const checkboxes = table.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((cb) => {
          if (cb.checked) {
              cb.disabled = true;
          }
      });

      // Update the image and title
      let img = document.querySelector('img');
      let h1 = document.querySelector('h1');
      currentDay--;
      localStorage.setItem('currentDay', currentDay);
      img.src = 'js/day_' + currentDay + '.png';
      img.alt = 'Forecasted Streamflow for ' + currentDay + ' days before event';
      h1.textContent = 'Serious Game: ' + currentDay + ' Days Before Predicted Flood Event';

      calculateTotal("checkboxTable");
      handleCheckboxSelections();
  }
}

// this function calculates the amount of money spent on each action and the total amount spent
function calculateTotal(tables) {
    const table = document.getElementById(tables);
    const checkboxes = table.getElementsByTagName("input");

    let rowTotals = Array.from(Array(4), () => 0);
    let overallTotal = 0;

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        const value = parseInt(checkboxes[i].value);
        const rowIndex = checkboxes[i].closest("tr").rowIndex - 1;
        // const columnIndex = checkboxes[i].closest("td").cellIndex - 1;

        rowTotals[rowIndex] += value;
        overallTotal += value;

        checkboxes[i].disabled = true;
      }
    }

  // Display row totals and overall total
    const rowTotalCells = document.querySelectorAll('[id^="row"]');
    for (let i = 0; i < rowTotals.length; i++) {
      rowTotalCells[i].textContent = "$" + rowTotals[i];
    }
    document.getElementById("overallTotal").textContent = "$" + overallTotal;
  }

// this function handles the selection of checkboxes
function handleCheckboxSelections() {
          const actionsToTake = ["P", "S", "A", "E"]
        actionsToTake.forEach(a => {
            const elementsForAction = document.querySelectorAll('input[type="checkbox"][id$="' + a + '"]')
            const actionHasBeenChecked = Array.from(elementsForAction).map(x => x.checked).reduce((x, y) => x || y)
            elementsForAction.forEach(cb => {
                cb.disabled = (actionHasBeenChecked && !cb.checked) || (cb.id.split("-")[0] > currentDay)
            })
        })
}

// function for final calculations on Result.html page
function calculateFinal(floodlevel) {
    calculateTotal( "resultTable");
      // Get the checked checkboxes in resultTable
      if (floodlevel === "100yr"){
      const checkboxes = document.querySelectorAll('#resultTable input[type="checkbox"]:checked');
      let damageCost = 81397990;
      let dCost = 81397990;
      let P100yr = 14000000;
      let S100yr = 13000000;
      let A100yr = 12000000;
      let E100yr = 20000000;
      let ProtectionCost = 0;
      document.getElementById("costOfDamage").textContent = "$" + dCost;
      checkboxes.forEach((checkbox) => {
        const checkboxId = checkbox.id;
        const letter = checkboxId.split('-')[1]; // Extract the letter from the checkbox ID
        switch (letter) {
          case 'P':
            ProtectionCost += P100yr;
            break;
          case 'S':
            ProtectionCost += S100yr;
            break;
          case 'A':
            ProtectionCost += A100yr;
            break;
          case 'E':
            ProtectionCost += E100yr;
            break;
          default:
            break;
        }
      });
      damageCost = damageCost - ProtectionCost;
        // displays the calculated damage cost in netDamageCost and ProtectionCost in calculator
        document.getElementById("netDamageCost").textContent = "$" + damageCost;
        document.getElementById("benefitsOfProtection").textContent = "$" + ProtectionCost;
    } else if (floodlevel === "25yr"){
      const checkboxes = document.querySelectorAll('#resultTable input[type="checkbox"]:checked');
      let damageCost = 48504460;
      let dCost = 48504460;
      let P25yr = 7000000;
      let S25yr = 6500000;
      let A25yr = 6000000;
      let E25yr = 10000000;
      let ProtectionCost = 0;
      document.getElementById("costOfDamage").textContent = "$" + dCost;
      checkboxes.forEach((checkbox) => {
        const checkboxId = checkbox.id;
        const letter = checkboxId.split('-')[1]; // Extract the letter from the checkbox ID
        switch (letter) {
          case 'P':
            ProtectionCost += P25yr;
            break;
          case 'S':
            ProtectionCost += S25yr;
            break;
          case 'A':
            ProtectionCost += A25yr;
            break;
          case 'E':
            ProtectionCost += E25yr;
            break;
          default:
            break;
        }
      });
      damageCost = damageCost - ProtectionCost;
        // displays the calculated damage cost in netDamageCost
        document.getElementById("netDamageCost").textContent = "$" + damageCost;
        document.getElementById("benefitsOfProtection").textContent = "$" + ProtectionCost;
    } else if (floodlevel === "2yr"){
        let damageCost = 244520;
        // displays the calculated damage cost in netDamageCost
        document.getElementById("netDamageCost").textContent = "$" + damageCost;
        document.getElementById("costOfDamage").textContent = "$" + damageCost;
        document.getElementById("benefitsOfProtection").textContent = "$" + 0;
    }
}

// function for the calculator on the Results.html page
function calculator(){
         let netDamage = document.getElementById("costOfDamage").value - document.getElementById("benefitsOfProtection").value;
            document.getElementById("netCostOfDamage").textContent = "$" + netDamage;
    }
