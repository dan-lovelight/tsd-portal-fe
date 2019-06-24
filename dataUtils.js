// Returns an array of records
async function filterViewPromise(scene, view, filter) {

  mySecureKnackHeaders.Authorization =  Knack.getUserToken()

  const url = 'https://api.knack.com/v1/pages/scene_' + scene + '/views/view_' + view + '/records/'
  const search = '?rows_per_page=1000&filters=' + encodeURI(JSON.stringify(filter))
  const searchUrl = url + search
  const init = {
    method: 'GET',
    headers: mySecureKnackHeaders
  }

  try {
    let response = await fetch(searchUrl, init)
    if (!response.ok) throw Error(response.statusText)
    let json = await response.json()
    let records = await json.records
    return records
  } catch (err) {
    logError(filterViewPromise, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }
}

// Updates record and returns the updated record
async function updateViewPromise(scene, view, id, data) {

  mySecureKnackHeaders.Authorization =  Knack.getUserToken()

  const url = 'https://api.knack.com/v1/pages/scene_' + scene + '/views/view_' + view + '/records/' + id
  const init = {
    method: 'PUT',
    headers: mySecureKnackHeaders,
    body: JSON.stringify(data)
  }

  try {
    let response = await fetch(url, init)
    if (!response.ok) throw Error(response.statusText)
    let json = await response.json()
    return json
  } catch (err) {
  logError(updateViewPromise, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }

}

// takes an object name (eg 'object_1') and a data object
// POSTs the data to create the record and returns the record
async function createViewPromise(scene, view, data) {

  mySecureKnackHeaders.Authorization =  Knack.getUserToken()

  const url = 'https://api.knack.com/v1/pages/scene_' + scene + '/views/view_' + view + '/records/'
  const init = {
    method: 'POST',
    headers: myKnackHeaders,
    body: JSON.stringify(data)
  }

  try {
    let response = await fetch(url, init)
    if (!response.ok) throw Error(response.statusText)
    let json = await response.json()
    return json
  } catch (err) {
    logError(createViewPromise, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }

}


// Returns a single record from a view by ID
async function getViewRecordPromise(scene, view, id) {

  mySecureKnackHeaders.Authorization =  Knack.getUserToken()

  const url = 'https://api.knack.com/v1/pages/scene_' + scene + '/views/view_' + view + '/records/' + id
  const init = {
    method: 'GET',
    headers: mySecureKnackHeaders
  }

  try {
    let response = await fetch(url, init)
    if (!response.ok) throw Error(response.statusText)
    let json = await response.json()
    return json
  } catch (err) {
    logError(getViewRecordPromise, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }

}


// ---------------------- DATA MANAGEMENT ------------

//Return array of callOut IDs for any connection field
function getConnectionIDs(connectionArray) {
  if (connectionArray !== undefined) {
    return connectionArray.map(connection => connection.id)
  } else {
    return []
  }
}

//Return array of callOut identifiers for any connection field
function getConnectionIdentifiers(connectionArray) {
  if (connectionArray !== undefined) {
    return connectionArray.map(connection => connection.identifier)
  } else {
    return []
  }
}

// Updates record and returns the updated record
async function createRecordPromise(object, data) {
  const url = 'https://api.knackhq.com/v1/objects/' + object + '/records/'
  const init = {
    method: 'POST',
    headers: myKnackHeaders,
    body: JSON.stringify(data)
  }
  try {
    let response = await fetch(url, init)
    if (!response.ok) throw Error(response.statusText)
    let json = await response.json()
    return json
  } catch (err) {
  logError(updateRecordPromise, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }
}

// takes an object name (eg 'object_1') and a data object
// POSTs the data to create the record and returns the record
async function getRecordPromise(object, id) {
  const url = 'https://api.knackhq.com/v1/objects/' + object + '/records/' + id
  const init = {
    method: 'GET',
    headers: myKnackHeaders
  }
  try {
    let response = await fetch(url, init)
    if (!response.ok) throw Error(response.statusText)
    let json = await response.json()
    return json
  } catch (err) {
    logError(getRecordPromise, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }
}

// Updates record and returns the updated record
async function updateRecordPromise(object, id, data) {
  const url = 'https://api.knackhq.com/v1/objects/' + object + '/records/' + id
  const init = {
    method: 'PUT',
    headers: myKnackHeaders,
    body: JSON.stringify(data)
  }
  try {
    let response = await fetch(url, init)
    if (!response.ok) throw Error(response.statusText)
    let json = await response.json()
    return json
  } catch (err) {
  logError(updateRecordPromise, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }
}

// Returns an array of records
async function searchRecordsPromise(object, filter) {

  const url = 'https://api.knackhq.com/v1/objects/' + object + '/records/'
  const search = '?rows_per_page=1000&filters=' + encodeURI(JSON.stringify(filter))
  const searchUrl = url + search
  const init = {
    method: 'GET',
    headers: myKnackHeaders
  }

  try {
    let response = await fetch(searchUrl, init)
    if (!response.ok) throw Error(response.statusText)
    let json = await response.json()
    let records = await json.records
    return records
  } catch (err) {
    logError(searchRecordsPromise, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }
}

// Builds a filter for Knack to be used for fetching multiple records
// Filter is for each ID in the array
function createFilterFromArrayOfIDs (arrRecordIDs) {
  if (!isItAnArray(arrRecordIDs)) {
    throw new Error('you must pass an array to getKnackRecordsUsingIDs')
  }
  let filter = {}
  filter.match = 'or'

  let rules = []
  arrRecordIDs.map(value => {
    rules.push({
      'field': 'id',
      'operator': 'is',
      'value': value
    })
  })

  filter.rules = rules
  return filter
}

// Function checks if the passed variable is an array
// Feturns true or false
function isItAnArray (array) {
  if (array.length === 0 || !Array.isArray(array)) {
    return false
  } else {
    return true
  }
}
