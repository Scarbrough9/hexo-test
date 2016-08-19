/**
 * Page Transitions
 *
 * Handling of internal links that load page content via pushState and AJAX
 */
const $ = require('jquery');
const entryPage = window.location.href;

/**
 * Animations
 */

/* Initial animation */
function initialPageAnimation() {
    $('body').addClass('page-loaded');
}

/* Page changing animation (transition begins) */
function pageChangingAnimation() {
    $('body').addClass('page-changing').removeClass('page-changed');
}

/* Page changed animation (transition ends) */
function pageChangedAnimation() {
    $('body').addClass('page-changed').removeClass('page-changing');
}

/**
 * Content loading & sequence
 */

/* Sequence for the animations and content loading */
function changePage(state) {
    var url = (state === null) ? entryPage : state.url;
    pageChangingAnimation();
    setTimeout(function() {
        loadNewContent(url).promise().done(pageChangedAnimation);
    }, 500);
}

/* Extend pushState to include the changePage function */
(function(extendPushState) {
    history.pushState = function(state) {
        changePage(state, entryPage);
        return extendPushState.apply(this, arguments);
    };
})(history.pushState);

/* Pull content from the new URL and insert into the DOM */
function loadNewContent(url) {
    $('main').load(url + ' main > *');
    return $('main');
}

/* Make sure that Google Analytics is accounted for (see docs at https://goo.gl/THP4WQ) */
function trackPageChange(location) {
    if (typeof ga == 'function') {
        ga('set', 'page', location);
        ga('send', 'pageview');
    } else {
        console.log('GA tracking not enabled');
    }
}

/**
 * Event handlers
 */

/* Fire the initial page load animations */
$(window).on('load', initialPageAnimation);

/* Fire the changePage function when something like the back button is clicked */
$(window).on('popstate', function(event) {
    changePage(event.originalEvent.state);
});

/* Trigger a page change & transition */
$('body').on('click', '[data-type="page-transition"]', function(event){
    event.preventDefault();
    if(window.location != this.href) {
        history.pushState({ url: this.href }, '', this.href);
        trackPageChange($(this).attr('href'));
    }
    // window.location != this.href ? history.pushState({ url: this.href }, '', this.href) : false;
    // window.location != this.href ? false : trackPageChange($(this).attr('href'));
});
