export async function saveToFile(data: any, filename: string): Promise<void> {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function loadFromFile(): Promise<any> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        if (file.name.endsWith('.csv')) {
          const text = await file.text();
          resolve(parseCSV(text));
        } else {
          const text = await file.text();
          resolve(JSON.parse(text));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    input.click();
  });
}

function parseCSV(text: string): any[][] {
  return text.split('\n').map(line => 
    line.split(',').map(cell => cell.trim())
  );
}

export async function exportToCSV(data: string[][]): Promise<void> {
  const csv = data.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'spreadsheet.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}