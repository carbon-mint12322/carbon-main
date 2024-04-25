export function filterData(data, searchVal) {
  return data.filter((obj) =>
    JSON.stringify(obj).toString().toLowerCase().includes(searchVal.toString().toLowerCase()),
  );
}

