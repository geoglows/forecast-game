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

// variable to keep track of the current day
let currentDay = 10;

// this function helps the game progress and determines when the game is over
function nextDay(round) {
  // If the current day is greater than 1, go to the next day
  if (currentDay === 1) {// save the table to local storage as resultTable
    saveCheckboxTable();

    // Display a customized alert with a button to proceed to the results page
    let confirmation = confirm('GAME OVER! It appears your time has run out. Hit OK to see the results or ' +
      'Cancel to play again.');
    if (confirmation) {
      // Proceed to the results page
      window.location.href = 'results'+round+'.html';
      window.onload = function(){loadCheckboxTable()};
    } else {
      window.location.href = 'round'+ round +'.html';
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
      img.alt = 'Forecasted Streamflow for ' + currentDay + ' days before event';
      h1.textContent = 'Forecast Game: ' + currentDay + ' Days Before Predicted Flood Event';
      img.src = '/static/img/round'+ round +'/day_' + currentDay + '.png';

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
function calculateFinal() {
    calculateTotal( "resultTable");

}

// function for the calculator on the results1.html and results2.html pages
function calculator(){
    let costOfDamage = parseInt(document.getElementById("costOfDamage").textContent.replace(/\$/, ""));
    let benefitsOfProtection =  parseInt(document.getElementById("benefitsOfProtection").value) || 0;
    let costOfProtection = parseInt(document.getElementById("costOfProtection").textContent.replace(/\$/, "")) || 0;

    let netDamage = costOfDamage - benefitsOfProtection + costOfProtection
    document.getElementById("netCostOfDamage").textContent = "$" + netDamage.toLocaleString();
    console.log()
}
