// Text messages //
$(document).on('knack-scene-render.scene_487', function(event, scene) {
  // Get user/customer names
  let customerName = $('#view_980 div.kn-detail.field_692 span > span')[0].innerHTML
  let userName = Knack.getUserAttributes().name.split(' ')[0]
  $('#view_980 div.kn-detail.field_692').hide()

  // Update the quick select options
  let = $msgOptions = $("#kn-input-field_864 > div")
  let newMsg = $msgOptions[0].innerHTML.replace(/{{customer}}/g,customerName).replace(/{{user}}/g,userName)
  $msgOptions[0].innerHTML = newMsg

  // Add selected option to editable text area
  let = radioButton = $("#kn-input-field_864 > div label > input")
  radioButton.click(function(event){
    $('#field_861')[0].value = event.currentTarget.defaultValue
  })

});

// Sent text message
// FORM: https://builder.knack.com/lovelight/shutters#pages/scene_487/views/view_979
$(document).on('knack-form-submit.view_979', function(event, view, record) {
  sendText(record);
});

//Update customer's details in Drip
async function sendText(record) {

  let customer = await getRecordPromise('object_1',record.field_866_raw[0].id)
  let data = {};

  data.message = record.field_861_raw
  data.phone = record.field_863_raw.number
  data.email = customer.field_3_raw.email

  triggerZap("oobtr0t", data, "Send Text Message");

}

//******** Global changes *************//
// Change the way address input fields appear
$(document).on('knack-scene-render.any', function(event, scene) {

  $('.kn-input-address .control > label').remove()
  $('.kn-input-address .input[name="street"]').each((index, input) => {
    $(input)[0].placeholder = 'Street'
  })
  $('.kn-input-address .input[name="street2"]').each((index, input) => {
    $(input)[0].placeholder = 'Street'
  })
  $('.kn-input-address .input[name="city"]').each((index, input) => {
    $(input)[0].placeholder = 'Suburb'
  })
  $('.kn-input-address .input[name="state"]').each((index, input) => {
    $(input)[0].placeholder = 'State'
  })
  $('.kn-input-address .input[name="zip"]').each((index, input) => {
    $(input)[0].placeholder = 'Postcode'
  })

});

//******** Hide empty tables *************//
// If no items to action on the orders dashboard, hide the table
$(document).on('knack-scene-render.scene_168', function(event, scene) {
  hideEmptyTables(scene);
});

// Hide empty tables in the lead details form
$(document).on('knack-scene-render.scene_89', function(event, scene) {
  hideEmptyTables(scene);
});

// Hide empty tables in timeline form
$(document).on('knack-scene-render.scene_230', function(event, scene) {
  hideEmptyTables(scene);
});

// Hide empty tables in Process Order page
//https://builder.knack.com/lovelight/shutters#pages/scene_359
$(document).on('knack-scene-render.scene_359', function(event, scene) {
  hideEmptyTables(scene);
});

// Hide empty tables in Prepare Review page
//https://builder.knack.com/lovelight/shutters#pages/scene_365
$(document).on('knack-scene-render.scene_365', function(event, scene) {
  hideEmptyTables(scene);
});

// Hide empty tables in Customer Review page
//https://builder.knack.com/lovelight/shutters#pages/scene_366
$(document).on('knack-scene-render.scene_366', function(event, scene) {
  hideEmptyTables(scene);
});

// Hide empty tables in Wholesale new order page
https: //builder.knack.com/lovelight/shutters#pages/scene_434
  $(document).on('knack-scene-render.scene_434', function(event, scene) {
    hideEmptyTables(scene);
  });

// Hide empty tables in Review page
https: //builder.knack.com/lovelight/shutters#pages/scene_221
  $(document).on('knack-scene-render.scene_221', function(event, scene) {
    hideEmptyTables(scene);
  });

/**************************************************/
/**** Add functionality to shiping management page*/
/* https://apps.lovelight.com.au/shutters#ship/plan-shipment-orders
/**************************************************/

/**** Insert 'ADD to Shipment' checkboxes ****/
$(document).on('knack-view-render.view_340', function(event, view) {

  // Add an update button
  $('<button id="addToShipment"">Add To Shipment</button>').insertAfter($("#view_340 .view-header"));

  // Add checkboxes to our table
  addCheckboxes(view);

  // Click event for the update button
  $('#addToShipment').click(function() {

    // We need an array of record IDs
    var record_ids = [];

    // Populate the record IDs using all checked rows
    $('#' + view.key + ' tbody input[type=checkbox]:checked').each(function() {
      record_ids.push($(this).closest('tr').attr('id')); // record id
    });

    Knack.showSpinner();

    // Get the id of the shipment we want to link to orders
    var shipID = window.location.href
    shipID = shipID.split("/")
    shipID = shipID[5];

    var data = {
      field_148: shipID
    };

    // set the delay to prevent hitting API rate limit (milliseconds)
    var myDelay = 0;

    //call updateRecords function
    $(function() {
      updateRecords(record_ids.shift(), record_ids, data);
    });

    //How many records were selected?
    var selectedRecords = record_ids.length + 1

    function updateRecords(id, records, data) {

      $.ajax({
        url: 'https://api.knack.com/v1/pages/scene_466/views/view_932/records/' + id,
        type: 'PUT',
        headers: {
          'Authorization': Knack.getUserToken(),
          'X-Knack-Application-Id': Knack.application_id,
          'X-Knack-REST-API-KEY': 'knack',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
          if (record_ids.length > 0) {
            setTimeout(updateRecords(record_ids.shift(), record_ids, data), myDelay);
          } else {
            Knack.hideSpinner();
            Knack.views["view_340"].model.fetch();
            Knack.views["view_348"].model.fetch();
            Knack.views["view_349"].model.fetch();
          }
        }
      })
    }
  })
})

/**** Insert REMOVE to Shipment' checkboxes ****/
$(document).on('knack-view-render.view_348', function(event, view) {

  // Add an update button
  $('<button id="removeFromShipment"">Remove From Shipment</button>').insertAfter($("#view_348 .view-header"));

  // Add checkboxes to our table
  addCheckboxes(view);

  // Click event for the update button
  $('#removeFromShipment').click(function() {

    // We need an array of record IDs
    var record_ids = [];

    // Populate the record IDs using all checked rows
    $('#' + view.key + ' tbody input[type=checkbox]:checked').each(function() {
      record_ids.push($(this).closest('tr').attr('id'));
    });

    Knack.showSpinner();

    var data = {
      field_148: null
    };

    // set the delay to prevent hitting API rate limit (milliseconds)
    var myDelay = 0;

    //call updateRecords function
    $(function() {
      updateRecords(record_ids.shift(), record_ids, data);
    });

    function updateRecords(id, records, data) {

      $.ajax({
        url: 'https://api.knack.com/v1/pages/scene_466/views/view_932/records/' + id,
        type: 'PUT',
        headers: {
          'Authorization': Knack.getUserToken(),
          'X-Knack-Application-Id': Knack.application_id,
          'X-Knack-REST-API-KEY': 'knack',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
          if (record_ids.length > 0) {
            setTimeout(updateRecords(record_ids.shift(), record_ids, data), myDelay);
          } else {
            Knack.hideSpinner();
            Knack.views["view_340"].model.fetch();
            Knack.views["view_348"].model.fetch();
            Knack.views["view_349"].model.fetch();
          } //end if
        } //end success
      }) //end ajax
    } //end update function
  }) //end button click
}) //end


/********************************************************/
/**** Add functionality to Shutters Sample Page ****/
/********************************************************/

$(document).on('knack-view-render.view_477', function(event, view) {

  // Add an update button
  $('<div style="padding:15px 15px 15px 0px"><a id="sampleSent" class="kn-button">Mark Checked As Sent Today</a></div>').insertAfter($('#view_477 .view-header'));
  // Add button for webmerge
  $('#view_477 #sampleSent').after('<div style="padding:15px; display:inline"><a id="webmerge" class="kn-button">Email eParcel Consignment File</a></div>');
  // Add checkboxes to our table
  addCheckboxes(view);

  /********************************************/
  //***Click event for the mark sent button***//
  $('#sampleSent').click(function() {
    sendSampleNotifications(view)
  })

  function sendSampleNotifications(view) {
    Swal.fire({
        title: 'Are you sure?',
        html: "<span>We send SMS notifications using the requestors first name. Have you reviewed all selected names and made any necessary changes?</span>",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yep, schedule notifications!',
        showLoaderOnConfirm: true,
        preConfirm: updateSampleSentDate,
        allowOutsideClick: () => !Swal.isLoading()
      })
      .then((result) => {
        if (result.value) {
          refreshViews([view.key, 'view_486'])
          Swal.fire(
            'Records updated!',
            'Notifications will be sent on the next scheduled run.',
            'success'
          )
        }
      })

    async function updateSampleSentDate() {
      let recordIds = getCheckedRowRecordIds(view)
      let data = {
        field_454: moment().format("DD/MM/YYYY"),
        field_453: 'Sent'
      };
      try {
        for (i = 0; i < recordIds.length; i++) {
          Swal.getContent().querySelector('span').textContent = `Updating ${i + 1} of ${recordIds.length}`
          await updateRecordPromise('object_35', recordIds[i], data)
          // updateViewPromise(view.scene.key, view.key, recordIds[i], data)
        }
      } catch (err) {
        Swal.showValidationMessage(
          `Request failed: ${err}`
        )
      }
    }
  }

  /********************************************/
  //***Click event for the webmerge button***//
  $('#webmerge').click(function(event) {
    event.preventDefault();

    // get data
    var models = Knack.models['view_477'].data.models;
    var requests = [];
    var i = 0;

    //Loop through all checkboxes
    $('#' + view.key + ' tbody input[type=checkbox]').each(function() {

      //Add to data if checked
      if ($(this)[0].checked) {

        var address = models[i].attributes.field_451_raw.street.split(",").join("");
        var address1 = "";
        var address2 = "";
        var phone = "";

        //Is the address under the charater limit of 40?
        if (address.length <= 40) {
          address1 = address;
        }
        //If not, split - no need to manipulate if we split at a space
        else if (address.length > 40 && address.charAt(41) === ' ') {
          address1 = address.slice(0, 40);
          address2 = address.slice(41, address.length);
        }
        //Otherwise split at the nearest space
        else {
          address1 = address.slice(0, 40);
          address1 = address1.slice(0, address1.lastIndexOf(' '));
          address2 = address.slice(address1.length, address.length).trim();
        }

        if (models[i].attributes["field_448.field_5_raw"].number.length > 0) {
          phone = models[i].attributes["field_448.field_5_raw"].number;
        }

        requests.push({
          Name: models[i].attributes.field_2_raw.formatted_value,
          Email: models[i].attributes["field_448.field_3_raw"].email,
          Phone: phone,
          AddressLine1: address1,
          AddressLine2: address2,
          Suburb: models[i].attributes.field_451_raw.city,
          State: models[i].attributes.field_451_raw.state,
          Postcode: models[i].attributes.field_451_raw.zip

        });
      }
      //increment counter
      i++
    });

    //exit if nothing selected
    if (requests.length == 0) {
      alert('Select the sample requests you want to include');
      return;
    }

    Knack.showSpinner();

    $.ajax({
      url: 'https://www.webmerge.me/merge/176559/yr4wx3?test=1&no_queue=1', //
      data: {
        requests: requests
      },
      type: 'POST',
      success: function(data) {
        alert(JSON.stringify(data));
        Knack.hideSpinner();
      },
      error: function(jqxhr, status, exception) {
        alert('Exception:', exception);
        Knack.hideSpinner();
      }
    });
  });
})

/********************************************************/
/**** Add functionality to Blinds Sample Page ****/
/********************************************************/

$(document).on('knack-view-render.view_480', function(event, view) {

  // Add an update button
  $('<div style="padding:15px 15px 15px 0px"><a id="sampleSent" class="kn-button">Mark Checked As Sent Today</a></div>').insertAfter($('#view_480 .view-header'));

  // Add button for webmerge
  $('#view_480 #sampleSent').after('<div style="padding:15px; display:inline"><a id="webmerge" class="kn-button">Email Labels</a></div>');

  // Add checkboxes to our table
  addCheckboxes(view);

  // Click event for the update button
  //***Click event for the mark sent button***//
  $('#sampleSent').click(function() {
    sendSampleNotifications(view)
  })

  function sendSampleNotifications(view) {
    Swal.fire({
        title: 'Are you sure?',
        html: "<span>We send SMS notifications using the requestors first name. Have you reviewed all selected names and made any necessary changes?</span>",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yep, schedule notifications!',
        showLoaderOnConfirm: true,
        preConfirm: updateSampleSentDate,
        allowOutsideClick: () => !Swal.isLoading()
      })
      .then((result) => {
        if (result.value) {
          refreshViews([view.key])
          Swal.fire(
            'Records updated!',
            'Notifications will be sent on the next scheduled run.',
            'success'
          )
        }
      })

    async function updateSampleSentDate() {
      let recordIds = getCheckedRowRecordIds(view)
      let data = {
        field_454: moment().format("DD/MM/YYYY"),
        field_453: 'Sent'
      };
      try {
        for (i = 0; i < recordIds.length; i++) {
          Swal.getContent().querySelector('span').textContent = `Updating ${i + 1} of ${recordIds.length}`
          await updateRecordPromise('object_35', recordIds[i], data)
          // updateViewPromise(view.scene.key, view.key, recordIds[i], data)
        }
      } catch (err) {
        Swal.showValidationMessage(
          `Request failed: ${err}`
        )
      }
    }
  }

  // link hander: Print Report
  $('#webmerge').click(function(event) {
    event.preventDefault();

    // get data
    var models = Knack.models['view_480'].data.models;
    var requests = [];

    console.log(models);

    for (var i = 0; i < models.length; i++) {

      requests.push({
        Name: models[i].attributes.field_2_raw.formatted_value,
        Phone: models[i].attributes["field_448.field_5_raw"].number,
        Street: models[i].attributes.field_451_raw.street,
        Suburb: models[i].attributes.field_451_raw.city,
        State: models[i].attributes.field_451_raw.state,
        Postcode: models[i].attributes.field_451_raw.zip
      });
    }

    Knack.showSpinner();

    $.ajax({
      url: 'https://www.webmerge.me/merge/176500/782c6x?test=1&no_queue=1',
      data: {
        requests: requests
      },
      type: 'POST',
      success: function(data) {
        alert(JSON.stringify(data));
        Knack.hideSpinner();
      },
      error: function(jqxhr, status, exception) {
        alert('Exception:', exception);
        Knack.hideSpinner();
      }
    });
  });
})

//**************************************************************
//*************** UPDATE CUSTOMER NAME *************************
//**************************************************************

// Check customer's name after order submission
// FORM: https://builder.knack.com/lovelight/shutters#pages/scene_340/views/view_645
$(document).on('knack-form-submit.view_645', function(event, view, record) {
  updateName(record);
});

// Check customer's name after NEW order submission
// FORM: https://builder.knack.com/lovelight/shutters#pages/scene_368/views/view_722
$(document).on('knack-form-submit.view_722', function(event, view, record) {
  updateName(record);
});

// Check customer's name after update in order details form
// FORM: https://builder.knack.com/lovelight/shutters#pages/scene_279/views/view_512
$(document).on('knack-form-submit.view_512', function(event, view, record) {
  updateName(record);
});

//Update customer's details in Drip
function updateName(record) {

  var data = {};

  data.name = record.field_2;
  data.firstName = record.field_2_raw.first;
  data.lastName = record.field_2_raw.last;
  data.email = record.field_3_raw.email;

  triggerZap("qa2igy", data, "Update customer's name new");

}

//**************************************************************
//*************** ORDER DELIVERY *******************************
//**************************************************************

//Shutters Order Deliver page, catch button click
//https://apps.lovelight.com.au/shutters#deliver/
$(document).on('knack-scene-render.scene_213', function(event, scene) {

  var hasRecords = false;

  //Hide orders table and dispatch button if there are no orders.
  if (Knack.models['view_385'].data && Knack.models['view_385'].data.length < 1) {
    //Hide it
    $('#view_385').remove();
    $("#btnDispatch").remove();
  } else {
    hasRecords = true;
  }

  //Hide orders table and dispatch button if there are no orders.
  if (Knack.models['view_743'].data && Knack.models['view_743'].data.length < 1) {
    //Hide it
    $('#view_743').remove();
    $("#btnNotify").remove();
  } else {
    hasRecords = true;
  }

  if (hasRecords) {
    $('#missingOrdersExplanation').remove();
  }

  $("#btnDispatch").click(function() {
    Swal.fire({
        title: 'Dispatch check in progress',
        html: "A search is underway for recently 'Manifested' orders in Machship. If found, these orders will be moved to Dispatched Status.",
        type: 'success',
        onBeforeOpen: triggerZap('e32rsn', {
          "just": "do it"
        }, "Check for dispatched orders")
      })
  })

  $("#btnNotify").click(function() {
    Swal.fire({
        title: 'Are you sure?',
        html: "Send a STANDARD email and SMS notification to each of the below customers?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Do it!',
        preConfirm: triggerZap('ed8txc', {
          "just": "do it"
        }, "Send notifications"),
      })
      .then((result) => {
        if (result.value) {
          refreshViews([view.key])
          Swal.fire(
            'Notifications being sent!',
            'Email and SMS notifications are now being sent to all customers in the list below.',
            'success'
          )
        }
      })
  });

});

//Manual Order Dispatch
$(document).on('knack-form-submit.view_387', function(event, view, record) {

  var data = {}

  data.orderID = record.id;
  data.orderNumber = record.field_237;

  triggerZap('eds13n', data, "Check Machship for Order");
});

//Manual Notification
$(document).on('knack-form-submit.view_750', function(event, view, record) {

  var data = {}

  data.customer = record.field_57_raw["0"].id;
  data.order = record.id;
  data.trackingLink = record.field_653_raw.split('"')[1];

  triggerZap('gtvdqo', data, "Send Notification");
});

//**************************************************************
//*************** ORDER TRACKING *******************************
//**************************************************************

//Shutters Order Deliver page, catch button click
$(document).on('knack-scene-render.scene_370', function(event, scene) {

  $("#btnDeliver").click(function() {
    //Trigger Zap that checks for delivered orders in Machship
    Swal.fire("Delivery check in progress", "We're checking Machship for delivery status updates. Reload the page in a few minutes to see changes.", "success");
    triggerZap('etl00g', {
      "just": "do it"
    }, "Check for delivered orders");
  });
});


//**************************************************************
//*************** SALES BOT ************************************
//**************************************************************

//Samples push
$(document).on('knack-scene-render.scene_379', function(event, scene) {
  $("#btnSamplePush").click(function() {
    //Trigger Zap that sends email via ZD
    swal("Confirm", "Send sales push email to everyone on the list below?", "warning", {
        buttons: [true, "Do it!"]
      })
      .then((value) => {
        if (value) {
          swal("Emails being sent!", "Emails are now beling sent via Zendesk", "success");
          triggerZap('e1202q', {
            "just": "do it",
            "today": moment().format("DD/MM/YYYY")
          }, "Send sample push email");
        }
      });
  });
});

//**************************************************************
//*************** TRADE PARTNERS *******************************
//**************************************************************

// TPP Register or login
// https://www.shuttersdept.com.au/portal/
$(document).on('knack-scene-render.scene_418', function(event, scene) {
  // Centre the login/sign up buttons
  $("#view_825").css({
    'margin': '0 auto',
    'width': 'fit-content'
  })

  // Style buttons
  $(".view_825 .control").addClass("row--vcentre");
  $(".view_825 .control a").each((index, button) => {
    $(button)[0].classList.remove('kn-button', 'kn-link')
    $(button)[0].classList.add('button')
    $(button).css({
      'font-size': '1em'
    })
  })
  $('.view_825 a.kn-link-2').addClass("button--transparent")
  $('.view_825 a.kn-link-2').css({
    'color': '#0e0e22'
  })

  // Redirect logged in users from the TTP sign up page to the appropriate location
  let userDetails = Knack.getUserAttributes()
  if (userDetails !== 'No user found') {
    // User is logged in!
    if (userDetails.roles.includes('object_39')) {
      window.location.replace('https://www.shuttersdept.com.au/portal/#tp-dash/')
    }
  }


})

// ---------------------------------
// Trade partner sign up - create business form
$(document).on('knack-form-submit.view_826', function(event, view, record) {
  triggerZap("7wwrk1", record, "New Trade Partner Registration"); // Notify of new sign up
})

// ---------------------------------
// Accept T&Cs page
$(document).on('knack-form-submit.view_882', function(event, view, record) {

  // T&Cs have been accepted, time to complete the account setup
  const user = Knack.getUserAttributes()
  const log = 'T&Cs form submitted, zap triggered for ' + user.name

  const data = {
    'usersEmail': user.email,
    'usersName': user.name,
    'tradePartnerCompanyId': record.id,
    'deliveryContactName': record.field_500,
    'deliveryContactStreet': record.field_537_raw.street,
    'deliveryContactStreet2': record.field_537_raw.street2,
    'deliveryContactCity': record.field_537_raw.city,
    'deliveryContactState': record.field_537_raw.state,
    'deliveryContactZip': record.field_537_raw.zip,
    'deliveryContactEmail': record.field_539_raw.email,
    'deliveryContactPhone': record.field_538_raw
  }

  // Setup completed serverside:
  // > Add tradepartner company to order submitter role
  // > Create delivery contacts
  // > Link contact to trade patner
  // > Capture who signed T&Cs
  triggerZap('joparw', data, log)

})

// ---------------------------------
// Just created a new Trade Partner User record, and a Shutter Order Submitter Record via wholesale admin
// https://builder.knack.com/lovelight/shutters#pages/scene_337/views/view_642
$(document).on('knack-form-submit.view_642', function(event, view, record) {
  Knack.showSpinner
  linkOrderSubmitterToCompanyPromise(record.field_496_raw.email, record.field_501_raw[0].id)
  Knack.hideSpinner
})

// Updates an order submitter record with the passed email, by linking to the passed company
// User must have tradePartnerAdmin role
async function linkOrderSubmitterToCompanyPromise(userEmail, tradePartnerCompanyId) {

  let submittersFilter = {
    "match": "and",
    "rules": [{
      "field": "field_541",
      "operator": "contains",
      "value": userEmail,
      "field_name": "Personal Email"
    }]
  }

  try {
    let orderSubmitter = await filterViewPromise(335, 940, submittersFilter) // Find the Order Submitter Record
    let data = {
      'field_545': [tradePartnerCompanyId]
    }
    orderSubmitter = await updateViewPromise(472, 941, orderSubmitter[0].id, data) // Update with trade tradePartnerCompany
    return orderSubmitter
  } catch (err) {
    logError(linkOrderSubmitterToCompanyPromise, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }

}

// ---------------------------------
// Add a trade partner user form
$(document).on('knack-scene-render.scene_337', function(event, scene) {
  // Suggest a temporary password
  let password = generatePassword()
  document.getElementById('suggestedPassword').innerHTML = '<strong>Suggested:</strong> ' + password
})

// ---------------------------------
// Reset trade partner password form
$(document).on('knack-scene-render.scene_452', function(event, scene) {
  // Suggest a temporary password
  let password = generatePassword()
  document.getElementById('suggestedPassword').innerHTML = '<strong>Suggested:</strong> ' + password
})

// Reset trade partner password
$(document).on('knack-form-submit.view_898', function(event, view, record) {
  makeUserResetPassword(record.field_496_raw.email)
})

// Sets the password reset flag for the target users
// User must have tradePartnerAdmin role
async function makeUserResetPassword(userEmail) {

  let filter = {
    "match": "and",
    "rules": [{
      "field": "field_16",
      "operator": "is",
      "value": userEmail,
      "field_name": "Email"
    }]
  }

  try {
    let account = await filterViewPromise(335, 944, filter) // Find the account to be udpated
    let data = {
      'field_814': 'Yes'
    }
    account = await updateViewPromise(475, 946, account[0].id, data) // Update password reset to yes
    return account
  } catch (err) {
    logError(makeUserResetPassword, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }
}

// ---------------------------------
// New Order Page
$(document).on('knack-scene-render.scene_425', function(event, scene) {

  // Get the order number and name from the heading
  let orderNameDetails = $('.field_237 strong > span')[0].innerText.split('-')
  $('#orderIdPrompt')[0].innerText = orderNameDetails.shift()
  $('#orderNamePrompt')[0].innerText = orderNameDetails.join('-')

  // Move the order form image to the right place
  $('.view_875').appendTo($('#kn-input-field_312')).hide();

  // Create order form download buttons from files table
  $('.view_839 .kn-list-item-container').each((index, tableRow) => {
    let productName = $(tableRow).find('.kn-detail-body > span > span')[0].innerText
    let productID = $(tableRow).find('.kn-detail-body > span > span')[0].className
    let downloadLink = $(tableRow).find('.kn-detail-body > span > a')[0].href
    let dataFileName = $(tableRow).find('.kn-detail-body > span > a')[0].dataset.fileName
    let dataAssetID = $(tableRow).find('.kn-detail-body > span > a')[0].dataset.assetId
    let buttonID = getButtonIdFromUID(productID)
    let dataFieldKey = $(tableRow).find('.kn-detail-body > span > a')[0].dataset.fieldKey
    let button = `<div class="kn-list order-form" id="${buttonID}" style="margin-bottom:10px"><a class="kn-button kn-view-asset" data-field-key="${dataFieldKey}" data-asset-id="${dataAssetID}" data-file-name="${dataFileName}" href=${downloadLink}><i class="fa fa-download"></i>&nbsp;Download ${productName} Order Form</a></div>`

    $(button).appendTo($('#kn-input-field_312'));

  })

  // Remove the files table, we don't need it anymore
  $('.view_839').remove()

  // Only show the download button for the selected product
  let productSelected = $('#view_838-field_312').val()
  console.log('productionSelected', productSelected)
  toggleOrderForms(productSelected)

})

// New Order Form
$(document).on('knack-view-render.view_838', function(event, view) {
  $('#view_838-field_312').on('change', function() {
    let productSelected = $('#view_838-field_312').val()
    toggleOrderForms(productSelected)
  })
})

// Hide order form buttons that are not required
function toggleOrderForms(productID) {
  // Hide all forms if there's no selection
  if (productID === "") {
    $('.order-form').hide()
    $('.view_875').hide()
    return
  } else {
    $('.view_875').show()
  }

  // Otherwise, only show the selected order form
  let buttonID = getButtonIdFromUID(productID)
  $('.order-form').each((index, button) => {
    if ($(button)[0].id === buttonID) {
      $(button).show()
    } else {
      $(button).hide()
    }
  })
}

// Return an ID string that strips leading numbers
function getButtonIdFromUID(UID) {
  return UID.slice(UID.indexOf(UID.match(/[a-zA-Z]/).pop()) - UID.length)
}

// New TPP Order Submitted
$(document).on('knack-form-submit.view_838', function(event, view, record) {
  applyDiscountToOrder(record)
})

// Requires the user to have TradeParter role
async function applyDiscountToOrder(order) {
  try {
    let productID = order.field_312_raw[0].id
    let productDetails = await getViewRecordPromise(443, 870, productID) //There is a permissions issue here
    let listPrice = productDetails.field_802_raw
    let tradePartnerCompanyId = order.field_536_raw[0].id
    let tradePartnerAccountDetails = await getViewRecordPromise(443, 874, tradePartnerCompanyId) // This will need to change if discount is per product
    let discount = tradePartnerAccountDetails.field_787_raw
    let orderValue = order.field_117_raw * listPrice * (1 - discount) * 1.1
    let data = {
      'field_64': orderValue
    }
    let updatedOrder = await updateViewPromise(425, 947, order.id, data)
    // Create invoices line items here
    return updatedOrder
  } catch (err) {
    logError(applyDiscountToOrder, arguments, err, Knack.getUserAttributes(), window.location.href, true)
  }
}

// ---------------------------------
// Product & Pricing Page
$(document).on('knack-scene-render.scene_443', function(event, scene) {
  debugger
  let discount = $('.view_874 .field_787 .kn-detail-body span')[0].innerText.replace('%', '') / 100
  $('.view_870 .field_802 .col-2').each((index, listPriceCell) => {
    let listPrice = parseFloat($(listPriceCell)[0].innerText.replace('$', '')).toFixed(2)
    $(listPriceCell)[0].innerText = '$' + ((1 - discount) * listPrice).toFixed(2)
  })
})

// ---------------------------------
// Add a delivery contact
// https://builder.knack.com/lovelight/shutters#pages/scene_425/views/view_876
// https://builder.knack.com/lovelight/shutters#pages/scene_445/views/view_879
$(document).on('knack-form-submit.view_876', function(event, view, record) {
  linkContactToTradePartner(record)
})

// Find the logged in user's company.
function linkContactToTradePartner(record) {

  let tradePartnersUsersObject = 'object_39'
  let tradePartnersCompanyObject = 'object_40'
  let userDetails = Knack.getUserAttributes()



  Promise.resolve(userDetails)
    .then((user) => {
      // Find the newly create Order Submitter  user
      let tradePartnerFilter = {
        "match": "and",
        "rules": [{
          "field": "field_496",
          "operator": "is",
          "value": user.email,
          "field_name": "Email"
        }]
      }

      return getKnackDataUsingFilter(tradePartnersUsersObject, tradePartnerFilter)
    })
    .then((tradePartner) => {
      // Get the trade partner company from the trade partner user record
      let tradePartnerCompany = tradePartner[0].field_501_raw[0].id
      return getKnackRecordUsingId(tradePartnersCompanyObject, tradePartnerCompany)
    })
    .then((tradePartnerCompany) => {
      // Build an array of delivery contacts
      let deliveryContacts = []
      tradePartnerCompany.field_533_raw.forEach((deliveryContact) => {
        deliveryContacts.push(deliveryContact.id)
      })
      deliveryContacts.push(record.id)
      // Update the delivery contacts to include the newly created address
      return updateSingleRecordByID(tradePartnersCompanyObject, tradePartnerCompany.id, {
        'field_533': deliveryContacts
      })
    })
}

// *******************************************************
// Gift Vouchers
// *******************************************************

// ---------------------------------
// Create gift voucher
$(document).on('knack-form-submit.view_901', function(event, view, record) {

  let couponCode = generatePassword()
  let data = {
    'field_64': record.field_107_raw.replace(',', '') * 1 + record.field_836_raw.replace(',', '') * 1, // add voucher amount to delivery cost
    'field_56': 'GV' + record.field_76, // create an order ID
    'field_764': couponCode // create a coupon code
  }

  updateSingleRecordByID('object_8', record.id, data)

})

// ---------------------------------
// Edit gift voucher
$(document).on('knack-form-submit.view_925', function(event, view, record) {

  let data = {
    'field_64': record.field_107_raw.replace(',', '') * 1 + record.field_836_raw.replace(',', '') * 1, // add voucher amount to delivery cost
  }

  updateSingleRecordByID('object_8', record.id, data)

})

// ---------------------------------
// Confirmation of payment
$(document).on('knack-view-render.view_911', function(event, view, record) {

  // Get the complete record
  let fullRecord = getKnackRecordUsingId('object_8', record.id)

  fullRecord
    .then(order => {
      debugger
      let alreadyProcessed = order.field_57.length > 0
      let sendByEmail = order.field_830.indexOf('email') > 0
      let expiryDate = moment().add(1, 'years').format("DD/MM/YYYY")
      let data = {}

      if (alreadyProcessed) {
        return
      } // Do nothing, already updated

      // Get the user record to link to the order
      findOrCreateUserByEmail(order.field_831_raw.email, order.field_837_raw.first, order.field_837_raw.last)
        .then(user => {
          data.field_57 = [user.id]
          data.field_838 = expiryDate

          return updateSingleRecordByID('object_8', record.id, data)
        })
        .then(() => {
          // Send a notification
          return promise.All([sendHookToZapier('https://hooks.zapier.com/hooks/catch/2107870/j4ec0s/', order, 'Gift Notification'), sendHookToZapier('https://hooks.zapier.com/hooks/catch/2107870/jtivvs/', order, 'Create Invoice')])
        })
        .then(() => {
          let data = {
            'toName': order.field_832,
            'fromName': order.field_833,
            'messageBody': order.field_834,
            'amount': order.field_836,
            'couponCode': order.field_764,
            'expiryDate': expiryDate,
            'orderID': order.field_76,
            'recipientEmail': sendByEmail ? order.field_831_raw.email : 'dhzamlrn@mailparser.io', // The email does not send without a real email address, usually the mailparse eamil is just CC'd
            'id': order.id
          }

          return sendDataToWebmerge('235633/qt2we1', data, false) // Last paramter toggles test mode on/off. False is off
        })

    })
})

// Search for a user by email. Return if found, otherwise create them
function findOrCreateUserByEmail(email, firstName, lastName) {

  let userFilter = {
    "match": "and",
    "rules": [{
      "field": "field_3",
      "operator": "is",
      "value": email,
      "field_name": "Email"
    }]
  }

  return getKnackDataUsingFilter('object_1', userFilter)
    .then((user) => {

      // If found a user, return it
      if (user.length > 0) {
        return user[0]
      }

      let data = {
        'field_3': email,
        'field_2_raw': {
          'first': firstName,
          'last': lastName
        }

      }

      // Otherwise return a new record
      return createRecord('object_1', data)

    })
}


// *******************************************************
// Functions used for finding and returning Knack data
// *******************************************************

// Takes a knack obect name (eg object_1) and a properly formed filter
// Suggested use getKnackDataUsingFilter(returnKnackObjectNumber('job'),npsDueFilter)
// Returns a promise
function getKnackDataUsingFilter(object, filter) {
  let url = 'https://api.knack.com/v1/objects/' + object + '/records/'
  let search = '?rows_per_page=1000&filters=' + encodeURI(JSON.stringify(filter))
  url = url + search
  return fetch(url, {
      method: 'GET',
      headers: myKnackHeaders
    })
    .then(catchFetchErrors)
    .then((resp) => {
      return resp.json()
    })
    .then((json) => {
      return json.records
    })
}

// Takes a knack obect name (eg object_1) and a record id
// Suggested use getKnackRecordUsingId(returnKnackObjectNumber('job'),'5cbeb1cfe00d2d2edc4755cc')
// Returns a promise
function getKnackRecordUsingId(object, id) {
  let url = 'https://api.knack.com/v1/objects/' + object + '/records/' + id
  return fetch(url, {
      method: 'GET',
      headers: myKnackHeaders
    })
    .then(catchFetchErrors)
    .then((resp) => {
      return resp.json()
    })
}

// *******************************************************
// Functions that update data in Knack
// *******************************************************

// takes an object name (eg 'object_1'), a record ID and a data objects
// PUTs the data to update the record and returns the record
function updateSingleRecordByID(object, ID, data) {
  let init = {
    method: 'PUT',
    headers: myKnackHeaders,
    body: JSON.stringify(data)
  }
  let url = 'https://api.knackhq.com/v1/objects/' + object + '/records/' + ID
  return fetch(url, init)
    .then(catchFetchErrors)
    .then(response => {
      return response.json()
    })
}

// takes an object name (eg 'object_1') and a data object
// POSTs the data to create the record and returns the record
function createRecord(object, data) {
  let init = {
    method: 'POST',
    headers: myKnackHeaders,
    body: JSON.stringify(data)
  }
  let url = 'https://api.knackhq.com/v1/objects/' + object + '/records/'
  return fetch(url, init)
    .then(catchFetchErrors)
    .then(response => {
      return response.json()
    })
}

// *******************************************************
// Helper Functions
// *******************************************************

// Function that adds checkboxes to a view
var addCheckboxes = function(view) {
  // Add the checkbox to to the header to select/unselect all
  $('#' + view.key + '.kn-table thead tr').prepend('<th><input type="checkbox"></th>');
  $('#' + view.key + '.kn-table thead input').change(function() {
    $('.' + view.key + '.kn-table tbody tr input').each(function() {
      $(this).attr('checked', $('#' + view.key + '.kn-table thead input').attr('checked') != undefined);
    });
  });
  // Add a checkbox to each row in the table body
  $('#' + view.key + '.kn-table tbody tr').each(function() {
    $(this).prepend('<td><input type="checkbox"></td>');
  });
}

// Generic fetch error handling
// fetch does not error when a  call fails
function catchFetchErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

// Generate a suggested password
function generatePassword() {
  var length = 8,
    charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function hideEmptyTables(scene) {
  //Iterate throught eacy view in the page
  scene.views.map(function(view) {
    //If the view has row data (ie it's a table) AND that data is 0...
    if (Knack.models[view.key].data && Knack.models[view.key].data.length < 1) {
      //Hide it
      $('#' + view.key).remove();
    }
  });
}

//Send a hook to Zapier
function sendHookToZapier(url, data, description) {
  $.ajax({
    url: url,
    data: data,
    type: 'POST',
    success: function() {
      console.log('Zapier hook success: ' + description);
    }
  });
}

// Takes a document id and merge id in format 235633/qt2we1
// Sends data to webmerge
function sendDataToWebmerge(urlSlug, data, isTest) {

  let url = 'https://www.webmerge.me/merge/' + urlSlug + '?no_queue=1'
  if (isTest) {
    url += '&test=1'
  }

  $.ajax({
    url: url,
    data: data,
    type: 'POST',
    success: function(data) {},
    error: function(jqxhr, status, exception) {
      console.log(exception)
    }

  });
}

// ********** UNDER DEVELOPMENT

$(document).on('knack-view-render.view_481', function(event, view, data) {

  $('<div id="chart_div"></div><div id="chart_center"></div>').insertAfter($("#view_481"));

  google.charts.load("current", {
    packages: ["corechart"]
  });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Classification', 'Responses'],
      ['Promoters', 21],
      ['Neutrals', 1],
      ['Detractors', 1]
    ]);

    var options = {
      pieSliceText: 'none',
      pieHole: 0.5,
      slices: [{
        color: 'green'
      }, {
        color: 'orange'
      }, {
        color: 'red'
      }]
    };

    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);

    $('#chart_center').text('87');

  }

});
