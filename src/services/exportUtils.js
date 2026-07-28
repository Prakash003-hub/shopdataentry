// Utility for exporting data table to CSV format
export const exportToCSV = (data, filename = 'subi_report.csv') => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      let val = row[header];
      if (val === null || val === undefined) val = '';
      if (typeof val === 'object') val = JSON.stringify(val);
      // Escape double quotes
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Utility for triggering browser print preview
export const printReport = (title = 'SUBI Report') => {
  const originalTitle = document.title;
  document.title = `${title} - ${new Date().toLocaleDateString()}`;
  window.print();
  document.title = originalTitle;
};
