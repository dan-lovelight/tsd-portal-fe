// Required general utilities
// > updateLog

const userToken = Knack.getUserToken()

const mySecureKnackHeaders = {
  'Authorization': userToken,
  'X-Knack-Application-Id': Knack.application_id,
  'X-Knack-REST-API-KEY': 'knack',
  'Content-Type': 'application/json'
}

// Returns an array of records
async function filterViewPromise(scene, view, filter) {

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
