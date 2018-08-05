var update = document.getElementById('update');

update.addEventListener('click', function () {
	console.log('i  am called')
  // Send PUT Request here
  fetch('update_user', {
  method: 'put',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    'first_name': 'Babu',
    'last_name': ' ji',
    'email': 'babuji@sanskari.com'
  })
})
  .then(res => {
  if (res.ok) return res.json()
})
.then(data => {
  console.log(data)
  window.location.reload(true)
})
})