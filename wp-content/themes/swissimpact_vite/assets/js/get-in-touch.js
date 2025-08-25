var get_in_touch_button = document.querySelector(".email-submit");
var get_in_touch_input_email = document.querySelector(
  'input[name="input-email"]'
);

get_in_touch_button.addEventListener("click", function (ev) {
  var email_input_val = get_in_touch_input_email.value;
  if (!isValidEmail(email_input_val)) {
    get_in_touch_input_email.classList.add("invalid");
    return;
  }

  get_in_touch_input_email.classList.remove("invalid");

  
});

const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
