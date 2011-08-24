jQuery Mobile Pagination Plugin
=====
A jQuery Mobile plugin for sequential pagination between pages with support for touch, mouse, and keyboard! 

Simply add this plugin to your page and link together documents via ordinary HTML anchors. jQuery Mobile Pagination will enhance those links with touch-drag navigation in browsers that support touch events. 

This is implemented on top of jQuery Mobile's Ajax Navigation Model, meaning this plugin ties into your browser's history, so back and forward buttons work as expected!</p>


Demos and documentation
===================================

This plugin requires jQuery and jQuery Mobile. It doesn't require the whole framework though, we'll document that later!

To use:

1. Reference <code>jquery.mobile.pagination.css</code> and <code>jquery.mobile.pagination.js</code> from your page.
2. Place the following markup somewhere inside each document that you want to make draggable. The links should point to the next and previous pages.


&lt;ul data-role=&quot;pagination&quot;&gt;
	&lt;li class=&quot;ui-pagination-prev&quot;&gt;&lt;a href=&quot;2.html&quot;&gt;Prev&lt;/a&gt;&lt;/li&gt;
	&lt;li class=&quot;ui-pagination-next&quot;&gt;&lt;a href=&quot;4.html&quot;&gt;Next&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;