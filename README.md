:warning: This project is archived and the repository is no longer maintained. 

# jQuery Mobile Pagination Plugin

[![Filament Group](http://filamentgroup.com/images/fg-logo-positive-sm-crop.png) ](http://www.filamentgroup.com/)

A jQuery Mobile plugin for sequential pagination between pages with support for touch, mouse, and keyboard! 

Simply add this plugin to your page and link together documents via ordinary HTML anchors. jQuery Mobile Pagination will enhance those links with touch-drag navigation in browsers that support touch events. 

This is implemented on top of jQuery Mobile's Ajax Navigation Model, meaning this plugin ties into your browser's history, so back and forward buttons work as expected!</p>


Demos and documentation
===================================

This plugin requires jQuery and jQuery Mobile. It doesn't require the whole framework though, we'll document that later!

To use:

1. Reference <code>jquery.mobile.pagination.css</code> and <code>jquery.mobile.pagination.js</code> from your page.
2. Place the following markup somewhere inside each document that you want to make draggable. The links should point to the next and previous pages.


Markup:




    <ul data-role="pagination">
        <li class="ui-pagination-prev"><a href="2.html">Prev</a></li>
        <li class="ui-pagination-next"><a href="4.html">Next</a></li>
    </ul>
