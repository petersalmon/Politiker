
var scriptType = $('#script-type').val();

$( document ).ready(function() {
    $('#new-script-form').attr("action","/Politiker/scripts/" + scriptType);
});

// Show additional edit options when edit mode switch on
$('#edit-mode-switch').change(function() {
    if($('#edit-mode-switch').is(':checked')) {
        $('.edit-script-icon').css('display','block');
        $('.delete-script-icon').css('display','block');
        $('.single-right-button').css('display','block');
    }
    else{
        $('.edit-script-icon').css('display','none');
        $('.delete-script-icon').css('display','none');
        $('.single-right-button').css('display','none');
    }
});

// Table search funciton
var $rows = $('table tbody tr');
$('#camp-search').keyup(function() {
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    
    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

// Pop-ups

function addPopup(msg, delay, feel){
    $(".alert-modal").append('<div class="alert non-animated ' + feel + 
                             '"><i class="icon-notification fa fa-bell feel"></i><span>' + msg + 
                             '</span><i class="fa fa-times icon-delete"></i></div>');
    $(".non-animated").animate({bottom: "0"});
    $(".non-animated").removeClass(".non-animated")
        .delay(2000).fadeOut(function(){
            $(this).remove();
        });
    if($(".alert-modal .alert").length > 1){
        $(".alert-modal .alert").eq(0).remove();
    }
}

$(document).on("click", ".alert-modal .alert", function(){
    $(this).stop(false, true);
});

$("#save-camp-btn").click(function(){
    addPopup("Campaign has been saved!", 2000, "success");
});

// Alerts

function addAlert(msg, feel){
    $(".confirm-modal").append('<div class="confirm non-animated ' + feel + 
                             '"><span>' + msg + '<br><div class="btns"><button type="button" id="confirm-btn">Confirm</button>' + 
                             '<button type="button" id="cancel-btn">Cancel</button></div>' + 
                             '</span><i class="fa fa-times icon-delete"></i></div>');
    if($(".confirm-modal .confirm").length > 1){
        $(".confirm-modal .confirm").eq(0).remove();
    }
    var response = false;
    return response;
}

function confirmScriptDelete(id){
    var msg = "Are you sure you want to delete this script?<br>This action can not be undone"
    addAlert(msg, "warning");
    $(".confirm-modal #cancel-btn").on("click", function(){
        $(".confirm-modal .confirm").remove();
    });
    $('.confirm-modal #confirm-btn').on('click', function(){
        $(".confirm-modal .confirm").remove();
        $('#delete-script-form-' + id).submit();
    });
}

// Accordian

document.querySelectorAll('.accordian-button').forEach(function(button) {
    button.addEventListener('click', function(){

        button.classList.toggle('accordian-button-active');
        
    });
});

// Edit upon icon click
$(".edit-script-icon").click(function(e) {
    e.stopPropagation();
    $('#editScriptModal').modal('show');
    var scriptId = $(e.target).parent().find('.script-id')[0].innerHTML;
    var title = $('#' + scriptId + '-title')[0].innerHTML;
    var creator = $('#' + scriptId + '-creator')[0].innerHTML;
    var content = $('#' + scriptId + '-content')[0].innerHTML;

    $('#idBox').val(scriptId);
    $('#editTitleBox').val(title);
    $('#editAuthorBox').val(creator);
    $('#editContentBox').val(content);

    $('#edit-script-form').attr("action","/Politiker/scripts/" + scriptType + "/" + scriptId +  "?_method=PUT")
});

// Delete upon icon click
$(".delete-script-icon").click(function(e) {
    e.stopPropagation();
    var scriptId = $(e.target).parent().find('.script-id')[0].innerHTML;
    $('#delete-script-form-' + scriptId).attr("action","/Politiker/scripts/" + scriptType + "/" + scriptId +  "?_method=DELETE")
    confirmScriptDelete(scriptId);
});

