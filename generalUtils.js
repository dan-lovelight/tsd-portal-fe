// Takes an error object, and a boolean that indicates if the error should be thrown again
// logError(*callingFunction*, arguments, err, Knack.getUserAttributes(), window.location.href, true)
async function logError(callerFunction, args, err, user, url, throwAgain) {

  let callerArgs = Array.prototype.slice.call(args) // Convert caller's arguements to an array
  let callerArgsNames = getParamNames(callerFunction) // Extract arguement variable names from function code
  let callerName = err.stack.split('\n')[1].trim().split(' ')[1].trim() // Get the name of the calling function from the Error stack

  // Build an error log entry, in this case for Slack
  let logMessage = `Error in *${callerName} (` + callerArgsNames.toString().replace(/,/g, ', ') + `)*:exclamation:\n`
  logMessage += '> *when*: ' + moment().format('LLLL') + '\n'
  logMessage += `> *user*: ${user.name} (${user.email})\n`
  logMessage += `> *url*: ${url} \n`
  for (var i = 0; i < callerArgs.length; ++i) {
    if (typeof callerArgsNames[i] === 'object' && callerArgsNames[i] !== null){ // Is the variable an object?
      // Put message in code bock if it's an object
      logMessage += `*${callerArgsNames[i]}*: ` + '```' + JSON.stringify(callerArgs[i]) + '```' + '\n'
    } else {
      logMessage += `> *${callerArgsNames[i]}*: ` + JSON.stringify(callerArgs[i]).slice(0,500) + '\n'
    }
  }
  logMessage += '```' + err.stack + '```'
  await updateLog(logMessage) // Send message to Slack
  if (throwAgain) throw err // Optionally propogate the error
}

// Used by logError. Takes a function and returns the names of it's parameters
function getParamNames(func) {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null)
    result = [];
  return result;
}

// Add an entry to the log
function updateLog(entry) {
  let url = 'https://hooks.zapier.com/hooks/catch/2107870/jdigp6/'
  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      log: entry
    })
  })
}

// Send webhook to Zapier
async function triggerZap(endPoint, dataObject, logEntry) {
  if (testEnv) endPoint = 'j5kcuf' // redirect the hook if just testing
  const zapierAccount = '2107870/'
  const rootURL = 'https://hooks.zapier.com/hooks/catch/'
  const url = rootURL + zapierAccount + endPoint
  const init = {
    method: 'POST',
    body: JSON.stringify(dataObject)
  }

  try {
    await fetch(url, init)
    await updateLog(':heavy_check_mark: ' + logEntry)
  } catch (err) {
    logError(triggerZap, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }
}
