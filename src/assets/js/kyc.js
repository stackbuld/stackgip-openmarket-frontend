// import { environment } from "../../environments/environment";

function test(id, key) {
  console.log(id);
  const options = {
    app_id: id, //your app_id here
    p_key: key, //your production public key here
    type: "custom",
    user_data: {
      first_name: "precious", //optional
      last_name: "iyeritufu", //optional
      dob: "1997-04-10", //YYYY-MM-DD Optional
      residence_country: "NG", //optional
      email: "iyeritufu@gmail.com", //optional
    },
    reference_id: "12345678_user",
    metadata: {
      user_id: "12345678_user",
    },
    gov_data: {
      nin: "68481249264",
    },

    config: {
      widget_id: "65baf9e6cd21f60040595585", //this is generated from easyonboard
    },
    onSuccess: function (response) {
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
  // const button = document.querySelector("#button-connect");
  // button.addEventListener("click", function () {
  //   connect.setup();
  //   connect.open();
  // });
}
