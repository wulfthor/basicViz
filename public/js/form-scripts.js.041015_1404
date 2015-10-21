$("#contactForm").submit(function(event){
    // cancels the form submission
    event.preventDefault();
    submitForm();
});
var year ="";
function submitForm(){
    // Initiate Variables With Form Content
    var year = $("#year").val();
 
    $.ajax({
        type: "POST",
        url: "php/data.php",
        data: "year=" + year,
        success : function(text){
          formSuccess(text);
            if (text == "success"){
                formSuccess(text);
            }
        }
    });
}
function formSuccess(text){
  document.getElementById("vizbut").style.visibility = "visible"; 
  document.getElementById("allbut").style.visibility = "visible"; 
    $( "#msgSubmit" ).removeClass( "hidden" );
    $( "#msgyear" ).removeClass( "hidden" );
    var tmpTxt=text.split("@");
    $( "#msgSubmit" ).html( tmpTxt[0] );
    $( "#msgSubmit" ).val( tmpTxt[0] );
    $( "#msgyear" ).val(tmpTxt[1]);
    $( "#msgyear" ).html(tmpTxt[1]);
}
