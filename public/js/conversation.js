// The ConversationPanel module is designed to handle
// all display and behaviors of the conversation column of the app.
/* eslint no-unused-vars: "off" */
/* global Api: true, Common: true*/
var patinetID;
var patientIDFull;
var patientInfo;
var patientPerscriptions;
var addNewPatientInfo ='';




$.getJSON( "http://ip.jsontest.com/", function( json ) {
  console.log( "JSON Data: " + JSON.stringify(json) );
 });
function getPatientInfo(patientIDFull){
  $.ajax({
    url: "https://zserveros.centers.ihost.com:19026/healthcare/Patients/"+patientIDFull,
    type: "GET",
    async: true,
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic Sm9objpqb2hucHdk');
    },
    success: function (response, status) {
      // success code here
      console.log("IN SUCCESS");
      console.log("STATUS: "+status);
      console.log("RESPONSE: "+JSON.stringify(response));
      patientInfo = response;
    },
    failure: function (response, status) {
      // failure code here
      console.log("IN FAILURE");
      console.log("STATUS: "+status);

    },
    complete: function (xhr, status) {
      // on complete code here
      console.log("IN COMPLETE");
      console.log("STATUS: "+status);
    }
  });
  //get perscriptions
  // $.ajax({
  //   url: "https://zserveros.centers.ihost.com:19026/healthcare/medications/"+patientIDFull,
  //   type: "GET",
  //   async: true,
  //   dataType: "json",
  //   beforeSend: function (xhr) {
  //     xhr.setRequestHeader('Authorization', 'Basic Sm9objpqb2hucHdk');
  //   },
  //   success: function (response, status) {
  //     // success code here
  //     console.log("IN SUCCESS");
  //     console.log("STATUS: "+status);
  //     console.log("RESPONSE: "+JSON.stringify(response));
  //     patientPerscriptions = response;
  //   },
  //   failure: function (response, status) {
  //     // failure code here
  //     console.log("IN FAILURE");
  //     console.log("STATUS: "+status);
  //
  //   },
  //   complete: function (xhr, status) {
  //     // on complete code here
  //     console.log("IN COMPLETE");
  //     console.log("STATUS: "+status);
  //   }
  // });
}

function login(patientID){
  patientIDFull = "";
  patientID = patientID.toString();
  if(patientID.length<10){
    var dif = 10 - patientID.length;
    var zero="0";
    var i;
    for(i=0; i<dif; i++){
      patientIDFull = patientIDFull.concat(zero);
    }
    patientIDFull = patientIDFull.concat(patientID);
  }
  console.log("patientIDFull: "+patientIDFull);
  getPatientInfo(patientIDFull);
}

function showPatientInfo(newPayload){
  var pIshortcut = patientInfo.HCP1BI01OperationResponse.ca_patient_request;
  var addInfo = "\nPATIENT INFO: \n\n  PatientID: "+patientInfo.HCP1BI01OperationResponse.ca_patient_id+"\n   Name: "+pIshortcut.ca_first_name+" "+pIshortcut.ca_last_name+"    DOB: "+pIshortcut.ca_dob+"\n   Address: "+pIshortcut.ca_address+" \n            "+pIshortcut.ca_city+" \n            "+pIshortcut.ca_postcode+"\n   Mobile Phone Number: "+pIshortcut.ca_phone_mobile+"\n   Email: "+pIshortcut.ca_email_address+"\n   Insurance Card: "+pIshortcut.ca_ins_card_num+"\n   User ID: "+pIshortcut.ca_userid;
  var temp = newPayload.output.text[0];
  console.log(addInfo);
  console.log(temp);
  addInfo = addInfo.concat("\n\n"+temp);
  console.log(addInfo);
  //newPayload.output.text[0] = addInfo;
  newPayload.output.text[0] = "PatientID: "+patientInfo.HCP1BI01OperationResponse.ca_patient_id;
  newPayload.output.text[1] = "-Name: "+pIshortcut.ca_first_name+" "+pIshortcut.ca_last_name;
  newPayload.output.text[2] = "-Date of Birth: "+pIshortcut.ca_dob;
  newPayload.output.text[3] = "-Address: "+pIshortcut.ca_address+", \n            "+pIshortcut.ca_city+" \n            "+pIshortcut.ca_postcode;
  newPayload.output.text[4] = "-Mobile Phone Number: "+pIshortcut.ca_phone_mobile;
  newPayload.output.text[5] = "-Email: "+pIshortcut.ca_email_address;
  newPayload.output.text[6] = "-Insurance Card: "+pIshortcut.ca_ins_card_nu;
  newPayload.output.text[7] = "-User ID: "+pIshortcut.ca_userid;
  newPayload.output.text[8] = " ";
  newPayload.output.text[9] = temp;


  return newPayload;
}

function showPerscriptions(newPayload){
  $.ajax({
    url: "https://zserveros.centers.ihost.com:19026/healthcare/medications/"+patientIDFull,
    type: "GET",
    async: true,
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic Sm9objpqb2hucHdk');
    },
    success: function (response, status) {
      // success code here
      console.log("IN SUCCESS");
      console.log("STATUS: "+status);
      console.log("RESPONSE: "+JSON.stringify(response));
      patientPerscriptions = response;
    },
    failure: function (response, status) {
      // failure code here
      console.log("IN FAILURE");
      console.log("STATUS: "+status);

    },
    complete: function (xhr, status) {
      // on complete code here
      console.log("IN COMPLETE");
      console.log("STATUS: "+status);
    }
  });

  //add perscriptions to payload
  var pIshortcut = patientPerscriptions.HCM1BI01OperationResponse.ca_list_medication_request.ca_medications;
  var temp = newPayload.output.text[0];
  console.log("Conversation Response: "+temp);
  var outputIndex = 1;
  if(pIshortcut.length<1){
    newPayload.output.text[0] = "There are no perscriptions.";
  }
  else{
    newPayload.output.text[0] = "PERSCRIPTIONS:"
    var index;
    for(index = 0; index<pIshortcut.length; index++){
      console.log("OUTPUTINDEX: "+outputIndex+"   INDEX: "+index);
      newPayload.output.text[outputIndex] = "===========================";
      outputIndex++;
      newPayload.output.text[outputIndex] = "-Drug: "+pIshortcut[index].ca_drug_name;
      outputIndex++;
      newPayload.output.text[outputIndex] = "--Strength: "+pIshortcut[index].ca_strength;
      outputIndex++;
      newPayload.output.text[outputIndex] = "--Frequency: "+pIshortcut[index].ca_frequency;
      outputIndex++;
      newPayload.output.text[outputIndex] = "--Route: "+pIshortcut[index].ca_route;
      outputIndex++;
      newPayload.output.text[outputIndex] = "--Amount: "+pIshortcut[index].ca_amount;
      outputIndex++;
      newPayload.output.text[outputIndex] = "--Type: "+pIshortcut[index].ca_type;
      outputIndex++;
      newPayload.output.text[outputIndex] = "--Identifier: "+pIshortcut[index].ca_identifier;
      outputIndex++;
      newPayload.output.text[outputIndex] = "--Medication ID: "+pIshortcut[index].ca_medication_id;
      outputIndex++;
    }
    //newPayload.output.text[0] = addInfo;
    newPayload.output.text[outputIndex] = "===========================";
    outputIndex++;
  }
  newPayload.output.text[outputIndex] = temp;
  return newPayload;
}

function addNewPatient(newPayload){
  console.log("NEwPAYLOAD.OUTPUT: "+JSON.stringify(newPayload.output));
  //format JSON
  addNewPatientInfo = '{'+
    '"HCP1BA01Operation":'+
      '{'+
          '"ca_request_id":"01APAT",'+
          '"ca_return_code":"00",'+
          '"ca_patient_id":"0000000000",'+
          '"ca_patient_request":'+
          '{'+
              '"ca_ins_card_num":"'+newPayload.output.InsuranceCard+'",'+
              '"ca_first_name":"'+newPayload.output.FirstName+'",'+
              '"ca_last_name":"'+newPayload.output.LastName+'",'+
              '"ca_dob":"'+newPayload.output.DOB+'",'+
              '"ca_address":"'+newPayload.output.Address+'",'+
              '"ca_city":"'+newPayload.output.City+'",'+
              '"ca_postcode":"'+newPayload.output.PostCode+'",'+
              '"ca_phone_mobile":"'+newPayload.output.PhoneNum+'",'+
              '"ca_email_address":"'+newPayload.output.Email+'",'+
              '"ca_userid":"'+newPayload.output.UserID+'",'+
              '"ca_additional_data":""'+
          '}'+
       '}'+
  '}';
  console.log("ADD NEW PATIENT INFO: "+addNewPatientInfo);
  // do post
  addNewPatientInfo = JSON.parse(addNewPatientInfo);
  $.ajax({
    url: "https://zserveros.centers.ihost.com:19026/healthcare/add",
    type: "POST",
    async: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    data: JSON.stringify(addNewPatientInfo),
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic Sm9objpqb2hucHdk');
    },
    success: function (response, status) {
      // success code here
      console.log("IN SUCCESS");
      console.log("STATUS: "+status);
      patientID = response.HCP1BA01OperationResponse.ca_patient_id;
      console.log("NEW PATIENT ID: "+patientID);
      login(patientID);
      var temp = newPayload.output.text[1];
      newPayload.output.text[1] = "Your new patient ID is: "+patientID;
      newPayload.output.text[2] = temp;
    },
    failure: function (response, status) {
      // failure code here
      console.log("IN FAILURE");
      console.log("STATUS: "+status);

    },
    complete: function (xhr, status) {
      // on complete code here
      console.log("IN COMPLETE");
      console.log("STATUS: "+status);
    }
  });




}

var ConversationPanel = (function() {
  var settings = {
    selectors: {
      chatBox: '#scrollingChat',
      fromUser: '.from-user',
      fromWatson: '.from-watson',
      latest: '.latest'
    },
    authorTypes: {
      user: 'user',
      watson: 'watson'
    }
  };

  // Publicly accessible methods defined
  return {
    init: init,
    inputKeyDown: inputKeyDown
  };

  // Initialize the module
  function init() {
    chatUpdateSetup();
    Api.sendRequest( '', null );
    setupInputBox();
  }
  // Set up callbacks on payload setters in Api module
  // This causes the displayMessage function to be called when messages are sent / received
  function chatUpdateSetup() {
    var currentRequestPayloadSetter = Api.setRequestPayload;
    Api.setRequestPayload = function(newPayloadStr) {
      currentRequestPayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.user);
    };

    var currentResponsePayloadSetter = Api.setResponsePayload;
    Api.setResponsePayload = function(newPayloadStr) {
      currentResponsePayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.watson);
    };
  }

// Set up the input box to underline text as it is typed
  // This is done by creating a hidden dummy version of the input box that
  // is used to determine what the width of the input text should be.
  // This value is then used to set the new width of the visible input box.
  function setupInputBox() {
    var input = document.getElementById('textInput');
    var dummy = document.getElementById('textInputDummy');
    var minFontSize = 14;
    var maxFontSize = 16;
    var minPadding = 4;
    var maxPadding = 6;

    // If no dummy input box exists, create one
    if (dummy === null) {
      var dummyJson = {
        'tagName': 'div',
        'attributes': [{
          'name': 'id',
          'value': 'textInputDummy'
        }]
      };

      dummy = Common.buildDomElement(dummyJson);
      document.body.appendChild(dummy);
    }

    function adjustInput() {
      if (input.value === '') {
        // If the input box is empty, remove the underline
        input.classList.remove('underline');
        input.setAttribute('style', 'width:' + '100%');
        input.style.width = '100%';
      } else {
        // otherwise, adjust the dummy text to match, and then set the width of
        // the visible input box to match it (thus extending the underline)
        input.classList.add('underline');
        var txtNode = document.createTextNode(input.value);
        ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height',
          'text-transform', 'letter-spacing'].forEach(function(index) {
            dummy.style[index] = window.getComputedStyle(input, null).getPropertyValue(index);
          });
        dummy.textContent = txtNode.textContent;

        var padding = 0;
        var htmlElem = document.getElementsByTagName('html')[0];
        var currentFontSize = parseInt(window.getComputedStyle(htmlElem, null).getPropertyValue('font-size'), 10);
        if (currentFontSize) {
          padding = Math.floor((currentFontSize - minFontSize) / (maxFontSize - minFontSize)
            * (maxPadding - minPadding) + minPadding);
        } else {
          padding = maxPadding;
        }

        var widthValue = ( dummy.offsetWidth + padding) + 'px';
        input.setAttribute('style', 'width:' + widthValue);
        input.style.width = widthValue;
      }
    }

    // Any time the input changes, or the window resizes, adjust the size of the input box
    input.addEventListener('input', adjustInput);
    window.addEventListener('resize', adjustInput);

    // Trigger the input event once to set up the input box and dummy element
    Common.fireEvent(input, 'input');
  }

  // Display a user or Watson message that has just been sent/received
  function displayMessage(newPayload, typeValue) {
    var isUser = isUserMessage(typeValue);
    console.log("User: "+isUser);
    //console.log("newPayload: "+JSON.stringify(newPayload));
    if(isUser === false){
      //console.log("IN THE IF");
      if(newPayload.output.action === 'login'){
        console.log("IN LOGIN");
        login(newPayload.output.patientID);
        //console.log("Patient INFO: "+JSON.stringify(patientInfo));
      }
      else if(newPayload.output.action === 'showPatientInfo'){
        console.log("IN SHOW PATIENT INFO");
        newPayload = showPatientInfo(newPayload);
      }
      else if(newPayload.output.action === 'showPerscriptions'){
        console.log("IN SHOW PERSCRIPTIONS");
        newPayload = showPerscriptions(newPayload);
      }
      else if(newPayload.output.action === 'addNewPatient'){
        console.log("IN ADD PATIENT");
        addNewPatient(newPayload);

      }
    }
    var textExists = (newPayload.input && newPayload.input.text)
      || (newPayload.output && newPayload.output.text);
    if (isUser !== null && textExists) {
      // Create new message DOM element
      var messageDivs = buildMessageDomElements(newPayload, isUser);
      var chatBoxElement = document.querySelector(settings.selectors.chatBox);
      var previousLatest = chatBoxElement.querySelectorAll((isUser
              ? settings.selectors.fromUser : settings.selectors.fromWatson)
              + settings.selectors.latest);
      // Previous "latest" message is no longer the most recent
      if (previousLatest) {
        Common.listForEach(previousLatest, function(element) {
          element.classList.remove('latest');
        });
      }

      messageDivs.forEach(function(currentDiv) {
        chatBoxElement.appendChild(currentDiv);
        // Class to start fade in animation
        currentDiv.classList.add('load');
      });
      // Move chat to the most recent messages when new messages are added
      scrollToChatBottom();
    }
  }

  // Checks if the given typeValue matches with the user "name", the Watson "name", or neither
  // Returns true if user, false if Watson, and null if neither
  // Used to keep track of whether a message was from the user or Watson
  function isUserMessage(typeValue) {
    if (typeValue === settings.authorTypes.user) {
      return true;
    } else if (typeValue === settings.authorTypes.watson) {
      return false;
    }
    return null;
  }

  // Constructs new DOM element from a message payload
  function buildMessageDomElements(newPayload, isUser) {
    var textArray = isUser ? newPayload.input.text : newPayload.output.text;
    if (Object.prototype.toString.call( textArray ) !== '[object Array]') {
      textArray = [textArray];
    }
    var messageArray = [];

    textArray.forEach(function(currentText) {
      if (currentText) {
        var messageJson = {
          // <div class='segments'>
          'tagName': 'div',
          'classNames': ['segments'],
          'children': [{
            // <div class='from-user/from-watson latest'>
            'tagName': 'div',
            'classNames': [(isUser ? 'from-user' : 'from-watson'), 'latest', ((messageArray.length === 0) ? 'top' : 'sub')],
            'children': [{
              // <div class='message-inner'>
              'tagName': 'div',
              'classNames': ['message-inner'],
              'children': [{
                // <p>{messageText}</p>
                'tagName': 'p',
                'text': currentText
              }]
            }]
          }]
        };
        messageArray.push(Common.buildDomElement(messageJson));
      }
    });

    return messageArray;
  }

  // Scroll to the bottom of the chat window (to the most recent messages)
  // Note: this method will bring the most recent user message into view,
  //   even if the most recent message is from Watson.
  //   This is done so that the "context" of the conversation is maintained in the view,
  //   even if the Watson message is long.
  function scrollToChatBottom() {
    var scrollingChat = document.querySelector('#scrollingChat');

    // Scroll to the latest message sent by the user
    var scrollEl = scrollingChat.querySelector(settings.selectors.fromUser
            + settings.selectors.latest);
    if (scrollEl) {
      scrollingChat.scrollTop = scrollEl.offsetTop;
    }
  }

  // Handles the submission of input
  function inputKeyDown(event, inputBox) {
    // Submit on enter key, dis-allowing blank messages
    if (event.keyCode === 13 && inputBox.value) {
      // Retrieve the context from the previous server response
      var context;
      var latestResponse = Api.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
      }

      // Send the user message
      Api.sendRequest(inputBox.value, context);

      // Clear input box for further messages
      inputBox.value = '';
      Common.fireEvent(inputBox, 'input');
    }
  }
}());
