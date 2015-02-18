exports.addAppointment = function(cb) {
  if (typeof Windows != 'undefined') {
    var appointment = new Windows.ApplicationModel.Appointments.Appointment();

    appointment.allDay = true;
    appointment.startTime = new Date('2/16/2015');
    appointment.subject = 'Trip to Barcelona';

    Windows.ApplicationModel.Appointments.AppointmentManager.showAddAppointmentAsync(appointment, { x: 300, y: 0, width: 600, height: 100 })
      .done(function (appointmentId) {
        if (appointmentId) {
          console.log('created!');
          cb();
        } else {
          console.log('issue');
        }
      });
  } else {
    cb();
  }
}
exports.addContact = function(cb) {
  console.log('plugin: addContact');
  if(typeof Windows != 'undefined') {
    // Create the picker 
    var picker = new Windows.ApplicationModel.Contacts.ContactPicker(); 
    picker.desiredFieldsWithContactFieldType.append(Windows.ApplicationModel.Contacts.ContactFieldType.email);
    // Open the picker for the user to select a contact 
    picker.pickContactAsync().done(function (contact) { 
      if (contact !== null) { 
        var name = "Selected contact:\n" + contact.displayName; 
        console.log(name);
        var thumbnail = URL.createObjectURL(contact.thumbnail, { oneTimeOnly: true }); 
        var picture = document.createElement("image");
        picture.src = thumbnail;
        cb(name, picture);
      } else { 
        // The picker was dismissed without selecting a contact 
        console("No contact was selected");
        cb(null, "No contact was selected"); 
      } 
      
    });
  } else {
    console.log("ERROR: No Windows namespace was detected");  
    cb(null, "No Windows namespace was detected");
  }
}
exports.showToast = function(message) {
  // Log the message to the console
  console.log("OUTPUT: " + message);

  if(typeof Windows != 'undefined') {
    //Error detection
    // var text = document.createTextNode("Calling the notifications")
    // document.body.appendChild(text);
    // Log to the console
    var notifications = Windows.UI.Notifications;
    //Get the XML template where the notification content will be suplied
    var template = notifications.ToastTemplateType.toastImageAndText01;
    var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
    //Supply the text to the XML content
    var toastTextElements = toastXml.getElementsByTagName("text");
    toastTextElements[0].appendChild(toastXml.createTextNode(message));
    //Supply an image for the notification
    var toastImageElements = toastXml.getElementsByTagName("image");
    //Set the image this could be the background of the note, get the image from the web
    toastImageElements[0].setAttribute("src", "https://raw.githubusercontent.com/seksenov/grouppost/master/images/logo.png");
    toastImageElements[0].setAttribute("alt", "red graphic");
    //Specify a long duration
    var toastNode = toastXml.selectSingleNode("/toast");
    toastNode.setAttribute("duration", "long");
    //Specify the audio for the toast notification
    var toastNode = toastXml.selectSingleNode("/toast");                        
    var audio = toastXml.createElement("audio");
    audio.setAttribute("src", "ms-winsoundevent:Notification.IM");
    //Specify launch paramater
    toastXml.selectSingleNode("/toast").setAttribute("launch", '{"type":"toast","param1":"12345","param2":"67890"}');
    //Create a toast notification based on the specified XML
    var toast = new notifications.ToastNotification(toastXml);
    //Send the toast notification
    var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
    toastNotifier.show(toast);

  } else {
    //TODO: Fallback to website functionality
    console.log("ERROR: No Windows namespace was detected");
  }

}