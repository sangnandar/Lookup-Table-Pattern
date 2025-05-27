/*******************************************************
 **        GLOBAL VARIABLES AND CONFIGURATIONS        **
 *******************************************************/

const DEBUG = true; // set to false for production

var UI; // return null if called from script editor
try {
  UI = SpreadsheetApp.getUi();
} catch (e) {
  Logger.log('You are using script editor.');
}
const SS = SpreadsheetApp.getActiveSpreadsheet();

// === START: Configuration for Sheets ===

// Sheet: 'Orders'
const SHEETNAME_ORDERS = DEBUG
  ? 'Orders_dev' // for development & debugging
  : 'Orders'; // for production

// Sheet: <add more sheets...>

const SHEETCONFIG = readOnlyObject({

  [SHEETNAME_ORDERS]: {
    headerRows: 1,
    variableNames: {
      orderStatus           : { col: 'A',  type: 'string' },
      orderId               : { col: 'B',  type: 'string' }, // unique ID
      salesRep              : { col: 'C',  type: 'string' },
      orderDate             : { col: 'D',  type: 'date'   },
      clientName            : { col: 'E',  type: 'string' },
      product               : { col: 'F',  type: 'string' },
      qty                   : { col: 'G',  type: 'number' },
      price                 : { col: 'H',  type: 'number' },
      total                 : { col: 'I',  type: 'number' }
    }
  }

  // <add more sheets...>
});

// === END: Configuration for Sheets ===

// === START: Configuration for status-change actions ===

// List of statuses to be used in the dropdown menu and their allowed transitions
const ORDERSTATUS_CONFIG = readOnlyObject({
  'Please select': {
    bgColor: '#ffffff',
    transitions: {
      'Booking': handleBooking,
      'Waitlist': handleWaitlist
    }
  },
  'Waitlist': {
    bgColor: '#ffcfc9',
    transitions: {
      'Booking': handleBooking,
      'Confirmation': handleBooking
    }
  },
  'Booking': {
    bgColor: '#d4edbc',
    transitions: {
      'Confirmation': handleBooking
    }
  },
  'Confirmation': {
    bgColor: '#d4edbc',
    transitions: {
      'Send Invoice': handleInvoice,
      'Paid': handleInvoice
    }
  },
  'Send Invoice': {
    bgColor: '#d4edbc',
    transitions: {
      'Paid': handleInvoice
    }
  },
  'Paid': {
    bgColor: '#4dc245',
    transitions: {
      'Delivery': handleDelivery
    }
  },
  'Delivery': {
    bgColor: '#15dae7',
    transitions: {}
  },
  'Cancelled': {
    bgColor: '#e97777',
    transitions: {}
  }
});

const MESSAGES = readOnlyObject({
  statusNotFound: `Status not found!!`,
  transitionNotAllowed: `Status transition not allowed!`,
  configError: `There is a problem with the configuration. Please contact the developer.`
});

// === END: Configuration for status-change actions ===
