import { formatBytes } from '../../bento-core';

export function formatImageCollection(image_collection) {
  // Validate that image_collection is an array and not empty
  if (!Array.isArray(image_collection) || image_collection.length === 0) {
    return 'Not Applicable'; // Fallback for invalid or empty image_collection
  }

  // Extract unique repository_name, image_collection_name or associated_link_name
  const uniqueRepositories = new Set(
    image_collection.map((item) => {
      if (item.repository_name) {
        return item.repository_name;
      }
      if (item.image_collection_name) {
        return item.image_collection_name;
      }
      if (item.associated_link_name) {
        return item.associated_link_name;
      }

      return 'Unknown'; // Fallback for items without valid properties
    })
  );

  // Convert the Set back to an array and join the values with a comma
  return Array.from(uniqueRepositories).join(', ');
}

export function createFileName(fileName) {
  const date = new Date();
  const yyyy = date.getFullYear();
  let dd = date.getDate();
  let mm = (date.getMonth() + 1);

  if (dd < 10) { dd = `0${dd}`; }

  if (mm < 10) { mm = `0${mm}`; }

  const todaysDate = `${yyyy}-${mm}-${dd}`;

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  if (hours < 10) { hours = `0${hours}`; }

  if (minutes < 10) { minutes = `0${minutes}`; }

  if (seconds < 10) { seconds = `0${seconds}`; }

  return `${fileName} ${todaysDate} ${hours}-${minutes}-${seconds}${'.csv'}`;
}

export function convertToCSV(jsonse, keysToInclude, header) {
  const objArray = jsonse;
  // To Do empty object just print headers
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = header.join(',');
  array.map((entry, index) => {
    let line = '';
    keysToInclude.map((keyName) => {
      if (line !== '') line += ',';
      if (keyName === 'file_size') {
        line += entry[keyName] !== null ? `"${formatBytes(entry[keyName])}"` : ' ';
      } 
      else if (keyName === 'image_collection') {
        line += entry[keyName] !== null ? `"${formatImageCollection(entry[keyName])}"` : ' ';
      } else {
        line += entry[keyName] !== null ? `"${entry[keyName] ||'Not Applicable'}"` : ' ';
      }
      return line;
    });
    if (index === 0) {
      // str = header.join(',');
      str += `\r\n${line}\r\n`;
    } else {
      str += `${line}\r\n`;
    }
    return str;
  });
  return str;
}

export function downloadJson(tableData, tableDownloadCSV) {
  const jsonse = JSON.stringify(tableData);
  const csv = convertToCSV(jsonse, tableDownloadCSV.keysToInclude, tableDownloadCSV.header);
  const exportData = new Blob([csv], { type: 'text/csv' });
  const JsonURL = window.URL.createObjectURL(exportData);
  let tempLink = '';
  tempLink = document.createElement('a');
  tempLink.setAttribute('href', JsonURL);
  tempLink.setAttribute('download', createFileName(tableDownloadCSV.downloadFileName || ''));
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
}
