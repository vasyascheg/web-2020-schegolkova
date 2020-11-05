var hod = 'x';
var win = 0;
var hodNumber = 1;

function setBox (e)
{
	if (document.getElementById(e).textContent == '' && win != 1)
	{
		if (hod == 'x') {
			document.getElementById(e).append('x')
			document.getElementById('who').innerHTML = 'Player 2:'
			hodNumber+=1;
		}
		else{
			document.getElementById(e).append('o')
			document.getElementById('who').innerHTML = 'Player 1:'
			hodNumber+=1;
		}
		
		if (checkWin() == true){
			if(hod == 'x'){
				document.getElementById('who').innerHTML = '<b>Player 1 won!</b>'
				win = 1;
			}
			else{
				document.getElementById('who').innerHTML = '<b>Player 2 won!</b>'
				win = 1;
			}
		} 
		if (checkWin() == false && hodNumber==10)
		{
			document.getElementById('who').innerHTML = '<b>Draw</b>'
			win = 1;
		}

		if (hod == 'x') {
			hod = 'o';
		}
		else{
			hod = 'x';
		}
	}
}

function setWinChars(a, b, c){
	document.getElementById("box" + String(a))
	document.getElementById("box" + String(b))
	document.getElementById("box" + String(c))
}
function checkCombo(a, b, c){
	if(document.getElementById("box" + String(a)).textContent == 'x' && document.getElementById("box" + String(b)).textContent == 'x' && document.getElementById("box" + String(c)).textContent == 'x') return true;
	if(document.getElementById("box" + String(a)).textContent == 'o' && document.getElementById("box" + String(b)).textContent == 'o' && document.getElementById("box" + String(c)).textContent == 'o') return true;
	return false;
}

function checkWin(){

	if(checkCombo(1, 2, 3) == true) 
	{
		setWinChars(1, 2, 3);
		return true;
	}
	if(checkCombo(4, 5, 6) == true) 
	{
		setWinChars(4, 5, 6);
		return true;
	}
	if(checkCombo(7, 8, 9) == true) 
	{
		setWinChars(7, 8, 9);
		return true;
	}
	if(checkCombo(1, 4, 7) == true) 
	{
		setWinChars(1, 4, 7);
		return true;
	}
	if(checkCombo(2, 5, 8) == true) 
	{
		setWinChars(2, 5, 8);
		return true;
	}
	if(checkCombo(3, 6, 9) == true) 
	{
		setWinChars(3, 6, 9);
		return true;
	}
	if(checkCombo(1, 5, 9) == true) 
	{
		setWinChars(1, 5, 9);
		return true;
	}
	if(checkCombo(3, 5, 7) == true) 
	{
		setWinChars(3, 5, 7);
		return true;
	}
	return false;
}
