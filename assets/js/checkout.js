
(function inputScopeWrapper($) {

    $(function onDocReady() {
        $('#payment').submit(noProduct);
    });

    function noProduct() {
        var email = $('#email_ass').val();
        var userInputs = { 'email': email }
        dataLog(userInputs)
        document.getElementById("replace").innerHTML = '<h2><b>Thank you for your interest!</b></h2><h3><b>We release our guide in batches and will email you when it is available for purchase!</h3></b>'
        return false;
    }


    function dataLog(userInputs) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/user',
            headers: {},
            data: JSON.stringify({
                Email: userInputs.email
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error logging: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        // console.log(result)
        console.log('Successful')
    }


}(jQuery));



