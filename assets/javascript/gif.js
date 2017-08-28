
//initial list of buttons, user submission will push into this array
var topics = ["dog", "lion", "hyena", "giraffe", "snake"];

//function to prevent duplicaiton of buttons when a new one is created
function clearButtons(){
	$("#gif-buttons").empty();
}

//function to clear the gif images once the user wants to start over
function clearImages(){
	$("#gif-images").empty();
}

//function that runs through the array and creates buttons based on user inputs
function makeButtons(){
	for(var i = 0; i <  topics.length; i++){
		var btnMaker = $("<button>");
		btnMaker.attr("data-name", topics[i]);
		btnMaker.text(topics[i]);
		btnMaker.attr("type", "button");
		btnMaker.addClass("btn btn-info");
		$("#gif-buttons").append(btnMaker);
	}
}
	
//when user click the Make a Giphy button it will push their response to the array and create a button	
$("#submitGIF").on("click", function(){
	event.preventDefault();
	var userEntry = $("#search").val().trim();
	topics.push(userEntry);
	clearButtons();
	makeButtons();

});

//when user clicks on Clear the gifs it will empty the gifs image panel
$("#clear-images").on("click", function(){
	clearImages();
});

//when user clicks on clear the buttons it will clear gif buttons on site and reset array
$("#clear-buttons").on("click", function(){
	clearButtons();
	topics = [];
});

//when user clicks on one of the buttons created by the program or the user it will run this function
$(document).on("click", ".btn-info", function(){ 
	//variable that grabs the text of the button selected
	var gifSelect = $(this).text();

	//Push that value to the api link
	var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=" + gifSelect;

	//AJAX call for giphy api
	$.ajax({
		url: queryURL,
		method: "GET"
	})
	.done(function(response){
		//for loop that runs for the length of the response.data which is 10, set in the query URL with limit=10
		for(var j = 0; j < response.data.length; j++){
		//create divs to hold both rating and images
			//create the div 
			var imgDiv = $("<div>");
			//add class for CSS formatting
			imgDiv.addClass("images-divs");
			//publish the rating of the gif in the div
			imgDiv.append("<h2> Rating: " + response.data[j].rating + "</h2>");
			
			//create img tags to hold the gif images
			var gifImg = $("<img>");

			//set src and attributes of gif images
			//original source is the still of the gif
			gifImg.attr("src", response.data[j].images.fixed_height_still.url);

			//creating a data type to hold the still image and applying the attribute
			var stopURL = response.data[j].images.fixed_height_still.url;
			gifImg.attr("data-stillURL", stopURL);
			gifImg.attr("data-status", "still");

			//creating a data type to hold the moving gif and applying the attribute
			var playURL = response.data[j].images.fixed_height.url
			gifImg.attr("data-playURL", playURL);

			//append the img to the div created earlier
			imgDiv.append(gifImg);

			//prepend all the images to the gif images panel
			$("#gif-images").prepend(imgDiv);
		}

		//when gif image is selected run this function
		$("img").on("click", function(){
			//variable to hold the current status of the gif
			var gifStatus = $(this).attr("data-status");
			//if the gif is not moving run this
			if(gifStatus === "still"){
				//variable to store the URL that will make gif play
				var playAGif = $(this).attr("data-playURL");
				//set the status to be playing for future IF statements
				$(this).attr("data-status", "play");
				//change the src URL of the image to the play URL
				$(this).attr("src", playAGif);
			} 
			//if the gif is moving run this
			if (gifStatus === "play"){
				//variable to store the URL that will make the gif stop playing
				var stopAGif = $(this).attr("data-stillURL");
				//set the status to still for future IF statements
				$(this).attr("data-status", "still");
				//change the src URL of the image to the stop URL
				$(this).attr("src", stopAGif);
			}

		})

	});


});

makeButtons();
