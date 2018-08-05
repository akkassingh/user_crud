// var del = document.getElementById('delete')
// del.addEventListener('click', function () {
//   fetch('delete_user', {
//     method: 'delete',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       'name': null
//     })
//   })
//   .then(res => {
//     if (res.ok) return res.json()
//   }).
//   then(data => {
//     console.log(data)
//     window.location.reload()
//   })
// })

$('.delete').click(function() {
    id = this.id;
    console.log('id is '+id);
    $.ajax({
            type: 'POST',
            url: '/delete_user',
            method: 'delete',
            data: {"id":id},
            success: function(data){
                console.log('data is '+JSON.stringify(data));
                window.location.reload()
            },
            error: function(){
                alert('No data');
            }
        });
    });