/**
 * This function is just an aggregator for all edit events.
 * It will call the corresponding function based on the event.
 * Using installable-trigger because the script 
 * needs access to DriveApp and Gmail API.
 * 
 * Edit on:
 *  - column `orderStatus` of the 'Orders' sheet
 *  - (register another edit events...)
 * 
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e - event object.
 * @returns {void}
 */
function edit(e)
{
  const sheet = e.range.getSheet();
  const sheetName = sheet.getSheetName();
  const col = e.range.getColumn();

  const sheetLayout = new SheetLayout(sheet);
  const dataMap = sheetLayout.getDataMap();

  // Dispatcher
  if (
    sheetName === SHEETNAME_ORDERS &&
    col === dataMap.orderStatus
  ) statusChange(e, sheetLayout);

  // register another edit events...
  else return;
}
