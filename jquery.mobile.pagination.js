/*!
* jQuery Mobile Framework : drag pagination plugin
* Copyright (c) Filament Group, Inc
* Authored by Scott Jehl, scott@filamentgroup.com
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function( $, undefined ){
	
	//auto-init on pagecreate
	$( document ).bind( "pagecreate", function( e ){
		$( ":jqmData(role='pagination')", e.target ).pagination();
	});
	
	var pageTitle="";
	
	//create widget
	$.widget( "mobile.pagination", $.mobile.widget, {
		_create: function() {
			var $el			= this.element,
				$page		= $el.closest( ".ui-page" ),
				$links		= $el.find( "a" ),
				$origin		= $.mobile.pageContainer,
				classNS		= "ui-pagination",
				prevLIClass	= classNS + "-prev",
				nextLIClass	= classNS + "-next",
				prevPClass	= "ui-page-prev",
				nextPClass	= "ui-page-next",
				snapClass	= classNS + "-snapping",
				dragClass	= classNS + "-dragging",
				dragClassOn	= false,
				$nextPage,
				$prevPage;
			
			$el.addClass( classNS );
			
			//prefetch next and prev pages when page is first shown
			$page.one( "pageshow", function(){
				$links.each(function(){
					var next	= $( this ).closest( "." + nextLIClass ).length,
						url		= $( this ).attr( "href" ),
						setNP	= function( newPage ){
							if( next ){
								$nextPage = newPage;
							}
							else{
								$prevPage = newPage;
							}
						};
					
					if( !$page ){
						return;
					}
					
					//if it's a local div reference, make sure it's initialized
					if( url.indexOf( "#") === 0 ){
						setNP( $( ":jqmData(url='" + url.split("#")[1] + "')").page() );
						return;
					}
					
					if( $( ":jqmData(url='" + url + "')" ).length ){
						return;
					}
					
					//NOTE: this must handle local # urls as well in jQM
					$.mobile
						.loadPage( url )
						.done(function( url, options, newPage ) {
							setNP( newPage );
						});
				});	
			});
			
			//set up next and prev buttons
			
			$links.each(function(){
				var reverse = $( this ).closest( "." + prevLIClass ).length;
			
				$(this)
					.buttonMarkup({
						"role"		: "button",
						"theme"		: "d",
						"iconpos"	: "notext",
						"icon"		: "arrow-" + ( reverse ? "l" : "r")
					})
					.bind( "vclick", function(){
						$.mobile.changePage( $(this).attr( "href" ), { reverse: reverse } );
						return false;
					});
			});
			
			// Keyboard handling
			$( document )
				.unbind(  "keyup.pagination" )
				.bind( "keyup.pagination", function( e ){
					if( !$( e.target ).is( "input, textarea, select, button" ) ){
						var targetA, reverse;
						// Left arrow
						if( e.keyCode === $.mobile.keyCode.LEFT ){
							targetA = $( ".ui-page-active .ui-pagination-prev a" );
							reverse = true;
						}
						// Right arrow
						else if( e.keyCode === $.mobile.keyCode.RIGHT ){
							targetA = $( ".ui-page-active .ui-pagination-next a" );
						}
						if( targetA ){
							$.mobile.changePage( targetA.attr( "href" ), { reverse: reverse, transition: targetA.jqmData( "transition" ) } );
							e.preventDefault();
						}
					}
				});

			//page drag handling
			$page
				.bind("touchstart", function(e) {
					var data			= e.originalEvent.touches ? e.originalEvent.touches[0] : e,
						start			= [ data.pageX, data.pageY ],
						$pages			= $page.add( $nextPage ).add( $prevPage ),
						dragStart		= false,
						setTransform	= function( pxVal ){
							var val = "translateX(" + ( pxVal / $origin.width() * 100 ) + "%)";
							$pages.css({ 
								"-webkit-transform"	: val,
								"-moz-transform"	: val,
								"-ms-transform"		: val,
								"-o-transform"		: val,
								"transform"			: val
							});
						},
						moveHandler		= function( e ) {
							var data = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
								stop = [ data.pageX, data.pageY ],
								xdist = Math.abs(start[0] - stop[0]);
							
							if( !dragStart ){
								dragStart = true;
								$page.trigger( "dragstart.pagination" );
							}
							
							// prevent scrolling
							if ( xdist > 8 ) {
								e.preventDefault();
							}

							if( !dragClassOn ){
								dragClassOn = true;
								$origin.addClass( dragClass );
							}
							
							$page.trigger( "dragging.pagination" );
							
							setTransform( stop[0] - start[0] );	
						},
						snapTo			= function( newOffset, immediate ){
							var $newActive	= newOffset === 0 ? $page : newOffset > 0 ? $prevPage : $nextPage,
								samePage	= !$newActive || $newActive.is( $page ),
								newUrl		= samePage && $page.jqmData( "url" ) || $newActive.jqmData( "url" ),
								doneCB		= function(){								

									//if it's a new page, change history!
									if( !samePage ){
										//remove active state on old active	
										$page.removeClass( $.mobile.activePageClass );

										//disable hash listening
										$.mobile.urlHistory.ignoreNextHashChange = true;

										$.mobile.path.set( newUrl );

										//if title element wasn't found, try the page div data attr too
										var newPageTitle = $newActive.jqmData( "title" ) || $newActive.children( ":jqmData(role='header')" ).find( ".ui-title" ).text();
										if( !!newPageTitle ) {
											pageTitle = newPageTitle;
										}

										//add page to history stack if it's not back or forward
										$.mobile.urlHistory.addNew( newUrl, undefined, pageTitle, $newActive );

										//set page title
										document.title = $.mobile.urlHistory.getActive().title;

										//set "toPage" as activePage
										$.mobile.activePage = $newActive;

										$page.jqmData( "page" )._trigger( "hide", null, { nextPage: $newActive } );
										$newActive.jqmData( "page" )._trigger( "show", null, { prevPage: $page } );
									}

									$origin.removeClass( snapClass + " " + dragClass );

									dragClassOn = dragStart = false;
									
									$page.trigger( "snapstop.pagination" );

									$pages
										.removeClass( prevPClass + " " + nextPClass )
										.removeAttr( "style" );
								}
						
							if( !samePage ){
								$page.jqmData( "page" )._trigger( "beforehide", null, { nextPage: $newActive } );
								//switch active page
								$newActive
									.addClass( $.mobile.activePageClass )
									.jqmData( "page" )._trigger( "beforeshow", null, { prevPage: $page } );
							}
							
							if( immediate ){
								$page.trigger( "snapping.pagination" );
								setTransform( newOffset );
								doneCB();
							}
							else{
								$page.trigger( "snapping.pagination" );
								$origin.addClass( snapClass );
								//switch to animation complete handler
								$page.one( "webkitTransitionEnd oTransitionEnd transitionend", doneCB );
								setTransform( newOffset );
							}
							
						}
						stop;					
					
					//line up the pages
					if( $nextPage ){
						$nextPage.addClass( nextPClass );
					}
					if( $prevPage ){	
						$prevPage.addClass( prevPClass );
					}
					
					//bind touch handlers
					$page
						.bind( "gesturestart.pagination touchend.pagination", function(){
							$page.unbind( ".pagination" );
						})
						.bind( "touchmove.pagination", moveHandler )
						.one( "touchend", function( e ){						
							var pOffset	= $page.offset().left,
								absOS	= Math.abs( pOffset ),
								toGo	= $page.width() - absOS;
			
							snapTo( absOS > 150 ? pOffset + ( pOffset > 0 ? toGo : -toGo ) : 0, absOS < 10 );
						});
				});
		}		
	});
	
}( jQuery ));