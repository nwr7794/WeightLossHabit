

(function inputScopeWrapper($) {


    // Grab the dietDB data during page load
    $(function onDocReady() {

        // Global variable to track active meal and store inputs
        mealTimes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
        categories = ['Beverages', 'Mains', 'Sides', 'Desserts', 'Packaged']
        mealActive = 0;
        categoryActive = 0;
        inputLog = [];
        lifestyleLog = [];
        // Global var for input counter
        pageCounter = 0


        $('#nextClick').click(storeInputs);
        // $('#prevClick').click(storeInputs);
        $('#emailForm').submit(handleEmailSubmit);

        var keyProd = 'AIzaSyDaqR3scLgh4Dw26glrQ2BfDHiMJKzDIz4'
        var keyTest = 'AIzaSyAGYgfzU5Lo2-OsFVMySI7UNzjxl_4EkQQ' ///////////////////////////////////////// Make sure right one active pre-commit

        dietDB = $.ajax({
            method: 'GET',
            url: 'https://sheets.googleapis.com/v4/spreadsheets/1zJG5RXsJfWpL9aRWWotGZNLOaUdOVrZsLKP5uS4106Q/values/Questions!A1:E100?majorDimension=ROWS&key=' + keyProd,
            success: setQuestion,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error pulling data: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                // alert('An error occured when pulling the diet DB:\n' + jqXHR.responseText);
            }
        });

        // dietDB = sheetsResponse.responseJSON.values

        // setQuestion();

    });

    // Populate diet input
    function dietInput() {

        // Clear list items
        $('#selectionsList').empty()

        // console.log(foodData)

        // For each category populate list
        var foodSubset = foodData.filter(x => x[2] == categories[categoryActive] && x[1].split(',').includes(mealTimes[mealActive]))
        // console.log(foodSubset)

        if (foodSubset.length > 0) {
            for (j = 0; j < foodSubset.length; j++) {
                // var newItem = '<li style="margin: 3px; padding: 0;  font-size: 10pt"><input type="number" id="ID' + foodSubset[j][6] + '" value="0" style="width: 35px; height: auto;"><label><b>' + foodSubset[j][0] + '</b></label><span style="float: right;">' + foodSubset[j][3] + '</span></li>';
                var newItem = '<li style="width: 100%; padding-top: 7px; padding-left: 7px;"><div class="clickToggle" style="border-radius: 25px; width: 100%; max-width: 100%; font-size:100%; border: solid 1px; text-align: left; padding: 7px;" id="ID' + foodSubset[j][0] + '"><b>' + foodSubset[j][4] + '</b></div></li>'
                $("#selectionsList").append(newItem);
            }

            // Add click listener to all elements here
            var elements = document.getElementsByClassName("clickToggle");
            var myFunction = function () {
                if (this.style.backgroundColor == "lightblue") {
                    this.style.backgroundColor = "white"
                    this.setAttribute("title", "Off");
                } else {
                    this.style.backgroundColor = "lightblue"
                    this.setAttribute("title", "On");
                }
                // var attribute = this.getAttribute("class");
                // this.style.backgroundColor = "lightblue"
                // alert(attribute);
            };
            for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener('click', myFunction, false);
            }
        } else {
            categoryActive = categoryActive + 1
            if (categoryActive > categories.length) {
                categoryActive = 0
                mealActive = mealActive + 1
                dietInput();
            } else {
                dietInput();
            }
        }
    }

    function storeInputs() {

        // First wipe old data from that meal if there is any - only need this if there is a back button
        // inputLog = inputLog.filter(x => x[1] != mealTimes[mealActive] && x[2] != categories[categoryActive])

        // Store selected data
        // Structure: [ID,Time of Day,Category]
        var userInputs = document.getElementsByClassName("clickToggle");
        for (i = 0; i < userInputs.length; i++) {
            if (userInputs[i].title == 'On') {
                inputLog.push([userInputs[i].id, mealTimes[mealActive], categories[categoryActive]])
            }
        }
        // console.log(inputLog)

        // If it is the last page, complete
        if ($("#nextClick").val() == 'Finish') {
            // alert('Last page complete')
            modelAgg();
        } else {
            // Set to next category or meal if complete
            categoryActive = categoryActive + 1
            // If no items for meal/cat combo, go to next
            for (i = 0; i < categories.length; i++) {
                var check = foodData.filter(x => x[2] == categories[categoryActive] && x[1].split(',').includes(mealTimes[mealActive]))
                // console.log(check)
                if (check.length < 1) {
                    if (categoryActive > categories.length) {
                        categoryActive = 0
                        mealActive = mealActive + 1
                    } else {
                        categoryActive = categoryActive + 1
                    }
                } else {
                    break;
                }
            }

            // Scroll to top
            document.getElementById("scrollTo").scrollIntoView({ behavior: 'smooth' });

            // Jump to final questions
            if (pageCounter == 16) { //16
                mealActive = 0
                setLifestyle();

            } else {
                setQuestion();
            }

        }

    }



    function setQuestion() {

        // Global var of food DB
        if (pageCounter == 0) {
            foodData = dietDB.responseJSON.values
            $("#backButton").hide();
        }

        // Global var for input counter
        pageCounter = pageCounter + 1

        // Use this function to set question and
        $("#questionHeader").html('<h2><strong>Your typical <u>' + mealTimes[mealActive].toUpperCase() + '</u> includes:</strong></h2><h4>Click any that apply</h4>')
        $("#progress").html(pageCounter + "/20")
        dietInput();
    }

    // Function that prompts and logs where the food from each meal comes from
    function setLifestyle() {

        // Create new clickhandler
        $('#nextClick').off()
        $('#nextClick').click(storeLifestyle);
        if (mealActive == 3) {
            $("#nextClick").val('Finish')
        }

        // Global var for input counter
        pageCounter = pageCounter + 1

        // Use this function to set question and
        if (mealTimes[mealActive].toUpperCase() != 'SNACKS') {
            var verb = 'is'
        } else {
            var verb = 'are'
        }
        $("#questionHeader").html('<h2><strong>Your typical <u>' + mealTimes[mealActive].toUpperCase() + '</u> ' + verb + ':</strong></h2><h4>Choose one</h4>')
        $("#progress").html(pageCounter + "/20")

        // Clear list items
        $('#selectionsList').empty()
        mealSourceDir = [ ['prepHome','Prepared at home'],['prepRestaurant','Restaurant/cafeteria take-out or delivery'],
        ['prepVending','Purchased from vending machine or convenient store'],['prepOther','Other'] ];

        var newItem1 = '<li style="width: 100%; padding-top: 7px; padding-left: 7px;"><div class="clickToggle" style="border-radius: 25px; width: 100%; max-width: 100%; font-size:100%; border: solid 1px; text-align: left; padding: 7px; background-color: lightblue" id="prepHome" title = "On"><b>' + mealSourceDir[0][1] + '</b></div></li>'
        var newItem2 = '<li style="width: 100%; padding-top: 7px; padding-left: 7px;"><div class="clickToggle" style="border-radius: 25px; width: 100%; max-width: 100%; font-size:100%; border: solid 1px; text-align: left; padding: 7px;" id="prepRestaurant"><b>' + mealSourceDir[1][1] + '</b></div></li>'
        var newItem3 = '<li style="width: 100%; padding-top: 7px; padding-left: 7px;"><div class="clickToggle" style="border-radius: 25px; width: 100%; max-width: 100%; font-size:100%; border: solid 1px; text-align: left; padding: 7px;" id="prepVending"><b>' + mealSourceDir[2][1] + '</b></div></li>'
        var newItem4 = '<li style="width: 100%; padding-top: 7px; padding-left: 7px;"><div class="clickToggle" style="border-radius: 25px; width: 100%; max-width: 100%; font-size:100%; border: solid 1px; text-align: left; padding: 7px;" id="prepOther"><b>' + mealSourceDir[3][1] + '</b></div></li>'

        $("#selectionsList").append(newItem1);
        $("#selectionsList").append(newItem2);
        $("#selectionsList").append(newItem3);
        $("#selectionsList").append(newItem4);

        // Add click listener to all elements here - only allow for 1 checked at a time
        var myFunction = function () {
            var elements = document.getElementsByClassName("clickToggle");
            // var on = elements.find(x => x == 'On');
            var onIndex = 'no';
            for (j = 0; j < elements.length; j++) {
                if (elements[j].title == 'On') {
                    onIndex = j
                    break;
                }
            }
            if (onIndex != 'no') {
                elements[onIndex].style.backgroundColor = "white"
                elements[onIndex].setAttribute("title", "Off");
            }
            this.style.backgroundColor = "lightblue"
            this.setAttribute("title", "On");
        };

        var elements = document.getElementsByClassName("clickToggle");
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', myFunction, false);
        }

    }

    function storeLifestyle() {

        // First wipe old data from that meal if there is any
        lifestyleLog = lifestyleLog.filter(x => x[2] != mealTimes[mealActive])

        // Store data
        var userInputs = document.getElementsByClassName("clickToggle");
        for (i = 0; i < userInputs.length; i++) {
            if (userInputs[i].title == 'On') {
                lifestyleLog.push([userInputs[i].id, mealTimes[mealActive]])
            }
        }

        // Set for next question
        if (mealActive == 3) {
            modelAgg();
        } else {
            mealActive = mealActive + 1
            setLifestyle();
        }

    }

    // Function that generates and displays output
    function modelAgg() {
        console.log('Agg script triggered')
        // Data stored in inputLog - ID, Time of day, Categories
        // Add points and replace name
        for (i = 0; i < inputLog.length; i++) {
            var entry = foodData.find(x => ('ID' + x[0]) == inputLog[i][0])
            inputLog[i].push(parseInt(entry[3]))
            inputLog[i][0] = entry[4]
        }
        // Remove the 0 point items
        inputLog = inputLog.filter(x => x[3] != 0)

        // console.log(inputLog)

        // Now need to sort final array
        var outputSorted = inputLog.sort(function (a, b) {
            return b[3] - a[3];
        });

        outputSorted = outputSorted.map(x => [x[0], x[1]])
        outputSorted = outputSorted.slice(0, 5);
        // console.log(outputSorted)

        var outputHTML = '<h3><b style="color: lightskyblue;">Your top consumption habits that promote weight gain:</b></h3><ol style="text-align: left">'

        for (ii = 0; ii < outputSorted.length; ii++) {
            var newString = '<li><b><u>' + outputSorted[ii][0] + '</u></b> during <b>' + outputSorted[ii][1] + '</b></li>'
            outputHTML = outputHTML + newString
        }
        outputHTML = outputHTML + '</ol>'


        // Add meal times ranked output here
        var mealAgg = [[mealTimes[0], 0], [mealTimes[1], 0], [mealTimes[2], 0], [mealTimes[3], 0]]
        for (j = 0; j < mealAgg.length; j++) {
            // Filter array for given category/time of day combo
            var filteredArray = inputLog.filter(x => x[1] == mealAgg[j][0])
            // console.log(filteredArray)
            // Then take left over array, sum and push to output
            if (filteredArray.length > 1) {
                var pointsSum = filteredArray.reduce((a, b) => a[3] + b[3])
                mealAgg[j][1] = pointsSum
            }
        }
        // Remove meals with 0 points
        mealAgg = mealAgg.filter(x => x[1] != 0)
        // Then sort
        var mealAggSorted = mealAgg.sort(function (a, b) {
            return b[1] - a[1];
        });

        // Add to html output
        outputHTML = outputHTML + '<h3><b style="color: lightskyblue;">Your top meal times that promote weight gain:</b></h3><ol style="text-align: left">'

        for (ii = 0; ii < mealAggSorted.length; ii++) {
            var newString = '<li><b>' + mealAggSorted[ii][0] + '</b></li>'
            outputHTML = outputHTML + newString
        }
        outputHTML = outputHTML + '</ol>'



        // Add meal sources
         // Add to html output
        outputHTML = outputHTML + '<h3><b style="color: lightskyblue;">Your food sources:</b></h3><ul style="text-align: left; margin-bottom: 15px;">'



        for (ii = 0; ii < lifestyleLog.length; ii++) {
            var newString =  '<li><b>' + lifestyleLog[ii][1] + ': ' + mealSourceDir.find(x => x[0] == lifestyleLog[ii][0])[1] + '</b></li>'
            outputHTML = outputHTML + newString
        }
        outputHTML = outputHTML + '</ul><p>*This is important because our service fits <u>your program</u> to <u>your lifestyle</u>.</p>'






        $("#progress").hide()
        $("#contentMain").html(outputHTML)
        $('#emailForm').show()


    }

    function handleEmailSubmit() {
        console.log('email submitted')

        // Add function that posts data to correct DB
        return false;
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
        var email = $('#email_ass').val();
        // var userInputs = { 'dietID': dietID, 'dietName': dietName, 'name': name, 'email': email }
        // userAdd(userInputs)
        return false;
    }





}(jQuery));