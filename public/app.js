document.addEventListener("DOMContentLoaded", async () => {
  const tableHeadRow = document.getElementById("tableHeadRow");
  const tableBody = document.getElementById("tableBody");
  const statusEl = document.getElementById("status");

  // Define the columns we want, in order
  const columns = [
    "AGE",
    "Organism",
    "Read 1",
    "Read 2",
    "Read 3",
    "Read 4",
    "Read 5",
    "Read 6",
    "Read 7",
    "Read 8",
    "Read 9",
    "Read 10",
    "Run",
    "brain_region",
    "diagnosis",
    "sex",
    "source_name",
  ];

  try {
    // Fetch data from your Express route
    const response = await fetch("/brains");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    let data = await response.json();

    // Normalize: if data is a single object, wrap it as an array
    if (!Array.isArray(data)) {
      data = [data];
    }

    // 1) Build the header
    tableHeadRow.innerHTML = ""; // clear
    columns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      tableHeadRow.appendChild(th);
    });

    // 2) Build rows
    tableBody.innerHTML = ""; // clear
    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="${columns.length}">No data found</td></tr>`;
      return;
    }

    data.forEach((item) => {
      const tr = document.createElement("tr");
      columns.forEach((col) => {
        const td = document.createElement("td");
        // Use the value if present; otherwise show empty string
        td.textContent = item[col] ?? "";
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });

    // Optional: debug in console
    console.log("Fetched /brains data:", data);
    statusEl.textContent = ""; // clear any error
  } catch (err) {
    console.error("Error rendering table:", err);
    statusEl.textContent = `Failed to load data: ${err.message}`;
    tableBody.innerHTML = `<tr><td colspan="${columns.length}">Failed to load data</td></tr>`;
  }
});
