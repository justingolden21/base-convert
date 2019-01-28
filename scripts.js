/* RECENT CHANGES
arrow keys up and down to change inputs
download history
highlight row of table if applicable
added custom base and arithmetic

TODO
make decimal work (parseFloat doesn't take a radix as a parameter)
make it so you cant enter incorrect digits into inputs, as opposed to ignoring them (for example, a "2" in binary input is ignotred, make it so it goes away instead)
fix arithmatic modal so that if you enter invalid digits for your chosen base it doesnt say NaN and instead displays an error message (bootstrap alert?)


MAYBE TODO
enter custom length (nible, byte, 4 bytes) and format to that/pad zeros
signed or unsigned?
convert to ascii characters?
maybe: copy and night mode button?
tutorial on how to convert
enter comma seperated list of items to convert
seperate app: calculate 2^n chart, ascii conversion chart, link here, and byte/kb/mb/gb converter
*/

window.onload = function() {

	$('#binary').select();
	
	$('#binary').onchange = function(e) {
		convert(e, 2);
	}
	$('#octal').onchange = function(e) {
		convert(e, 8);
	}
	$('#decimal').onchange = function(e) {
		convert(e, 10);
	}
	$('#hex').onchange = function(e) {
		convert(e, 16);
	}

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
	let doHighlight = true;

	if(base==undefined) { //arithmetic modal, handle arrow keys to use correct base
		doHighlight = false;
		if(document.activeElement.classList.contains('baseInput') ) {
			base = 10;
		}
		else if($('#baseCheckbox').is(':checked') ) {
			base = $('#baseInput').val() || 10;
		}
		else {
			if(document.activeElement.id=='val1Input') {
				base = $('#baseInput1').val() || 10;
			} else { //val2Input
				base = $('#baseInput2').val() || 10;
			}
		}
	}

	if(e.keyCode == 38) { //up
		document.activeElement.value = add(document.activeElement.value, 1, base);
		convert(e, base, doHighlight);
	}
	else if(e.keyCode == 40) { //down
		document.activeElement.value = add(document.activeElement.value, -1, base);
		convert(e, base, doHighlight);
	}
}

function add(val, addend, base) {
	let decimalAns = parseInt(val, base);
	decimalAns += addend;
	return decimalAns.toString(base).toUpperCase();
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
		$('#calcOutput').val(ans);
	} catch(err) { //todo: handle error more specifically ie. invalid base or invalid value
		$('#calcOutput').val('Error - Invalid Inputs');
	}
	$('#calcOutput').prop('disabled','true');
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

function convert(e, base, highlight=true) {
	let val = $('#' + e.target.id).val();

	let decimalAns = parseInt(val, base);
	if(isNaN(decimalAns) ) { //todo: show error?
		return;
	}

	$('#binary').val(decimalAns.toString(2) );
	$('#octal').val(decimalAns.toString(8) );
	$('#decimal').val(decimalAns);
	$('#hex').val(decimalAns.toString(16).toUpperCase() );
	
	$('#valConsole').val(
		'Bin: ' + decimalAns.toString(2) +
		', Oct: ' + decimalAns.toString(8) +
		', Dec: ' + decimalAns +
		', Hex: ' + decimalAns.toString(16).toUpperCase() + '\n\n' +
		$('#valConsole').val()
	);

	if(highlight) {
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
