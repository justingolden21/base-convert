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

let baseInput, baseInput1, baseInput2, baseInput3, val1Input, val2Input, operationInput, calcOutput, valConsole;

window.onload = function() {
		
	let binary = document.getElementById("binary");
	let octal = document.getElementById("octal");
	let decimal = document.getElementById("decimal");
	let hex = document.getElementById("hex");
	valConsole = document.getElementById("valConsole");

	binary.select();
	
	binary.onchange = function(e) {
		convert(e, 2);
	}
	octal.onchange = function(e) {
		convert(e, 8);
	}
	decimal.onchange = function(e) {
		convert(e, 10);
	}
	hex.onchange = function(e) {
		convert(e, 16);
	}

	document.getElementById("printLink").onclick = function() {
		let pageToPrint = window.open();
		pageToPrint.document.write("<title>Reference Table | Base Converter</title><img src='chart.png' onload='print();'>");
	}

	document.getElementById("reset").onclick = function() {
		valConsole.value = "";
	}

	document.getElementById("downloadLink").onclick = function() {
		let consoleValue = valConsole.value.split("\n");
		let text = [];
		for(item in consoleValue) {
			text.push(consoleValue[item] + "\r\n");
		}
		let data = new Blob(text, {type: "text/plain"});
		let textFile = window.URL.createObjectURL(data);
		document.getElementById("downloadLink").download = "History- Base Converter";
		document.getElementById("downloadLink").href = textFile;
	}

	let baseCheckbox = document.getElementById("baseCheckbox");

	baseCheckbox.onchange = function() {
		if(this.checked) {
			document.getElementById("basesDiv").style.display = "none";
			document.getElementById("baseLabel").style.display = "";
		}
		else {
			document.getElementById("basesDiv").style.display = "";
			document.getElementById("baseLabel").style.display = "none";
		}
	}


	baseInput = document.getElementById("baseInput");
	baseInput1 = document.getElementById("baseInput1");
	baseInput2 = document.getElementById("baseInput2");
	baseInput3 = document.getElementById("baseInput3");
	val1Input = document.getElementById("val1Input");
	val2Input = document.getElementById("val2Input");
	operationInput = document.getElementById("operationInput");
	calcOutput = document.getElementById("calcOutput");

	baseInput.onchange = baseInput1.onchange = baseInput2.onchange = baseInput3.onchange = val1Input.onchange = val2Input.onchange = operationInput.onchange = handleOperation;

	document.getElementById("basesDiv").style.display = "none";

}

let baseNames = {"binary":2, "octal":8, "decimal":10, "hex":16}

window.onkeyup = function(e) {
	if(e.keyCode != 38 && e.keyCode != 40)
		return;
	if(document.activeElement.nodeName != "INPUT")
		return;

	let base = baseNames[document.activeElement.id];
	if(e.keyCode == 38) { //up
		document.activeElement.value = add(document.activeElement.value, 1, base);
		convert(e, base);
	}
	else if(e.keyCode == 40) { //down
		document.activeElement.value = add(document.activeElement.value, -1, base);
		convert(e, base);
	}
}

function add(val, addend, base) {
	let decimalAns = parseInt(val, base);
	decimalAns += addend;
	return decimalAns.toString(base).toUpperCase();
}

function handleOperation() {
	calcOutput.disabled = "false";
	let ans;
	try {
		if(baseCheckbox.checked) {
			ans = doOperation(val1Input.value, baseInput.value, val2Input.value, baseInput.value, operationInput.value, baseInput.value);
		}
		else {
			ans = doOperation(val1Input.value, baseInput1.value, val2Input.value, baseInput2.value, operationInput.value, baseInput3.value);
		}
		calcOutput.value = ans;
	} catch(err) { //todo: handle error more specifically ie. invalid base or invalid value
		calcOutput.value = "Error - Invalid Inputs";
	}
	calcOutput.disabled = "true";
}

function doOperation(val1, base1, val2, base2, operation, answerBase) {
	let decimalVal1 = parseInt(val1, base1);
	decimalVal2 = parseInt(val2, base2);
	let decimalAns;
	if(operation == "+")
		decimalAns = decimalVal1 + decimalVal2;
	else if(operation == "-")
		decimalAns = decimalVal1 - decimalVal2;
	else if(operation == "/")
		decimalAns = decimalVal1 / decimalVal2;
	else
		decimalAns = decimalVal1 * decimalVal2;

	return decimalAns.toString(answerBase).toUpperCase();
}



function convert(e, base) {
	let val = document.getElementById(e.target.id).value;

	let decimalAns = parseInt(val, base);
	if(isNaN(decimalAns) ) { //todo: show error?
		return;
	}
	binary.value = decimalAns.toString(2);
	octal.value = decimalAns.toString(8);
	decimal.value = decimalAns;
	hex.value = decimalAns.toString(16).toUpperCase();
	
	valConsole.value =
	"Bin: " + decimalAns.toString(2) +
	", Oct: " + decimalAns.toString(8) +
	", Dec: " + decimalAns +
	", Hex: " + decimalAns.toString(16).toUpperCase() + "\n\n" +	
	valConsole.value;

	//unhighlight row
	let trs = document.getElementsByTagName("tr");
	for(let i=0; i<trs.length; i++) {
		trs[i].classList.remove("bg-info");
	}
	//highlight row if applicable
	if(decimalAns < 16 && decimalAns >= 0) {
		document.getElementsByTagName("tr")[decimalAns+1].classList.add("bg-info");
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