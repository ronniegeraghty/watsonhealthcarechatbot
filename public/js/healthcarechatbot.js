// Example 1: sets up service wrapper, sends initial message, and
// receives response.

var prompt = require('prompt-sync')();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var patients = [{"perscriptions": {}, "FirstName": "John", "LastName":"Smith", "DOB": "1990-01-01", "Address": "1 Street Ln", "City": "Citytown", "PostCode": "01010", "PhoneNum": "7325551234", "Email": "email@gmail.com", "InsuranceCard": "1234567890", "UserID": "user1234"}];
var perscriptions = [];
var patientID=0;


// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: 'ac212786-17bb-4028-8829-cfe307a2474d', // replace with username from service key
  password: 'ehgfQ1Hl7KbH', // replace with password from service key
  path: { workspace_id: 'bb3d454d-3701-42cb-b6a2-d2e102410e9f' }, // replace with workspace ID
  version_date: '2016-07-26'
});


// Start conversation with empty message.
conversation.message({}, processResponse);

// Process the conversation response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  var endConversation = false;

  // Check for action flags.

  //LOGIN
  if (response.output.action === 'login'){
    if(response.output.patinetID > patients.length -1){
      console.log("Sorry that ID dose not exist. Please try again.");
      document.getElementById("demo").innerHTML = "Sorry that ID dose not exist. Please try again.";

    }
    patientID = response.output.patientID - 1;

  }
  //SHOW PERSCRIPTIONS
  else if (response.output.action === 'showPerscriptions') {
    var i;
    console.log('\nHere are your perscriptions:\n');
    document.getElementById("demo").innerHTML = "\nHere are your perscriptions:\n";
    for (i=0; i<perscriptions.length; i++){
      console.log(perscriptions[i].DrugName+ ":    Strength: "+perscriptions[i].Strength+"    Amount: "+perscriptions[i].Amount+"    Route: "+perscriptions[i].Route+"\n  Frequency: "+perscriptions[i].Frequency+"    Identifier: "+perscriptions[i].Identifier+"    Biomed Type: "+perscriptions[i].BiomedType+"\n  Start Date: "+perscriptions[i].StartDate+"    EndDate: "+perscriptions[i].EndDate+"\n\n");
      document.getElementById("demo").innerHTML = perscriptions[i].DrugName+ ":    Strength: "+perscriptions[i].Strength+"    Amount: "+perscriptions[i].Amount+"    Route: "+perscriptions[i].Route+"\n  Frequency: "+perscriptions[i].Frequency+"    Identifier: "+perscriptions[i].Identifier+"    Biomed Type: "+perscriptions[i].BiomedType+"\n  Start Date: "+perscriptions[i].StartDate+"    EndDate: "+perscriptions[i].EndDate+"\n\n";
    }
  //ADD PERSCRIPTION
  }else if (response.output.action === 'addPerscription'){
    perscriptions.push({"DrugName": response.output.DrugName, "Strength": response.output.Strength, "Amount": response.output.Amount, "Route": response.output.Route, "Frequency": response.output.Frequency, "Identifier": response.output.Identifier, "BiomedType": response.output.BiomedType, "StartDate": response.output.StartDate, "EndDate": response.output.EndDate });
    console.log("DrugName:"+response.output.DrugName);
    //ADD NEW PATIENT
  }else if(response.output.action === 'addNewPatient'){
    patients.push({"perscriptions":{}, "FirstName": response.output.FirstName, "LastName": response.output.LastName, "DOB": response.output.DOB, "Address": response.output.Address, "City": response.output.City, "PostCode": response.output.PostCode, "PhoneNum": response.output.PhoneNum, "Email": response.output.Email, "InsuranceCard": response.output.InsuranceCard, "UserID": response.output.UserID});
    console.log("Patient: "+patients[patients.length-1].FirstName+" "+patients[patients.length-1].LastName+" added.");
    patientID = patients.length-1;
    console.log("Your Patient ID is: "+patientID);
    //  SHOW PATIENT INFO
  }else if (response.output.action === 'showPatientInfo'){
    console.log("\nPATIENT INFO: \n\n  PatientID: "+patientID+"\n   Name: "+patients[patientID].FirstName+" "+patients[patientID].LastName+"    DOB: "+patients[patientID].DOB);
    console.log("\n   Address: "+patients[patientID].Address+" \n            "+patients[patientID].City+" \n            "+patients[patientID].PostCode);
    console.log("\n   Mobile Phone Number: "+patients[patientID].PhoneNum+"\n   Email: "+patients[patientID].Email+"\n   Insurance Card: "+patients[patientID].InsuranceCard+"\n   User ID: "+patients[patientID].UserID);

  //END CONVERSATION
  }else if (response.output.action === 'endConversation') {
    // User said goodbye, so we're done.
    console.log(response.output.text[0]);
    endConversation = true;
  } else {
    // Display the output from dialog, if any.
    if (response.output.text.length != 0) {
        console.log(response.output.text[0]);
    }
  }

  // If we're not done, prompt for the next round of input.
  if (!endConversation) {
    var newMessageFromUser = prompt('>> ');
    conversation.message({
      input: { text: newMessageFromUser },
      // Send back the context to maintain state.
      context : response.context,
    }, processResponse)
  }
}
