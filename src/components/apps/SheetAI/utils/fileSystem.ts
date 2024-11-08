export async function saveToFile(data: any, filename: string): Promise<void> {
  try {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [{
        description: 'JSON Files',
        accept: { 'application/json': ['.json'] }
      }]
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (error) {
    console.error('Failed to save file:', error);
    throw error;
  }
}

export async function loadFromFile(): Promise<any> {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [{
        description: 'JSON Files',
        accept: { 'application/json': ['.json'] }
      }]
    });
    const file = await handle.getFile();
    const content = await file.text();
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load file:', error);
    throw error;
  }
}

export async function exportToCsv(data: string[][]): Promise<void> {
  try {
    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const handle = await window.showSaveFilePicker({
      suggestedName: 'spreadsheet.csv',
      types: [{
        description: 'CSV Files',
        accept: { 'text/csv': ['.csv'] }
      }]
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (error) {
    console.error('Failed to export CSV:', error);
    throw error;
  }
}

export async function importFromCsv(): Promise<string[][]> {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [{
        description: 'CSV Files',
        accept: { 'text/csv': ['.csv'] }
      }]
    });
    const file = await handle.getFile();
    const content = await file.text();
    return content.split('\n').map(row => row.split(','));
  } catch (error) {
    console.error('Failed to import CSV:', error);
    throw error;
  }
}