/**
 * Page Transitions
 *
 * Handling of internal links that load page content via pushState and AJAX
 */
var imagesLoaded = require('imagesloaded');
var $ = require('jquery');
var entryPage = window.location.href;
var entryTitle = document.title;

/* Use imagesLoaded as jQuery plugin */
imagesLoaded.makeJQueryPlugin($);

/**
 * Animations
 */

/* Page changing animation (transition begins) */
function pageChangingAnimation() {
    $('body').addClass('page-changing').removeClass('page-changed');
}

/* Page changed animation (transition ends) */
function pageChangedAnimation() {
    $('main').imagesLoaded().done(function() {
        $('body').addClass('page-changed').removeClass('page-changing');
    });
}

/**
 * Content loading & sequence
 */

/* Sequence for the animations and content loading */
function changePage(state, is_popstate) {
    var url = (state === null) ? entryPage : state.url;
    pageChangingAnimation();
    setTimeout(function() {
        loadNewContent(url);
    }, 500);
}

/* Extend pushState to include the changePage function */
(function(extendPushState) {
    history.pushState = function(state) {
        changePage(state, false);
        return extendPushState.apply(this, arguments);
    };
})(history.pushState);

/* Pull content from the new URL and insert into the DOM */
function loadNewContent(url) {
    $.ajax({
        url: url,
        complete: pageChangedAnimation,
        success: function (response) {
            var $newTitle = $(response).filter('title').text();
            var $newMain = $(response).find('main');
            $('main').replaceWith($newMain[0]);
            document.title = $newTitle;
        },
        error: function () {
            $('main').html('<p>Sorry, an error occurred!</p>');
        }
    });
}

/* Make sure that Google Analytics is accounted for (see docs at https://goo.gl/THP4WQ) */
function trackPageChange(location) {
    if (typeof ga == 'function') {
        ga('set', 'page', location);
        ga('send', 'pageview');
    } else {
        // If needed, console to test if Google Analytics is enabled
        // console.log('GA tracking not enabled');
    }
}

/**
 * Event handlers
 */

/* Fire the changePage function when something like the back button is clicked */
$(window).on('popstate', function(event) {
    changePage(event.originalEvent.state, true);
});

/* Trigger a page change & transition */
$('body').on('click', '[data-type="page-transition"]', function(event){
    event.preventDefault();
    if(window.location != this.href) {
        history.pushState({ url: this.href }, $(this).attr('title'), this.href);
        trackPageChange($(this).attr('href'));
    }
});
