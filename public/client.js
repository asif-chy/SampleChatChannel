$( document ).ready(function() {
  
  /*global io*/
  var socket = io();

  $('form').submit(function(e){
    var messageToSend = $('#m').val();
    socket.emit('chat message', messageToSend);
     e.preventDefault();
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
  
  socket.on('user count', function(data){
    $('#num-users').text(data.currentUsers+' users online');
    var message = data.name;
    if(data.connected) {
      message += ' has joined the chat.';
    } else {
      message += ' has left the chat.';
    }
    $('#messages').append($('<li>').html('<b>'+ message +'</b>'));
  });
  
  socket.on('chat message', function(data){
    $('#messages').append($('<li>').text(data.name+': '+data.message));
  });
  
  socket.on('user', function(data){
  $('#num-users').text(data.currentUsers+' users online');
  var message = data.name;
  if(data.connected) {
    message += ' has joined the chat.';
  } else {
    message += ' has left the chat.';
  }
  $('#messages').append($('<li>').html('<b>'+ message +'<\/b>'));
});
  
});