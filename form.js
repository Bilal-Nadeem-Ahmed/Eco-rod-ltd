// Contact form: sends via Web3Forms, shows a clear sent / error state, tracks successful sends.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var result = document.getElementById('result');
  var button = form.querySelector('button[type="submit"]');
  var buttonText = button ? button.textContent : 'Submit';

  function showError(msg) {
    result.className = 'form-result form-result--error';
    result.textContent = msg;
    result.style.display = '';
  }

  function setSending(on) {
    if (!button) return;
    button.disabled = on;
    button.textContent = on ? 'Sending...' : buttonText;
  }

  function showSent() {
    var panel = document.createElement('div');
    panel.className = 'form-sent';
    panel.setAttribute('role', 'status');
    panel.setAttribute('tabindex', '-1');
    panel.innerHTML =
      '<i class="bi bi-check-circle-fill form-sent__icon" aria-hidden="true"></i>' +
      '<h3 class="form-sent__title">Thanks, your message has been sent</h3>' +
      '<p class="form-sent__text">We will get back to you as soon as we can. If it is urgent, call us on ' +
      '<a href="tel:+441158371711">0115 837 1711</a>.</p>' +
      '<button type="button" class="form-sent__again">Send another message</button>';

    form.reset();
    form.style.display = 'none';
    form.parentNode.insertBefore(panel, form.nextSibling);
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    panel.focus({ preventScroll: true });

    panel.querySelector('.form-sent__again').addEventListener('click', function () {
      panel.remove();
      result.textContent = '';
      result.className = '';
      form.style.display = '';
      setSending(false);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var botcheck = document.getElementById('botcheck');
    if (botcheck && botcheck.checked) {
      showError('Submission rejected.');
      return;
    }

    var formData = new FormData(form);
    if ((formData.get('message') || '').trim().length < 10) {
      showError('Please write a little more in your message (at least 10 characters).');
      return;
    }

    result.textContent = '';
    result.className = '';
    setSending(true);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (json) {
          if (response.status === 200) {
            if (window.ecoTrack) {
              window.ecoTrack('contact_form_submit', { form_id: 'contact-form' });
            } else {
              (window.dataLayer = window.dataLayer || []).push({ event: 'contact_form_submit', page_path: location.pathname });
            }
            showSent();
          } else {
            setSending(false);
            showError(json.message || 'Sorry, your message could not be sent. Please call us on 0115 837 1711.');
          }
        });
      })
      .catch(function () {
        setSending(false);
        showError('Sorry, your message could not be sent. Please check your connection or call us on 0115 837 1711.');
      });
  });
})();
