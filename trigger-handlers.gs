/**
 * Edit on Column `status` of the 'Orders' sheet.
 * 
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e - event object.
 * @param {SheetLayout} sheetLayout - The layout instance to use.
 * @returns {void}
 */
function statusChange(e, sheetLayout)
{
  const [headerRowCount, dataMap] = [sheetLayout.getHeaderRowCount(), sheetLayout.getDataMap()];
  if (sheet.getLastRow() === headerRowCount) return; // sheet contains no data.

  const args = {};

  const sheet = e.range.getSheet();
  const rowIndex = e.range.getRow();
  const oldStatus = e.oldValue;
  const newStatus = e.value;
  const cell = e.range;

  const response = UI.alert('Are you sure you want to change the status?', UI.ButtonSet.YES_NO);
  if (response === UI.Button.NO) {
    cell.setValue(oldStatus); // restore the previous value
    return;
  }

  if (!ORDERSTATUS_CONFIG[newStatus]) { // safeguard agains manual input into the cell
    cell.setValue(oldStatus); // restore the previous value
    showAlert(MESSAGES.statusNotFound);
    return;
  }

  if (!allowedTransitions(oldStatus, newStatus)) {
    cell.setValue(oldStatus); // restore the previous value
    showAlert(MESSAGES.transitionNotAllowed);
    return;
  }


  // LOGIC STARTS HERE

  // === START: variables from the sheet ===
  // sheet-object and row-index
  Object.assign(args, {sheet, rowIndex, cell, oldStatus, newStatus});

  // row's data
  const rowData = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0]; // the whole row
  for (const [key, colIndex] of Object.entries(dataMap)) {
    args[key] = rowData[colIndex - 1]; // -1 for 0-based index of array
  }
  // === END: variables from the sheet ===

  // call Handler to do the work
  const handler = ORDERSTATUS_CONFIG[oldStatus].transitions[newStatus];
  if (isFunction(handler)) {
    handler(args);
  } else {
    showAlert(MESSAGES.configError);
  }

}
