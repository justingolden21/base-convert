window.onload = function() {
	$('#binary').select();
	
	$('#binary').change(function(e) {
		convert(e, 2);
	});
	$('#octal').change(function(e) {
		convert(e, 8);
	});
	$('#decimal').change(function(e) {
		convert(e, 10);
	});
	$('#hex').change(function(e) {
		convert(e, 16);
	});

	$('#printButton').click(function() {
		let pageToPrint = window.open();
		pageToPrint.document.write('<title>Reference Table | Base Converter</title><img src="chart.png" onload="print();">');
	});

	$('#reset').click(function() {
		$('#valConsole').val('');
	});

	$('#downloadHistoryButton').click(function() {
		let consoleValue = $('#valConsole').val().split('\n');
		let text = [];
		for(item in consoleValue) {
			text.push(consoleValue[item] + '\r\n');
		}
		let data = new Blob(text, {type: 'text/plain'});
		let textFile = window.URL.createObjectURL(data);

		let link = document.createElement('a');
		link.href = textFile;
		link.download = 'History- Base Converter.txt';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	});

	$('#baseCheckbox').change(function() {
		if(this.checked) {
			$('#basesDiv').css('display','none');
			$('#baseLabel').css('display','');
		}
		else {
			$('#basesDiv').css('display','');
			$('#baseLabel').css('display','none');
		}
	});

	$('#basesDiv').css('display','none');

	$('#calcButton').click(handleOperation);

	$('#downloadChartButton').click(function() {
		let link = document.createElement('a');
		link.href = 'chart.png';
		link.download = 'base chart.png';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	});

}

let baseNames = {'binary':2, 'octal':8, 'decimal':10, 'hex':16};

window.onkeyup = function(e) {
	if(e.keyCode != 38 && e.keyCode != 40)
		return;
	if(document.activeElement.nodeName != 'INPUT')
		return;

	let base = baseNames[document.activeElement.id];
	let isSimple = true;

	if(base==undefined) { //arithmetic modal, handle arrow keys to use correct base
		isSimple = false;
		if(document.activeElement.classList.contains('baseInput') ) {
			base = 10;
		}
		else if($('#baseCheckbox').is(':checked') ) { //todo: check if baseInput is valid
			base = $('#baseInput').val() || 10;
		}
		else {
			if(document.activeElement.id=='val1Input') {  //todo: check if baseInputs 1 and 2 are valid
				base = $('#baseInput1').val() || 10;
			} else { //val2Input
				base = $('#baseInput2').val() || 10;
			}
		}
	}

	if(e.keyCode == 38) { //up
		document.activeElement.value = add(document.activeElement.value, 1, base);
		convert(e, base, isSimple);
	}
	else if(e.keyCode == 40) { //down
		document.activeElement.value = add(document.activeElement.value, -1, base);
		convert(e, base, isSimple);
	}
	if(document.activeElement.value == 'NAN')
		document.activeElement.value = '0';
}

function add(val, addend, base) {
	let decimalAns = parseInt(val, base);
	decimalAns += addend;
	try {
		return decimalAns.toString(base).toUpperCase();
	} catch(err) {
		showError('Error - Invalid Inputs');
	}
}

function handleOperation() {
	$('#calcOutput').prop('disabled','false');
	let ans;
	try {
		if($('#baseCheckbox').is(':checked') ) {
			ans = doOperation($('#val1Input').val(), $('#baseInput').val(), $('#val2Input').val(), $('#baseInput').val(), $('#operationInput').val(), $('#baseInput').val() );
		}
		else {
			ans = doOperation($('#val1Input').val(), $('#baseInput1').val(), $('#val2Input').val(), $('#baseInput2').val(), $('#operationInput').val(), $('#baseInput3').val() );
		}
	
		if(isNaN(ans) ) {
			showError('Error - Invalid Inputs');
		} else {
			$('#calcOutput').val(ans);
			$('#complexError').html('');		
		}
	} catch(err) {
		showError('Error - Invalid Inputs');
	}
	$('#calcOutput').prop('disabled','true');
}

function showError(text) {
	$('#calcOutput').val('');
	$('#complexError').html(text);
}

function doOperation(val1, base1, val2, base2, operation, answerBase) {
	let decimalVal1 = parseInt(val1, base1);
	decimalVal2 = parseInt(val2, base2);
	let decimalAns;
	if(operation == '+')
		decimalAns = decimalVal1 + decimalVal2;
	else if(operation == '-')
		decimalAns = decimalVal1 - decimalVal2;
	else if(operation == '/')
		decimalAns = decimalVal1 / decimalVal2;
	else
		decimalAns = decimalVal1 * decimalVal2;

	return decimalAns.toString(answerBase).toUpperCase();
}

function convert(e, base, isSimple) {
	let val = $('#' + e.target.id).val() || '0';
	console.log(val);

	let decimalAns = parseInt(val, base);
	if(isNaN(decimalAns) ) {
		$('#simpleError').html('Invalid input');
		// e.target.value = '0';
		return;
	}

	$('#simpleError').html('');

	$('#binary').val(decimalAns.toString(2) );
	$('#octal').val(decimalAns.toString(8) );
	$('#decimal').val(decimalAns);
	$('#hex').val(decimalAns.toString(16).toUpperCase() );

	if(isSimple) {
		$('#valConsole').val(
			'Bin: ' + decimalAns.toString(2) +
			', Oct: ' + decimalAns.toString(8) +
			', Dec: ' + decimalAns +
			', Hex: ' + decimalAns.toString(16).toUpperCase() + '\n\n' +
			$('#valConsole').val()
		);

		$('tr').removeClass('bg-info');
		if(decimalAns < 16 && decimalAns >= 0)
			$('tr')[decimalAns+1].classList.add('bg-info');
	}
}

//https://stackoverflow.com/questions/3900701/onclick-go-full-screen?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function toggleFullscreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {  
      document.documentElement.requestFullScreen();  
    } else if (document.documentElement.mozRequestFullScreen) {  
      document.documentElement.mozRequestFullScreen();  
    } else if (document.documentElement.webkitRequestFullScreen) {  
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
    }  
  } else {  
    if (document.cancelFullScreen) {  
      document.cancelFullScreen();  
    } else if (document.mozCancelFullScreen) {  
      document.mozCancelFullScreen();  
    } else if (document.webkitCancelFullScreen) {  
      document.webkitCancelFullScreen();  
    }  
  }  
}
