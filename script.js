// script.js - handles referral capture, date fill, submit to Google Apps Script and friendly messages
document.addEventListener('DOMContentLoaded', function(){
  // fill date hidden field
  const dateField = document.querySelector('input[name="date"]');
  if(dateField) dateField.value = new Date().toLocaleString();

  // capture ?ref= from URL
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const refInput = document.getElementById('referral');
  if(ref && refInput) refInput.value = ref;

  const form = document.getElementById('dataForm');
  const message = document.getElementById('message');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    message.textContent = '';
    // basic front-end validation (HTML also validates)
    const fullname = form.fullname.value.trim();
    const phone = form.phone.value.trim();
    const sim = form.sim_type.value;
    const state = form.state.value.trim();
    const address = form.address.value.trim();

    if(!fullname || !phone || !sim || !state || !address){
      message.textContent = 'Please fill in all required fields.';
      return;
    }

    // prepare payload
    const payload = {
      fullname: fullname,
      phone: phone,
      sim_type: sim,
      state: state,
      address: address,
      info: form.info.value.trim(),
      referral: form.referral.value.trim()
    };

    // submit as JSON
    fetch(form.action, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    })
    .then(response => response.text())
    .then(result => {
      if(result && result.toLowerCase().includes('success')){
        message.textContent = '✅ Thank you! Your request has been received successfully.';
        form.reset();
        // refill date after reset
        if(dateField) dateField.value = new Date().toLocaleString();
      } else {
        message.textContent = '⚠️ Submission failed. Please try again later.';
        console.warn('Apps Script response:', result);
      }
    })
    .catch(err => {
      message.textContent = '⚠️ There was a network error. Try again.';
      console.error(err);
    });
  });
});
