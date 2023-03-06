const dateFirst = new Date();
var selectedMonth = dateFirst.getMonth() + 1;
var selectedYear = dateFirst.getFullYear();
var apiURL = 'https://api.airtable.com/v0/appapOlGrcy5YNJ7A/videos?filterByFormula=AND(MONTH(%7BsubmittedDate%7D)%3D' + selectedMonth + '%2C+YEAR(%7BsubmittedDate%7D)%3D' + selectedYear + ')&maxRecords=100&pageSize=21&sort%5B0%5D%5Bfield%5D=submittedDate&sort%5B0%5D%5Bdirection%5D=desc&view=FM+Playlist';
var apiToken = 'patrmhhyrGhfX1lBu.565c299d1b736dc23b667dcf26d072185cf8236b255051109e767040c612ecce';

//for search
var searchKeyword = '';
var offset2 = '';
var apiURL2 = 'https://api.airtable.com/v0/appapOlGrcy5YNJ7A/videos?filterByFormula=OR(FIND(%22' + searchKeyword + '%22%2C+LOWER(%7BsubmitterName%7D))%2C+FIND(%22' + searchKeyword + '%22%2C+LOWER(%7BsongTitle%7D))%2C+FIND(%22' + searchKeyword + '%22%2C+LOWER(%7BartistName%7D)))&maxRecords=100&pageSize=21&sort%5B0%5D%5Bfield%5D=submittedDate&sort%5B0%5D%5Bdirection%5D=desc&view=FM+Playlist';
function youtube_parser(url) {
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    //error
  }
}

function getPlaylist() {
  let request = new XMLHttpRequest();
  request.open('GET', apiURL, true);
  request.setRequestHeader('Authorization', "Bearer " + apiToken);
  request.onload = function () {

    let data = JSON.parse(this.response);
    let arr = data.records;

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute 
    if (request.status >= 200 && request.status < 400) {
      $('#pl-empty-state').hide();
      if (arr.length === 0) {
        $('#pl-empty-state').show();
      }
      else {
        // Map a variable called cardContainer to the Webflow element called "Cards-Container"
        const cardContainer = document.getElementById("playlist-wrapper");
        arr.forEach((items, i) => {
          // For each data, create a div called card and style with the "Sample Card" class
          const style = document.getElementById('pl-sample-card');
          // Copy the card and it's style
          const card = style.cloneNode(true);

          card.setAttribute('id', '');
          let video = $(card).find(".video");

          let videoID = youtube_parser(items.fields.youtubeLink);

          $('<iframe src="placeholder" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>')
            .attr("src", "https://www.youtube.com/embed/" + videoID)
            .appendTo(video);
          $(card).find('.pl-name').text(items.fields.submitterName);
          $(card).find('.pl-desc').text(items.fields.songDescription);
          $(card).find('.pl-month').text(items.fields.Month);
          var formattedDate = items.fields.submittedDate.slice(0, 4);
          $(card).find('.pl-year').text(formattedDate);
          cardContainer.appendChild(card);
        })
      }
      $('.pl-sample-card').not('#pl-sample-card').show();
    }
  }

  // Send request
  request.send();
}

function getDate() {
  let request = new XMLHttpRequest();
  request.open('GET', apiURL, true);
  request.setRequestHeader('Authorization', "Bearer " + apiToken);
  request.onload = function () {

    let data = JSON.parse(this.response);
    let arr = data.records;
    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute 
    if (request.status >= 200 && request.status < 400) {
      if (arr.length === 0) {
        if (selectedMonth == 1) {
          selectedMonth = 12;
          selectedYear = selectedYear - 1;
        }
        else {
          selectedMonth = selectedMonth - 1;
        }
      }
    }
    apiURL = 'https://api.airtable.com/v0/appapOlGrcy5YNJ7A/videos?filterByFormula=AND(MONTH(%7BsubmittedDate%7D)%3D' + selectedMonth + '%2C+YEAR(%7BsubmittedDate%7D)%3D' + selectedYear + ')&maxRecords=100&pageSize=21&sort%5B0%5D%5Bfield%5D=submittedDate&sort%5B0%5D%5Bdirection%5D=desc&view=FM+Playlist';
    getPlaylist();
    $('.month-chips').removeClass('active');
    $('#pl-month-' + selectedMonth).addClass('active');
  }
  // Send request
  request.send();
}

function searchPlaylist() {

  let request = new XMLHttpRequest();
  request.open('GET', apiURL2, true);
  request.setRequestHeader('Authorization', "Bearer " + apiToken);
  request.onload = function () {

    let data = JSON.parse(this.response);
    let arr = data.records;
    $('#load-more-wrapper2').hide();
    if (data.offset) {
      offset2 = data.offset;
      $('#load-more-wrapper2').show();
    }
    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute 
    if (request.status >= 200 && request.status < 400) {
      // Map a variable called cardContainer to the Webflow element called "Cards-Container"
      const cardContainer = document.getElementById("playlist-wrapper2");
      arr.forEach((items, i) => {
        // For each data, create a div called card and style with the "Sample Card" class
        const style = document.getElementById('pl-sample-card2');
        // Copy the card and it's style
        const card = style.cloneNode(true);

        card.setAttribute('id', '');
        let video = $(card).find(".video");

        let videoID = youtube_parser(items.fields.youtubeLink);

        $('<iframe src="placeholder" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>')
          .attr("src", "https://www.youtube.com/embed/" + videoID)
          .appendTo(video);
        $(card).find('.pl-name').text(items.fields.submitterName);
        $(card).find('.pl-desc').text(items.fields.songDescription);
        $(card).find('.pl-month').text(items.fields.Month);
        var formattedDate = items.fields.submittedDate.slice(0, 4);
        $(card).find('.pl-year').text(formattedDate);
        cardContainer.appendChild(card);
      })
      $('.pl-sample-card2').not('#pl-sample-card2').show();
      if ($('.pl-sample-card2').length == 1) {
        $('#pl-search-count').text('No');
      }
      else {
        $('#pl-search-count').text($('.pl-sample-card2').length - 1);
      }
      $('#pl-search-keyword').text(searchKeyword);
    }
  }

  // Send request
  request.send();
}

function getMorePlaylist2(moreURL) {
  let request = new XMLHttpRequest();
  request.open('GET', moreURL, true);
  request.setRequestHeader('Authorization', "Bearer " + apiToken);
  request.onload = function () {

    let data = JSON.parse(this.response);
    let arr = data.records;
    if (data.offset) {
      offset2 = data.offset;
      $('#load-more-wrapper2').show();
    }
    else {
      $('#load-more-wrapper2').hide();
    }

    // Status 200 = Success. Status 400 = Problem.  This says if it's successful and no problems, then execute 
    if (request.status >= 200 && request.status < 400) {
      // Map a variable called cardContainer to the Webflow element called "Cards-Container"
      const cardContainer = document.getElementById("playlist-wrapper2");
      arr.forEach((items, i) => {
        // For each data, create a div called card and style with the "Sample Card" class
        const style = document.getElementById('pl-sample-card2');
        // Copy the card and it's style
        const card = style.cloneNode(true);

        card.setAttribute('id', '');
        let video = $(card).find(".video");

        let videoID = youtube_parser(items.fields.youtubeLink);

        $('<iframe src="placeholder" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>')
          .attr("src", "https://www.youtube.com/embed/" + videoID)
          .appendTo(video);
        $(card).find('.pl-name').text(items.fields.submitterName);
        $(card).find('.pl-desc').text(items.fields.songDescription);
        $(card).find('.pl-month').text(items.fields.Month);
        var formattedDate = items.fields.submittedDate.slice(0, 4);
        $(card).find('.pl-year').text(formattedDate);
        cardContainer.appendChild(card);
      })
      $('.pl-sample-card2').not('#pl-sample-card2').show();
    }
  }

  // Send request
  request.send();
}

$(document).ready(function () {
  $('#pl-empty-state').hide();
  $('#pl-sample-card').hide();
  $('#load-more-wrapper').hide();

  //search
  $('.pl-clear-search').hide();
  $('#search-result-wrapper').hide();
  $('#pl-sample-card2').hide();
  $('#load-more-wrapper2').hide();

  getDate();
  $('.month-chips').on('click', function () {
    $('.month-chips').removeClass('active');
    $(this).addClass('active');

    $('#playlist-wrapper').children().not('#pl-sample-card').remove();

    if ($(this).find('.text-block-4').text() == 'Jan') {
      selectedMonth = 1;
    }
    else if ($(this).find('.text-block-4').text() == 'Feb') {
      selectedMonth = 2;
    }
    else if ($(this).find('.text-block-4').text() == 'Mar') {
      selectedMonth = 3;
    }
    else if ($(this).find('.text-block-4').text() == 'Apr') {
      selectedMonth = 4;
    }
    else if ($(this).find('.text-block-4').text() == 'May') {
      selectedMonth = 5;
    }
    else if ($(this).find('.text-block-4').text() == 'Jun') {
      selectedMonth = 6;
    }
    else if ($(this).find('.text-block-4').text() == 'Jul') {
      selectedMonth = 7;
    }
    else if ($(this).find('.text-block-4').text() == 'Aug') {
      selectedMonth = 8;
    }
    else if ($(this).find('.text-block-4').text() == 'Sep') {
      selectedMonth = 9;
    }
    else if ($(this).find('.text-block-4').text() == 'Oct') {
      selectedMonth = 10;
    }
    else if ($(this).find('.text-block-4').text() == 'Nov') {
      selectedMonth = 11;
    }
    else if ($(this).find('.text-block-4').text() == 'Dec') {
      selectedMonth = 12;
    }
    apiURL = 'https://api.airtable.com/v0/appapOlGrcy5YNJ7A/videos?filterByFormula=AND(MONTH(%7BsubmittedDate%7D)%3D' + selectedMonth + '%2C+YEAR(%7BsubmittedDate%7D)%3D' + selectedYear + ')&maxRecords=100&pageSize=21&sort%5B0%5D%5Bfield%5D=submittedDate&sort%5B0%5D%5Bdirection%5D=desc&view=FM+Playlist';
    getPlaylist();
  });

  $("#year-dropdown").change(function () {
    $('#playlist-wrapper').children().not('#pl-sample-card').remove();

    if ($(this).val() == '2021') {
      selectedYear = 2021;
    }
    else if ($(this).val() == '2022') {
      selectedYear = 2022;
    }
    else if ($(this).val() == '2023') {
      selectedYear = 2023;
    }

    apiURL = 'https://api.airtable.com/v0/appapOlGrcy5YNJ7A/videos?filterByFormula=AND(MONTH(%7BsubmittedDate%7D)%3D' + selectedMonth + '%2C+YEAR(%7BsubmittedDate%7D)%3D' + selectedYear + ')&maxRecords=100&pageSize=21&sort%5B0%5D%5Bfield%5D=submittedDate&sort%5B0%5D%5Bdirection%5D=desc&view=FM+Playlist';
    getPlaylist();
  });

  $('.pl-clear-search').on('click', function () {
    $(this).hide();
    $('.pl-section-default').show();
    $('#search-result-wrapper').hide();
    $('#pl-search').val('');
    $('#search-trigger-mobile').removeClass('no-display');
    $('#search-field-wrapper').addClass('no-display');
  });

  $('#pl-search').keypress(function (e) {
    if (e.which == 13) {
      if (!$(this).val()) {
        $('.pl-clear-search').hide();
        $('.pl-section-default').show();
        $('#search-result-wrapper').hide();
        $('#search-trigger-mobile').removeClass('no-display');
        $('#search-field-wrapper').addClass('no-display');
      }
      else {
        $('.pl-section-default').hide();
        $('#search-result-wrapper').show();
        $('#playlist-wrapper2').children().not('#pl-sample-card2').remove();
        searchKeyword = $(this).val().toLowerCase();
        apiURL2 = 'https://api.airtable.com/v0/appapOlGrcy5YNJ7A/videos?filterByFormula=OR(FIND(%22' + searchKeyword + '%22%2C+LOWER(%7BsubmitterName%7D))%2C+FIND(%22' + searchKeyword + '%22%2C+LOWER(%7BsongTitle%7D))%2C+FIND(%22' + searchKeyword + '%22%2C+LOWER(%7BartistName%7D)))&maxRecords=100&pageSize=21&sort%5B0%5D%5Bfield%5D=submittedDate&sort%5B0%5D%5Bdirection%5D=desc&view=FM+Playlist';
        searchPlaylist();
        $(this).blur();
        $('.pl-clear-search').show();
      }
    }
  });

  $('#pl-search').focusout(function () {
    if (!$(this).val()) {
      $('.pl-clear-search').hide();
      $('.pl-section-default').show();
      $('#search-result-wrapper').hide();
      $('#search-field-wrapper').addClass('no-display');
      $('#search-trigger-mobile').removeClass('no-display');
    }
  });

  $("#no-form").on("submit", function (e) {
    e.preventDefault();
  });

  //go back to home view
  $('#pl-fm-logo').on('click', function () {
    $('.pl-clear-search').hide();
    $('.pl-section-default').show();
    $('#search-result-wrapper').hide();
    $('#pl-search').val('');
    $('#search-field-wrapper').addClass('no-display');
    $('#search-trigger-mobile').removeClass('no-display');
    getDate();
  });

  //load more button for search
  $('#pl-load-more2').on('click', function () {
    apiURL2 = 'https://api.airtable.com/v0/appapOlGrcy5YNJ7A/videos?filterByFormula=OR(FIND(%22' + searchKeyword + '%22%2C+LOWER(%7BsubmitterName%7D))%2C+FIND(%22' + searchKeyword + '%22%2C+LOWER(%7BsongTitle%7D))%2C+FIND(%22' + searchKeyword + '%22%2C+LOWER(%7BartistName%7D)))&maxRecords=100&pageSize=21&sort%5B0%5D%5Bfield%5D=submittedDate&sort%5B0%5D%5Bdirection%5D=desc&view=FM+Playlist&offset=' + offset2;
    getMorePlaylist2(apiURL2);
  });

  //search trigger mobile
  $('#search-trigger-mobile').on('click', function () {
    $('#search-field-wrapper').removeClass('no-display');
    $(this).addClass('no-display');
  });

  //draggable chips in small viewports
  const slider = document.querySelector('.pl-chips-wrapper');
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
    console.log(walk);
  });
})