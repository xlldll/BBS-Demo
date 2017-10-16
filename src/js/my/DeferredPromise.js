/**
 * Created by LinChuQiang.
 * Deferred 简单示例用法
 */
$(function() {
	function asyncEvent() {
		var dfd = jQuery.Deferred();
		
		// Resolve after a random interval
		setTimeout(function() {
			dfd.resolve( "hurray" );
		}, Math.floor( 400 + Math.random() * 2000 ) );
		
		// Reject after a random interval
		setTimeout(function() {
			dfd.reject( "sorry" );
		}, Math.floor( 400 + Math.random() * 2000 ) );
		
		// Show a "working..." message every half-second
		setTimeout(function working() {
			if ( dfd.state() === "pending" ) {
				dfd.notify( "working... " );
				setTimeout( working, 500 );
			}
		}, 1 );
		
		// Return the Promise so caller can't change the Deferred
		return dfd.promise();
	}
	
	// Attach a done, fail, and progress handler for the asyncEvent
	$.when( asyncEvent() ).then(
		function( status ) {
			alert( status + ", things are going well" );
		},
		function( status ) {
			alert( status + ", you fail this time" );
		},
		function( status ) {
			$( "body" ).append( status );
		}
	);
})