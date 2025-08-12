function initializeApp(competition) {
	const resultData = all_result_data[competition];
	const timeData = competition !== "overall" ? competition_dates[competition] : competition_dates;

	$(document).ready(function () {
		const cleanedData = cleanResultData(resultData, competition);
		const transposedData = transposeResultData(cleanedData);
		sortResultData(transposedData);

		const modelNamesSorted = transposedData.map(row => row.model_name);

		const columnMapper = getColumnMapper(competition);
		const headerHtml = generateTableHeader(competition, columnMapper);
		$(`#table-${competition}`).html(headerHtml);

		const table = renderCompetitionTable(competition, transposedData, columnMapper, modelNamesSorted, timeData);
		setupTableInteractions(table, competition);
	});
}

// --- Helper Functions ---

function cleanResultData(data, competition) {
	return data.map(row => {
		const cleanedRow = { ...row };
		for (const key in row) {
			if (key === "question") continue;

			if (competition !== "overall" && typeof row[key] === "number") {
				cleanedRow[key] = Math.round(row[key] * 100) / 100;
			} else if (competition === "overall" && typeof row[key] === "number" && key !== "Rank") {
				cleanedRow[key] = Math.round(row[key]);
			}
		}
		return cleanedRow;
	});
}

function transposeResultData(data) {
	const modelNames = [];
	const transposed = [];

	// Extract model names
	for (const key in data[0]) {
		if (key !== "question" && !modelNames.includes(key)) {
			modelNames.push(key);
			transposed.push({ model_name: key });
		}
	}

	data.forEach(row => {
		modelNames.forEach((model, idx) => {
			if (row.hasOwnProperty(model)) {
				transposed[idx][row.question] = row[model];
			}
		});
	});

	return transposed;
}

function sortResultData(data) {
	data.sort((a, b) => {
		if (b.Avg === a.Avg) {
			if (typeof a.Cost !== "number") return 1;
			if (typeof b.Cost !== "number") return -1;
			return a.Cost - b.Cost;
		}
		return b.Avg - a.Avg;
	});
}

function getColumnMapper(competition) {
	const problemCount = competition_info[competition]["num_problems"];

	if (competition === "overall") {
		const mapper = ["Avg"];
		for (let i = 1; i < problemCount; i++) mapper.push(i);
		return mapper;
	}
	return Array.from({ length: problemCount }, (_, i) => i + 1);
}

function generateTableHeader(competition, columnMapper) {
	const acc = competition === "overall" ? "" : '<th colspan="1">Acc</th>';
	const cost = competition === "overall" ? "" : '<th colspan="1">Cost</th>';

	let headerHtml = `
		<thead>
			<tr>
				<th colspan="1" class="model-name">Model</th>
				${acc}${cost}`;

	columnMapper.forEach((col, i) => {
		const currCompInfo = competition_info[competition];
        let name = currCompInfo["problem_names"]?.[i] || (i + 1);
        if (typeof name === 'string') {
            name = name.replace(/-/g, '');
        }
        const widthStyle = competition === 'overall' ? '' : ' style="width:50px"';
        headerHtml += `<th colspan="1" class="problem-header"${widthStyle}><a href="javascript:void(0)" id="${i + 1}" style="text-decoration: none">${name}</a>`;
		if (currCompInfo["problem_difficulty"]) {
			const difficulty = currCompInfo["problem_difficulty"][name];
			if (parseInt(difficulty) <= 33) {
				difficultyClass = "problem-easy";
			} else if (parseInt(difficulty) <= 66) {
				difficultyClass = "problem-medium";
			} else {
				difficultyClass = "problem-hard";
			}
			headerHtml += `<br><span class="problem-difficulty ${difficultyClass}">(${difficulty})</span>`;
		}
		headerHtml += `</th>`;
	});

	headerHtml += `</tr></thead><tbody></tbody>`;
	return headerHtml;
}

function renderCompetitionTable(competition, data, columnMapper, modelNamesSorted, timeData) {
	const isOverall = competition === "overall";
	const problemCount = competition_info[competition]["num_problems"];
	const columnClass = isOverall ? "text-center main-table-column" : "text-center problem-column";
    const width = isOverall ? "180px" : "60px";
	const addCols = isOverall ? 1 : 3;
	const targetCols = isOverall ? [] : [1, 2];
	const extraCols = isOverall ? [] : [
		{ data: "Avg" },
		{ data: "Cost" }
	];

	const table = $(`#table-${competition}`).DataTable({
		data,
		columns: [
			{
				data: "model_name",
				render: function (data) {
					return `<a id="${data.replace(" ", "_")}">${data}</a>`;
				}
			},
			...extraCols,
			...Array.from({ length: problemCount }, (_, i) => ({
				data: columnMapper[i].toString(),
				width: width
			}))
		],
		pageLength: 17,
		order: [],
		scrollX: true,
		scrollY: "600px",
		scrollCollapse: true,
		lengthChange: false,
		info: false,
		searching: false,
		paging: false,
		ordering: false,
		stripeClasses: [],
		autoWidth: false,
		columnDefs: [
			{
				targets: Array.from({ length: problemCount }, (_, i) => i + addCols),
				createdCell: function (td, cellData, rowData, row, col) {
					const pValue = parseFloat(cellData);

					if (!isOverall) {
						const color = getColor(pValue, competition, competition_info[competition]["medal_thresholds"]);

						if (competition_info[competition]["judge"]) {
							$(td).text(Math.round(pValue) + "%");
						} else {
							$(td).text("");
						}

						$(td).css({ 'cursor': 'pointer', 'background-color': color });
						$(td).hover(
							() => $(td).addClass('target-candidate'),
							() => $(td).removeClass('target-candidate')
						);
						$(td).on('click', () => {
							const modelName = modelNamesSorted[row];
                            const task = col - 2; // problem index 1..N (matches header a.id)
							captureTask(task, false);
							captureModelName(modelName, true);
						});
					} else {
						let percentage = "", warning = "", medal = "&ensp;&ensp;";
						const colComp = col > 1 ? sortedCompetitions[col - 1] : "overall";
						const existingText = $(td).text();
						const modelName = rowData["model_name"];
						const medalThresholds = competition_info[colComp]["medal_thresholds"];
						let canHaveMedal = true;
						if (existingText != "N/A") {
							percentage = "%";
						}
						if (col > 1 && timeData[colComp]?.[modelName]) {
							canHaveMedal = false;
							warning = "⚠️ ";
							medal = "";
						}

						if (pValue >= medalThresholds[0] && canHaveMedal) medal = "🥇";
						else if (pValue >= medalThresholds[1] && canHaveMedal) medal = "🥈";
						else if (pValue >= medalThresholds[2] && canHaveMedal) medal = "🥉";

						$(td).html(`
							<span class="overall-percentage">
								<span class="medal">${medal}</span>
								<span class="warning-small">${warning}</span>
								${existingText}${percentage}
							</span>
						`);
					}
				},
				className: columnClass
			},
			{
				targets: targetCols,
				createdCell: function (td, cellData, rowData, row, col) {
					if (isOverall) return;

					if (typeof cellData === "number") {
						let value = cellData.toFixed(2);
						let string = col === 2 ? `$${value}` : `${value}%`;
						if (string.length < 6) string = '\u00A0\u00A0' + string;
						$(td).text(string);
					} else if (cellData === "N/A") {
						$(td).text('\u00A0\u00A0\u00A0N/A');
					}
				},
				width: "80px",
				maxWidth: "80px",
				className: 'avg-cost'
			},
			{
				targets: 0,
				className: 'model-names',
				createdCell: function (td, cellData, rowData) {
					if (timeData[rowData["model_name"]]) {
						$(td).html(cellData + ' <span class="contamination-warning" data-tooltip=" Model was published after the competition date, making contamination possible.">⚠️</span>');
					} else {
						$(td).text(cellData);
					}
				}
			}
		],
		dom: '<"table-wrapper"t>'
	});

	return table;
}

function setupTableInteractions(table, competition) {
	$('.table-wrapper').css({
		'width': 'calc(100% - 40px)',
		'overflow-x': 'auto'
	});

	table.columns.adjust();

	$(window).on('resize', () => {
		table.columns.adjust().draw();
	});

	if (competition !== "overall") {
		setupColumnHover(table);
	}
}



function setupColumnHover(table) {
	const cells = table.table().container().getElementsByTagName('td');
	for (let cell of cells) {
		cell.addEventListener('mouseover', function () {
			let columnIndex = this.cellIndex;
			if (columnIndex < 3) return;
			let rowNodes = table.rows().nodes().toArray();
			rowNodes.forEach(row => row.cells[columnIndex].classList.add('highlight-column'));
		});

		cell.addEventListener('mouseout', function () {
			let columnIndex = this.cellIndex;
			if (columnIndex < 3) return;
			let rowNodes = table.rows().nodes().toArray();
			rowNodes.forEach(row => row.cells[columnIndex].classList.remove('highlight-column'));
		});
	}
}


function getColor(value, competition) {
	var red = 255;
	var green = 255;
	if (value > 75) {
		red = 0;
		green = 255;
	} else if (value >= 25) {
		red = 255;
		green = 255;
	} else if (value >= 1) {
		red = 255;
		green = 125;
	} else {
		red = 255;
		green = 0;
	}
	return 'rgba(' + red + ',' + green + ',0,0.2)';
}