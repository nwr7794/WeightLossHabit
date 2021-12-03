

(function inputScopeWrapper($) {

    // Grab the dietDB data during page load
    $(function onDocReady() {

        var keyProd = 'AIzaSyDaqR3scLgh4Dw26glrQ2BfDHiMJKzDIz4'
        var keyTest = 'AIzaSyAGYgfzU5Lo2-OsFVMySI7UNzjxl_4EkQQ' ///////////////////////////////////////// Make sure right one active pre-commit

        dietDB = $.ajax({
            method: 'GET',
            url: 'https://sheets.googleapis.com/v4/spreadsheets/1zJG5RXsJfWpL9aRWWotGZNLOaUdOVrZsLKP5uS4106Q/values/DB!A1:G44?majorDimension=ROWS&key=' + keyTest,
            success: dietInput,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error pulling data: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                // alert('An error occured when pulling the diet DB:\n' + jqXHR.responseText);
            }
        });

        // dietDB = sheetsResponse.responseJSON.values

        $('#nextClick').click(storeInputs);

        // Global variable to track active meal and store inputs
        mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
        mealActive = 0;
        inputLog = [];
        setQuestion();

    });

    // Populate diet input
    function dietInput() {

        foodData = dietDB.responseJSON.values
        // console.log(foodData)
        categories = ['Beverages', 'Grains', 'Starches', 'PackagedFood', 'Sweets']

        // For each category populate list
        for (i = 0; i < categories.length; i++) {
            var foodSubset = foodData.filter(x => x[1] == categories[i])
            // console.log(foodSubset)
            for (j = 0; j < foodSubset.length; j++) {
                var newItem = '<li style="margin: 3px; padding: 0;  font-size: 10pt"><input type="number" id="ID' + foodSubset[j][6] + '" value="0" style="width: 35px; height: auto;"><label><b>' + foodSubset[j][0] + '</b></label><span style="float: right;">' + foodSubset[j][3] + '</span></li>';
                $("#" + categories[i] + 'List').append(newItem);
            }
        }

    }

    function storeInputs() {
        // First wipe old data from that meal if there is any
        inputLog = inputLog.filter(x => x[2] != mealTimes[mealActive])


        for (i = 1; i < foodData.length; i++) {
            // [ID, Quantity, Time of Day, Points, Category, Points]
            inputLog.push([foodData[i][6], parseFloat($("#ID" + foodData[i][6]).val()), mealTimes[mealActive], parseFloat(foodData[i][2]) + parseFloat(foodData[i][5]), foodData[i][1]])
        }

        // console.log(inputLog)
        mealActive = mealActive + 1
        // Reset questions
        // And need to reset values to 0 on click
        for (k = 1; k < foodData.length; k++) {
            $("#ID" + foodData[k][6]).val(0)
        }
        // Reset all the uncollapsed things

        var symbols = document.getElementsByClassName('symbolExpand');
        for (jj = 0; jj < symbols.length; jj++) {
            if (symbols[jj].innerText == '-') {
                symbols[jj].click()
            }
        }

        // Scroll to top
        document.getElementById("scrollTo").scrollIntoView({ behavior: 'smooth' });

        setQuestion();

    }

    function setQuestion() {
        // Use this function to set question and
        $("#questionHeader").html('On a typical day, how much of the following do you consume during <strong><u>' + mealTimes[mealActive] + '</u></strong>?')
        $("#progress").html(mealActive + 1 + "/4")
        if (mealActive == 3) {
            $("#nextClick").val('Finish')
        }
        if (mealActive == 4) {
            modelAgg();
        }


    }

    // Function that generates and displays output
    function modelAgg() {
        // Data stored in inputLog - ID, Quantity, Time of day, Points, Categories

        // Output structure: ID, Category, time of day, points
        // Remove 0 points
        // Sort most to least points
        var outputCross = [];
        // var filteredArray;
        // This aggregated by food and time of day, now going to do individual items
        // for (i = 0; i < categories.length; i++) {
        //     for (j = 0; j < mealTimes.length; j++) {
        //         // Filter array for given category/time of day combo
        //         filteredArray = inputLog.filter(x => x[4] == categories[i] && x[2] == mealTimes[j] && x[1] != 0)
        //         // Then take left over array, sum and push to output
        //         if (filteredArray.length > 1) {
        //             var pointsSum = filteredArray.reduce((a, b) => a[1] * a[3] + b[1] * b[3])
        //             outputCross.push([categories[i], mealTimes[j], pointsSum])
        //         } else if (filteredArray.length == 1) {
        //             outputCross.push([categories[i], mealTimes[j], filteredArray[0][1] * filteredArray[0][3]])
        //         }
        //     }
        // }

        for (i = 0; i < inputLog.length; i++) {
            if (inputLog[i][1] > 0) {
                outputCross.push([inputLog[i][0], inputLog[i][4], inputLog[i][2], inputLog[i][3] * inputLog[i][1]])
            }
        }

        // Replace the ID with item name
        for (j = 0; j < outputCross.length; j++) {
            var name = foodData.find(x => x[6] == outputCross[j][0])
            outputCross[j][0] = name[0];
        }









        // Now need to sort final array
        var outputSorted = outputCross.sort(function (a, b) {
            return b[3] - a[3];
        });

        outputSorted = outputSorted.map(x => [x[0], x[2]])
        // console.log(outputSorted)

        var outputHTML = '<h3>Your consumption habits that promote weight gain:</h3><ol style="text-align: left">'

        for (ii = 0; ii < outputSorted.length; ii++) {
            var newString = '<li>' + outputSorted[ii][0] + ' for ' + outputSorted[ii][1] + '</li>'
            outputHTML = outputHTML + newString
        }

        outputHTML = outputHTML + '</ol>'
        $("#contentMain").html(outputHTML)

    }


    function userAdd(userInputs) {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/implement',
            headers: {},
            data: JSON.stringify({
                DietID: userInputs.dietID,
                DietName: userInputs.dietName,
                Name: userInputs.name,
                Email: userInputs.email
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error user add: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                // alert('An error occured when adding user:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(response) {
        // console.log(response)
        document.getElementById("dietComplete").innerHTML = '<h3 style="color: orange;">Congratulations ' + response.Name +
            ' on beginning your weight loss journey! You will receive an email from us shortly!</h3><b>Diet: ' +
            response.DietName + '<br>Email: ' + response.Email + '</b>';

        document.getElementById("pitch").style.display = 'none'
        document.getElementById("dietSubmit").style.display = 'none'
        document.getElementById("dietComplete").style.display = 'block'

    }

    function handleAddData() {
        var dietID = $('#diet_ass').val();
        var dietName = $("#diet_ass option:selected").text();
        var name = $('#name_ass').val();
        var email = $('#email_ass').val();
        var userInputs = { 'dietID': dietID, 'dietName': dietName, 'name': name, 'email': email }
        userAdd(userInputs)
        return false;
    }





}(jQuery));