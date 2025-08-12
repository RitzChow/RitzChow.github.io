
function captureTask(task, update=true) {
	if (window.competition == "overall") {
		return;
	}
    var table = $(`#table-${window.competition}`).DataTable();
    
    // Get all task links directly from the header row
    var taskLinks = $(table.table().header()).find('a');
    taskLinks.each(function() {
        if ($(this).attr('id') == window.currTask) {
            $(this).css('color', 'inherit');
        }
        if ($(this).attr('id') == task) {
            $(this).css('color', '#c7cacf');
        }
    });

    window.currTask = task; 
    if (window.currModelName && update) {
        updateTraces(window.currModelName, task);
        document.getElementById("traces").style.display = "inline-block";
    }
}

function captureModelName(modelName, update=true) {
	if (window.competition == "overall") {
		return;
	}
    var table = $(`#table-${window.competition}`).DataTable();

    // Get all model name links directly from the first column
    var modelLinks = table.column(0).nodes().to$().find('a');
    modelLinks.each(function() {
        if (window.currModelName && $(this).attr('id') == window.currModelName.replace(" ", "_")) {
            $(this).css({
                'color': 'inherit',
            });
        }
        if ($(this).attr('id') == modelName.replace(" ", "_")) {
            $(this).css({
                'color': '#c7cacf',
            });
        }
    });

    window.currModelName = modelName;
    if (window.currTask && update) {
        updateTraces(modelName, window.currTask);
        document.getElementById("traces").style.display = "inline-block";
    }
}
function openTab(evt, traceIdx) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById("tab"+traceIdx).style.display = "block";
    evt.currentTarget.className += " active";
  }

function openTabJudgment(currentTarget, traceIdx, judgmentIdx) {
    // Declare all variables
    let i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontentjudges" and hide them
    tabcontent = document.getElementsByClassName("tabcontentjudges");
    for (i = 0; i < tabcontent.length; i++) {
		id_parts = tabcontent[i].id.split(",");
		if (id_parts[0] == "tabjudges"+traceIdx) {
      		tabcontent[i].style.display = "none";
		}
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinksjudges");
    for (i = 0; i < tablinks.length; i++) {
		id_parts = tabcontent[i].id.split(",");
		if (id_parts[0] == "tabjudges"+traceIdx) {
      		tablinks[i].className = tablinks[i].className.replace(" active", "");
		}
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById("tabjudges"+traceIdx+","+judgmentIdx).style.display = "block";
	if (currentTarget) {
		currentTarget.className += " active";
	}
  }

function removeTraces() {
	document.getElementById("traces").style.display = "none";
	var table = $(`#table-${window.competition}`).DataTable();

	var rows = $(`#table-${window.competition} tbody tr`);
    for (var i = 0; i < rows.length; i++) {
        var td = rows[i].querySelector("td");
        for (var j = 0; j < td.parentElement.children.length; j++) {
            var cell = td.parentElement.children[j];
            cell.classList.remove("target");
        }
    }

	var taskLinks = $(table.table().header()).find('a');
    taskLinks.each(function() {
        if ($(this).attr('id') == window.currTask) {
            $(this).css('color', 'black');
        }
    });
	window.currTask = null;

    // Get all model name links directly from the first column
    var modelLinks = table.column(0).nodes().to$().find('a');
    modelLinks.each(function() {
        if (window.currModelName && $(this).attr('id') == window.currModelName.replace(" ", "_")) {
            $(this).css({
                'color': 'inherit',
            });
        }
	});
	window.currModelName = null;
}
function updateTraces(model, task) {
	model = model.replace("_", " ");
	const tableSelector = `#table-${window.competition}`;
	const taskIdx = getTaskColumnIndex(tableSelector, task);
	clearPreviousHighlights(tableSelector);

	highlightSelectedCell(tableSelector, model, taskIdx);
	updateTracesBoxHeading(model, task, window.competition);

	const tracesBox = document.getElementById("traces");
	const loadingElement = createLoadingElement();
	let add_loading = true;

	setTimeout(() => {
		if (add_loading) {
			tracesBox.appendChild(loadingElement);
		}
	}, 100);

  const encModel = encodeURIComponent(model);
  fetch(`https://physarena-backend.onrender.com/traces/${window.competition}/${encModel}/${task}`)
		.then(handleResponse)
		.then(data => {
			renderTraceContent(data, tracesBox);
			loadingElement.remove();
			add_loading = false;
		})
		.catch(error => {
			loadingElement.innerHTML = "<br>Error loading traces. Try again.";
			console.error('Error fetching traces:', error);
		});
}

// -------------------- Helper Functions --------------------

function getTaskColumnIndex(selector, task) {
    const ths = $(`${selector} thead th`);
    for (let i = 3; i < ths.length; i++) {
        const a = ths[i].querySelector("a");
        if (!a) continue;
        // Prefer matching by numeric id (header anchor id is 1..N)
        if (a.id && String(a.id) === String(task)) return i;
        // Fallback: match visible text if it is numeric
        if (a.innerHTML && String(a.innerHTML) === String(task)) return i;
    }
    return -1;
}

function clearPreviousHighlights(selector) {
	const rows = $(`${selector} tbody tr`);
	rows.each((_, row) => {
		$(row).find("td").removeClass("target");
	});
}

function highlightSelectedCell(selector, model, taskIdx) {
	const rows = $(`${selector} tbody tr`);
	rows.each((_, row) => {
		const td = row.querySelector("td");
		if (td && td.innerHTML === model) {
			const targetCell = td.parentElement.children[taskIdx];
			if (targetCell) {
				targetCell.classList.add("target");
			}
		}
	});
}

function updateTracesBoxHeading(model, task, competition) {
	const tracesBox = document.getElementById("traces");
	tracesBox.innerHTML = "";

	const heading = document.createElement("h2");
	heading.className = "tracesHeading";
	
	const taskName = competition_info[competition]["problem_names"]?.[task-1] || `#${task}`;
	let headingText = `Solution: Model ${model} for Problem ${taskName}`;
	
	if (competition === "euler--euler") {				
		const eulerProblemNumber = parseInt(task) + 942;
		const url = `https://projecteuler.net/problem=${eulerProblemNumber}`;
		heading.innerHTML = headingText + "<br><br>View problem on Project Euler website: <a href='" + url + "' target='_blank'>" + url + "</a>";
	} else {
		heading.innerHTML = headingText;
	}
	
	tracesBox.appendChild(heading);
}

function createLoadingElement() {
	const loadingElement = document.createElement("h2");
	loadingElement.id = "loading-trace";
	loadingElement.className = "tracesHeading";
	loadingElement.innerHTML = "<br>Loading...";
	return loadingElement;
}

function handleResponse(response) {
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
}

function renderTraceContent(data, container) {
	renderProblemStatement(data, container);
	if (data.gold_answer) renderGoldAnswer(data, container);
	renderModelOutputs(data.model_outputs, container);
	renderMathInElement(document.body, {
		delimiters: [
			{ left: '$$', right: '$$', display: true },
			{ left: '$', right: '$', display: false },
			{ left: '\\(', right: '\\)', display: false },
			{ left: '\\[', right: '\\]', display: true }
		]
	});
}

function renderProblemStatement(data, container) {
	const label = document.createElement("h4");
	label.innerHTML = "Problem";
	label.style.fontWeight = "bold";

	const problemBox = document.createElement("div");
	problemBox.className = "marked box problem-box";
	problemBox.style.whiteSpace = "pre-wrap";
	problemBox.style.tabSize = "4";
	problemBox.appendChild(document.createTextNode(data.statement));

	const problemContainer = document.createElement("div");
	problemContainer.style.position = "relative";
	problemContainer.appendChild(problemBox);

	container.appendChild(label);

	if (data.contamination_info) {
		const infoButton = document.createElement("button");
		infoButton.className = "info-button";
		infoButton.innerHTML = "▶ Similar problems";

		const detailBox = document.createElement("div");
		detailBox.className = "detail-box";
		detailBox.innerHTML = data.contamination_info;

		const infoContainer = document.createElement("div");
		infoContainer.className = "info-container";
		infoContainer.appendChild(infoButton);
		infoContainer.onclick = () => {
			detailBox.classList.toggle("show");
			infoButton.innerHTML = detailBox.classList.contains("show")
				? "▼ Similar problems"
				: "▶ Similar problems";
		};

		problemContainer.appendChild(infoContainer);
		container.appendChild(problemContainer);
		container.appendChild(detailBox);
	} else {
		container.appendChild(problemContainer);
	}
}

function renderGoldAnswer(data, container) {
	const label = document.createElement("h4");
	label.style.fontWeight = "bold";
	label.innerHTML = "Correct Answer";

	const answerBox = document.createElement("div");
	answerBox.className = "marked box solution-box";
	answerBox.appendChild(document.createTextNode(`$${data.gold_answer}$`));

	container.appendChild(label);
	container.appendChild(answerBox);
}

function renderModelOutputs(outputs, container) {
	const tab = document.createElement("div");
	tab.className = "tab";

	outputs.forEach((_, i) => {
		const button = document.createElement("button");
		button.className = "tablinks";
		button.innerHTML = `Run ${i + 1}`;
		button.onclick = event => openTab(event, i);
		tab.appendChild(button);
	});
	container.appendChild(tab);

	outputs.forEach((output, i) => {
		const content = document.createElement("div");
		content.className = "tabcontent";
		content.id = `tab${i}`;
		output.run_index = i; // Attach for later grading tab logic

		if (output.parsed_answer !== undefined && output.parsed_answer !== null) {
			const cls = output.correct ? "correct" : "incorrect";
			appendSection(content, "Parsed Answer", `$${output.parsed_answer}$`, `parsed-answer-box ${cls}`);
		}

		if (output.grade !== undefined && output.judgment !== undefined) {
			renderGradeSection(output, content);
		}

		appendSection(content, "Full Model Solution", output.solution, "response-box");

		container.appendChild(content);
	});

	// Show first tab by default
	document.getElementById("tab0").style.display = "block";
	document.getElementsByClassName("tablinks")[0].classList.add("active");
}


function appendSection(parent, title, text, className) {
	const label = document.createElement("h4");
	label.innerHTML = title;
	label.style.fontWeight = "bold";

	const box = document.createElement("div");
	box.className = `marked box ${className}`;
	box.style.whiteSpace = "pre-wrap";
	box.style.tabSize = "4";
	box.appendChild(document.createTextNode(text));

	parent.appendChild(label);
	parent.appendChild(box);
}

function renderGradeSection(output, parent) {
	const grade = Math.round(output.grade * output.max_grade * 100) / 100;
	const gradeClass = output.grade < 0.00001 ? "incorrect" : output.grade < 0.75 ? "semicorrect" : "correct";

	appendSection(parent, "Grade", `${grade}/${output.max_grade}`, `parsed-answer-box ${gradeClass}`);

	const gradingDetailsLabel = document.createElement("h4");
	gradingDetailsLabel.innerHTML = "Grading Details";
	parent.appendChild(gradingDetailsLabel);

	const detailsLength = output.judgment[0].details.length;

	const tab = document.createElement("div");
	tab.className = "tab";

	for (let j = 0; j < detailsLength; j++) {
		const avgScore = output.judgment.reduce((acc, judge) => acc + judge.details[j].points, 0) / output.judgment.length;
		const title = output.judgment[0].details[j].title;
		const max = output.judgment[0].details[j].max_points;

		const btn = document.createElement("button");
		btn.className = "tablinksjudges" + (j === 0 ? " active" : "");
		btn.innerHTML = `${title} (${Math.floor(avgScore * 100) / 100}/${max})`;
		btn.onclick = event => openTabJudgment(event.currentTarget, output.run_index ?? 0, j);
		tab.appendChild(btn);
	}
	parent.appendChild(tab);

	for (let j = 0; j < detailsLength; j++) {
		const tabContent = document.createElement("div");
		tabContent.className = "tabcontentjudges";
		tabContent.id = `tabjudges${output.run_index ?? 0},${j}`;
		tabContent.style.display = j === 0 ? "block" : "none";

		appendSection(tabContent, "Description", output.judgment[0].details[j].grading_scheme_desc, "description-box");

		output.judgment.forEach((judge, idx) => {
			const points = judge.details[j].points;
			const max = judge.details[j].max_points;
			const title = `Human Judge ${idx + 1} (${Math.floor(points * 100) / 100}/${max})`;
			const relGrade = points / max;
			const cls = relGrade < 0.00001 ? "incorrect" : relGrade < 0.75 ? "semicorrect" : "correct";

			appendSection(tabContent, title, judge.details[j].desc, cls);
		});

		parent.appendChild(tabContent);
	}
}