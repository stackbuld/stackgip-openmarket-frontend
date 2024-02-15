function test(id, key, user) {
  const dateString = user.dateOfBirth;
  const dateObject = new Date(dateString);

  const formatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  const newDate = dateObject.toLocaleDateString("en-CA", formatOptions);

  const options = {
    app_id: id, //your app_id here
    p_key: key, //your production public key here
    type: "custom",
    user_data: {
      first_name: user.firstName, //optional
      last_name: user.lastName, //optional
      dob: newDate ?? "", //YYYY-MM-DD Optional
      residence_country: user.alpha2CountryCode, //optional
      email: user.email, //optional
    },
    reference_id: user.verificationReferenceNumber,
    metadata: {
      user_id: user.id,
    },
    gov_data: {
      nin: user.idVerificationNumber,
    },

    config: {
      widget_id: "65baf9e6cd21f60040595585", //this is generated from easyonboard
    },
    onSuccess: function (response) {
      alert(response.message);
      window.location.reload();
      console.log("Success", response);
    },
    onError: function (err) {
      console.log("Error", err);
    },
    onClose: function () {
      console.log("Widget closed");
    },
  };

  const connect = new Connect(options);
  connect.setup();
  connect.open();
}
