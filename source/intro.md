---
title: Introduction
permalink: intro/
description: "Introduction to this sample project about creating page transition animations using the browser's history API"
---
### Creating page transitions with pushState and popstate

We are always looking for ways to make an online experience more interesting. With better browser support for the history API, we can create some very interesting effects related to how page loads that can enhance the user's experience.

So, I am sure that many developers have seen examples of this type of effect, but while I looked through these examples, I found myself asking a number of questions regarding practical application. Some of the examples do not properly address the potential usage of the browsers back and forward buttons. Others neglect to address how manipulation of the history API affects analytics tracking.

With this example, I am going to present a very basic example of the page transition, while spending more time demonstrating and explaining how we can use this type of feature without sacrificing some of the standard requirements that users expect.

### Step 1: Deciding on Animations

First, we need to determine how we are going to replace the standard page load. By that, I mean what are we going to animate and how do we plan to animate that content.

``` js
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
    $('body').removeClass('page-changing').addClass('page-changed');
}
```

In this example, we are addressing the three animations that are needed for this example. First, we want to execute an initial animation that occurs on the initial page load. For this we are simply adding a class to denote that the page has loaded.

Second, we need to execute an animation when a 'page change' is triggered. For this, we are simply adding a class titled 'page-changing'. We also need to remove the 'page-changed' class if it exists. Finally, we need to execute an animation signifying that the page change is complete. To do this, we are simply running a function that does the opposite of the page changing animation.
