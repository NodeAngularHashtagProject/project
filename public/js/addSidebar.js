$(window).load(function(){

  	// BAR CHART
  	new Morris.Bar({
  		// ID of the element in which to draw the chart.
  		element: 'barchart',
  		// Chart data records -- each entry in this array corresponds to a point on
  		// the chart.
  		data: [
    		{ y: '01-12-2015', a: 100},
    		{ y: '05-12-2015', a: 75},
    		{ y: '10-12-2015', a: 50},
    		{ y: '15-12-2015', a: 75}
  		],
  		xkey: 'y',
  		ykeys: ['a', 'b'],
  		labels: ['Series A', 'Series B']
	});

	// BAR CHART
  	new Morris.Line({
  		// ID of the element in which to draw the chart.
  		element: 'histochart',
  		// Chart data records -- each entry in this array corresponds to a point on
  		// the chart.
  		data: [
    		{ y: '01-12-2015', a: 100},
    		{ y: '05-12-2015', a: 75},
    		{ y: '10-12-2015', a: 50},
    		{ y: '15-12-2015', a: 75}
  		],
  		xkey: 'y',
  		ykeys: ['a', 'b'],
  		labels: ['Series A', 'Series B']
	});
});