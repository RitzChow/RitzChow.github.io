
function updateSecondary(competition) {
	const data = secondary_data[competition];

	$(document).ready(function () {
		const transposedData = transposeDataSecondary(data);
		calculateCostsSecondary(transposedData);
		sortByAccuracyAndCostSecondary(transposedData);
		renderTableSecondary(transposedData);
	});
}

function transposeDataSecondary(data) {
	const transposed = [];
	const modelNames = [];

	// Collect model names and initialize transposed objects
	for (const key in data[0]) {
		if (key !== "question" && !modelNames.includes(key)) {
			modelNames.push(key);
			transposed.push({ model_name: key });
		}
	}

	// Fill in question-based values for each model
	data.forEach(row => {
		modelNames.forEach((model, index) => {
			if (row.hasOwnProperty(model)) {
				transposed[index][row.question] = row[model];
			}
		});
	});

	return transposed;
}

function calculateCostsSecondary(data) {
	data.forEach(row => {
		const inputCost = row["Input Cost"] * row["Input Tokens"];
		const outputCost = row["Output Cost"] * row["Output Tokens"];
		const totalCost = inputCost + outputCost;

		row.Cost = (isNaN(totalCost) || inputCost === 0 || outputCost === 0)
			? "N/A"
			: totalCost;
	});
}

function sortByAccuracyAndCostSecondary(data) {
	data.sort((a, b) => {
		if (b.Acc === a.Acc) {
			if (typeof a.Cost !== "number") return 1;
			if (typeof b.Cost !== "number") return -1;
			return a.Cost - b.Cost;
		}
		return b.Acc - a.Acc;
	});
}

function formatCellData(value, colIndex) {
	if (typeof value === "number") {
		if (colIndex === 2 || colIndex === 4) {
			let str = `$${value.toFixed(2)}`;
			if (str.length < 6) str = '\u00A0\u00A0' + str;
			return str;
		} else {
			let str = value.toFixed(0).toString();
			if (str.length < 4) str = '\u00A0\u00A0\u00A0\u00A0' + str;
			if (str.length < 5) str = '\u00A0\u00A0' + str;
			return str;
		}
	}
	if (value === "N/A") return '\u00A0\u00A0\u00A0N/A';
	return value;
}

function renderTableSecondary(data) {
	const table = $('#secondaryTable').DataTable({
		data,
		columns: [
			{ data: "model_name", title: "Model Name", className: "model-names-secondary" },
			{ data: "Input Tokens", title: "Input Tokens", className: "avg-cost-header" },
			{ data: "Input Cost", title: "Input Cost", className: "avg-cost-header" },
			{ data: "Output Tokens", title: "Output Tokens", className: "avg-cost-header" },
			{ data: "Output Cost", title: "Output Cost", className: "avg-cost-header" }
		],
		pageLength: 17,
		order: [],
		fixedColumns: true,
		scrollX: true,
		lengthChange: false,
		info: false,
		searching: false,
		paging: false,
		ordering: false,
		stripeClasses: [],
		columnDefs: [
			{
				targets: [1, 2, 3, 4],
				createdCell: function (td, cellData, rowData, row, col) {
					const formatted = formatCellData(cellData, col);
					$(td).text(formatted);
				}
			},
			{ targets: 0, className: 'model-names-secondary' },
			{ targets: [1, 2, 3, 4], className: 'avg-cost-secondary' }
		]
	});
	table.columns.adjust().draw();
}

