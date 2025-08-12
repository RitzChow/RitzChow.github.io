let result_data;
let sortedCompetitions;
let competition_type_to_color = {
  "FinalAnswer": "#003af7", 
  "TextProofs": "#00cef7", 
  "Math+Code": "#6300f7",
}
// Convert the fetch into an async function and wait for the data

// Call the async function to start the process
fetchResultData();

async function fetchResultData() {
  try {
    const response = await fetch("https://physarena-backend.onrender.com/results");
    data = await response.json();
	all_result_data = data["results"];
	competition_info = data["competition_info"];
	const secondary_response = await fetch("https://physarena-backend.onrender.com/secondary");
    secondary_data = await secondary_response.json();

	const competition_dates_response = await fetch("https://physarena-backend.onrender.com/competition_dates");
	competition_dates = await competition_dates_response.json();

	// sort competitions by competitions_info[competition].index
	sortedCompetitions = Object.keys(all_result_data).sort((a, b) => competition_info[a].index - competition_info[b].index);
    // Create competition tabs
    createCompetitionTabs();
    
    // Initialize first competition by default
    //const firstCompetition = Object.keys(all_result_data)[0];
    //selectCompetition(firstCompetition);
  } catch (error) {
    console.error('Error fetching results:', error);
  }
}

function addWarning(time_data) {
	for (var key in time_data) {
		if (time_data[key]) {
			if (!$("#warning-contamination-table").text().includes("Model was published after the competition date")) {
				$("#warning-contamination-table").append("⚠️ Model was published after the competition date, making contamination possible.");
			}
			break
		}
	}
}

function removeWarning() {
	$("#warning-contamination-table").text("");
}

$(document).ready(function() {
    // Add FAQ collapse functionality
    $('.faq-question').click(function() {
        // Toggle the active class on the question
        $(this).toggleClass('is-active');
        
        // Toggle the visibility of the answer
        var answer = $(this).next('.faq-answer');
        if (answer.is(':visible')) {
            answer.slideUp();
        } else {
            answer.slideDown();
        }
        // Force recalculation of DataTable column widths, cannot be done in the "none" display
        $('#secondaryTable').DataTable().columns.adjust();
    });
  });

function createCompetitionTabs() {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'competition-container';

  // Fill table heading <h3 class="tableHeading">Click on a cell to see the raw model output.</h3>
  // get it first 
  const fa = document.querySelector('.finalAnswerLabel');
  const tp = document.querySelector('.textProofsLabel');
  const mc = document.querySelector('.mathCodeLabel');
  if (fa) fa.style.color = competition_type_to_color["FinalAnswer"];
  if (tp) tp.style.color = competition_type_to_color["TextProofs"];
  if (mc) mc.style.color = competition_type_to_color["Math+Code"];

  
  // Create tab navigation
  const tabNav = document.createElement('ul');
  tabNav.className = 'nav nav-tabs';
  tabNav.setAttribute('role', 'tablist');
  
  // Create tab content container
  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';

  // Create dropdown for mobile
  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown';
  
  const dropdownButton = document.createElement('button');
  dropdownButton.className = 'btn btn-secondary dropdown-toggle';
  dropdownButton.type = 'button';
  dropdownButton.id = 'competitionDropdown';
  dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
  dropdownButton.setAttribute('aria-expanded', 'false');
  dropdownButton.textContent = 'Select Competition';
  
  const dropdownMenu = document.createElement('ul');
  dropdownMenu.className = 'dropdown-menu';
  dropdownMenu.setAttribute('aria-labelledby', 'competitionDropdown');
  
  dropdown.appendChild(dropdownButton);
  dropdown.appendChild(dropdownMenu);

  
  // Create tabs for each competition
  sortedCompetitions.forEach((competition, index) => {
    // Create nav item
    const navItem = document.createElement('li');
    navItem.className = 'nav-item';
    navItem.setAttribute('role', 'presentation');
    
    // Create nav link
    // Removed colored strip under the active tab to avoid blue top frame

    const navLink = document.createElement('button');
    navLink.className = `nav-link ${index === 0 ? 'active' : ''}`;
    navLink.id = `${competition}-tab`;
    navLink.setAttribute('data-bs-toggle', 'tab');
    navLink.setAttribute('data-bs-target', `#${competition}-content`);
    navLink.setAttribute('type', 'button');
    navLink.setAttribute('role', 'tab');
    navLink.setAttribute('aria-controls', `${competition}-content`);
    navLink.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    navLink.textContent = competition_info[competition]["nice_name"];
    
    // Do not add color strip
    navItem.appendChild(navLink);
    tabNav.appendChild(navItem);

    // Create dropdown item
    const dropdownItem = document.createElement('li');
    const dropdownLink = document.createElement('a');
    dropdownLink.className = 'dropdown-item';
    dropdownLink.href = '#';
    dropdownLink.textContent = competition_info[competition]["nice_name"];
    
    // Do not add color strip in dropdown either

    dropdownLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(`#${competition}-tab`).click();
      dropdownButton.textContent = competition_info[competition]["nice_name"];
    });
    dropdownItem.appendChild(dropdownLink);
    dropdownMenu.appendChild(dropdownItem);

    // Create content pane
    const tabPane = document.createElement('div');
    tabPane.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
    tabPane.id = `${competition}-content`;
    tabPane.setAttribute('role', 'tabpanel');
    tabPane.setAttribute('aria-labelledby', `${competition}-tab`);

    // Create table for this competition
    const table = document.createElement('table');
    table.id = `table-${competition}`;
	if (competition == "overall") {
		table.className = 'stripe row-border order-columns';
	} else {
    	table.className = 'display';
	}
    table.style.width = '100%';
    
    tabPane.appendChild(table);
    tabContent.appendChild(tabPane);
  });
  
  tabContainer.appendChild(dropdown);
  tabContainer.appendChild(tabNav);
  tabContainer.appendChild(tabContent);
  
  // Insert tabs before the contamination warning (as it is already in html)
  const tableContainer = document.querySelector('#warning-contamination-table');
  tableContainer.parentElement.insertBefore(tabContainer, tableContainer);

  const initializedCompetitions = [];
  let firstCompetition = sortedCompetitions[sortedCompetitions.length-1]; // Default to the last competition
  
  // Check if any competition has default_open set to true
  for (const competition of sortedCompetitions) {
    if (competition_info[competition] && 
        competition_info[competition].hasOwnProperty("default_open") && 
        competition_info[competition].default_open === true) {
      firstCompetition = competition;
      break;
    }
  }
  
  // Add bootstrap tab event listener
  const tabs = document.querySelectorAll('button[data-bs-toggle="tab"]');
  tabs.forEach(tab => {
    tab.addEventListener('shown.bs.tab', event => {
      const competition = event.target.id.substring(0, event.target.id.length-4);
      selectCompetition(competition, !initializedCompetitions.includes(competition));
      if (!initializedCompetitions.includes(competition)) {
        initializedCompetitions.push(competition);
      }
      // Get the current competition's table and adjust columns if it exists
      if ($.fn.DataTable.isDataTable(`#table-${competition}`)) {
        const currentTable = $(`#table-${competition}`).DataTable();
        currentTable.columns.adjust().draw();
      }
    });
  });
  
  // Ensure first competition is initialized and displayed
  document.querySelector(`#${firstCompetition}-tab`).click();
  // Fallback: call directly to render in case the Bootstrap event doesn't fire yet
  if (!initializedCompetitions.includes(firstCompetition)) {
    selectCompetition(firstCompetition, true);
    initializedCompetitions.push(firstCompetition);
  }
}

function selectCompetition(competition, initialize) {
  // Initialize tables with selected competition data
  removeWarning();
  if (window.competition) {
	removeTraces();
  }
  
  if (initialize) {
    initializeApp(competition);
  } 
  if (competition != "overall") {
    if ($.fn.DataTable.isDataTable('#secondaryTable')) {
      $('#secondaryTable').DataTable().destroy();
      $('#secondaryTable').empty();
    }
    updateSecondary(competition);
  }
  if (competition != "overall") {
		var time_data = competition_dates[competition];
    if (competition == "imo--imo_2025") {
      $("#warning-contamination-table").html("See our blog post for more details on the evaluation setup: <a href='https://physarena.ai/imo' target='_blank'>https://physarena.ai/imo</a> <br> *We were asked after our evaluation by xAI to re-evaluate Grok-4 with a different prompt, which resulted in significantly better results. The full story, with the main conclusions from the analysis, can be found in the blog post.");
    } else if (competition == "imc--imc_2025") {
      $("#warning-contamination-table").html("See our blog post for more details on the evaluation setup: <a href='https://physarena.ai/imc' target='_blank'>https://physarena.ai/imc</a>");
    } else if (competition == "euler--euler") {
    $("#warning-contamination-table").html(`Below each problem ID we show the official <a href="https://projecteuler.net/about">Difficulty Rating</a>, ranging from <span class='problem-easy'>5%</span> (easiest) to <span class='problem-hard'>100%</span> (hardest). For recent problems such as these, ratings may still change.`);

    }
		addWarning(time_data);
  } else {
    var time_data = competition_dates;
    for (var key in time_data) {
      addWarning(time_data[key]);
    }
  }
  window.competition = competition;
  document.getElementById('competitionDropdown').textContent = competition_info[competition]["nice_name"];
}