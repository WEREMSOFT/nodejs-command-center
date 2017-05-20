var colors = require('colors');
var exec = require('child_process').exec;
var prompt = require('prompt');
var Node = require('./model/Node');
var UserInputHandler = require('./controllers/UserInputHandler');

const fs = require('fs');
var ncp = require('ncp').ncp;
let GAME_NAME_HIVE = "Texan Tycoon";
let GAME_NAME_CAMEL_CASE = "texanTycoon";
let uih = new UserInputHandler();
var languajes = [];

var mainMenu = new Node('Main Menu');

var languajeMenu = new Node('Change Server Languaje');

mainMenu.addChild(languajeMenu);


languajes['EN'] = '33';  
languajes['DE'] = '56';  
languajes['FR'] = '49';  
languajes['IT'] = '67';  
languajes['ES'] = '94';  
languajes['JA'] = '69';  
languajes['KO'] = '70';  
languajes['PL'] = '80';  
languajes['PT'] = '82';  
languajes['RU'] = '86';  
languajes['ZH-CN'] = '25';  
languajes['SV'] = '114';  
languajes['TH'] = '116';  
languajes['TR'] = '119';  
languajes['VI'] = '123';  

// const readline = require('readline');
// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);
uih.enableRawMode();
uih.addListener('KeyboardInput', userInputHandler);

// process.stdin.addListener("data", function(d) {
//     // note:  d is an object, and when converted to a string it will
//     // end with a linefeed.  so we (rather crudely) account for that  
//     // with toString() and then trim() 
//     console.log("you entered: [" + 
//         d.toString().trim() + "]");
//   });

process.stdout.write('\033c');
printMenu();
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    commandHandler(str, key)
  }
  printMenu();
});
console.log('Press any key...');

function userInputHandler(word){
  commandHandler(word);
  printMenu();
}


function printMenu(){
	console.log('Select an option'.yellow);
	console.log('1. Start Misc Servers (account server, main australian server and slot server)'.green);
	console.log('2. Copy spritesheets from rtgbuild to local cdn'.green);
	console.log('3. Reset CDN'.green);
	console.log('4. Fix Underscore spritesheets naming convention'.green);
	console.log('5. Set Game Name'.green);
	console.log('6. Change server languaje to FR'.green);
	console.log('7. Change server languaje to DE'.green);
	console.log('8. Change server languaje to ES'.green);
	console.log('9. Change server languaje to EN'.green);
	console.log('a. Change server languaje to JA'.green);
	console.log('b. Change server languaje to TH'.green);
	console.log('c. Change server languaje to IT'.green);
	console.log('d. Change server languaje to PT'.green);
	console.log('e. Change server languaje to RU'.green);
	console.log('f. Change server languaje to TR'.green);
	console.log('g. Change server languaje to ZH-CN'.green);
	console.log('t. Clean pending games from the database'.green);
	console.log('u. Copy assets from hive to local'.green);
	console.log('v. Build Spritesheet Local'.green);
	console.log('w. Open hive sprite folder'.green);
	console.log('x. Open local sprite folder'.green);
	console.log('y. Copy DDCCORE Texan Tycoon from 0.0.10 to 17.05'.green);
	console.log('z. Copy DDCART Texan Tycoon from 0.0.10 to 17.05'.green);

	console.log('0. Exit'.green);

}

function printLanguajes(){
	var i = 1;
	console.log('Select languaje'.green);
	for (var key in languajes) {
    	console.log(i + '. [' + key + ']');
	  	i++;
	}
	
	  
	
}

function changeLang(pLangCode){
	exec('sqlcmd -d R0_0_10_A  -Q "update AccountCasinoSkin set languageID = ' + languajes[pLangCode] + ';"', function callback(error, stdout, stderr){
				if(error) {
					console.log(error);
					return;
				}
					console.log(stdout);
				});
}

function commandHandler(key){
	//process.stdout.write('\033c');
	switch(key){
		case '1':
			console.log('Starting Servers'.yellow);
			break;
		case '2':
			console.log('Copying Spritesheets'.yellow);
			break;
		case '3':
			resetCDN();
			break;
		case '5':
			changeGameName();
			break;
		case '6':
			changeLang('FR');
			break;
		case '7':
			changeLang('DE');
			break;
		case '8':
			changeLang('ES');
			break;
		case '9':
			changeLang('EN');
			break;
		case 'a':
			changeLang('JA');
			break;
		case 'b':
			changeLang('TH');
			break;
		case 'c':
			changeLang('IT');
			break;
		case 'd':
			changeLang('PT');
			break;
		case 'e':
			changeLang('RU');
			break;
		case 'f':
			changeLang('TR');
			break;
		case 'g':
			changeLang('ZH-CN');
			break;
		case 't':
			exec('sqlcmd -d R0_0_10_A  -Q "delete dbo.AUSlotsSavedGames; delete dbo.AUSlotsSubGameDataXML;"', function callback(error, stdout, stderr){
				if(error) {
					console.log(error);
					return;
				}
					console.log(stdout);
				}
			);
			break;
		case 'u':
			copyAssets('\\\\hive.ddcinternal.com\\Documents\\Product\\Games\\Slots\\GL Games - Mobile RTG (GUI Redesign)\\Texan Tycoon', 'C:\\Projects\\GamesAssets\\TexanTycoon');
			copyAssets('\\\\hive.ddcinternal.com\\Documents\\Product\\Games\\Slots\\GL Games - Mobile RTG (GUI Redesign)\\Nova 7s', 'C:\\Projects\\GamesAssets\\Nova7s');
			break;
		case 'v':
			runTexturePackerLocal('0.0.10');
			break;
		case 'w':
			openHiveSpriteSourceFolder();
			break;
		case 'x':
			openLocalSpriteSourceFolder();
			break;
		case 'y':
			copyAssets('c:\\ddccore\\0.0.10\\jsgames\\source\\auslots\\gamesrtg\\texantycoon\\common', 'c:\\ddccore\\R17.05.0\\jsgames\\source\\auslots\\gamesrtg\\texantycoon\\common');
			break;
		case '0':
			console.log('BYE'.rainbow);
			process.exit();
		default:
			console.log('you press ' + key);

	}
}

function resetCDN(){
	
	exec('C:\\localrtgbuild\\Binaries\\PackageBuilder\\Input\\0.0.10-HTML5RTG\\99-Reset-CDN.bat', function callback(error, stdout, stderr){
		if(error) {
			//console.log(error);
			return;
		}
			console.log(stdout);
		}
	);
}

/**
 * This function just copy files and folders from one folder to another.
 * @param source
 * @param destination
 */
function copyAssets(source, destination){
	ncp.limit = 16;
	ncp(source, destination, function (err) {
	 if (err) {
	   return console.error(err);
	 }
	 console.log('done copy!');
	});
}

function runTexturePackerLocal(pBranch){
	exec('powershell.exe -f "C:\\DDCArt\\' + pBranch + '-RTG\\BuildScripts\\BuildHTML5Local.ps1"  -WorkingFolder "C:\\DDCArt\\' + pBranch + '-RTG" -BuildScriptsFolder "C:\\DDCArt\\' + pBranch + '-RTG\\BuildScripts" -SkinsToProcess "_Default Casino_" -TexturePackerCommandLine "<C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin\\TexturePacker.exe>"', function callback(error, stdout, stderr){
		if(error) {
			console.log(error);
			return;
		}
			console.log(stdout);
		}
	);
}

function openHiveSpriteSourceFolder(){
		exec('explorer "\\\\hive.ddcinternal.com\\Documents\\Product\\Games\\Slots\\GL Games - Mobile RTG (GUI Redesign)\\' + GAME_NAME_HIVE + '\\LOTE\\PT\\iPad\\PNG\\Interface"', function callback(error, stdout, stderr){
		if(error) {
			//console.log(error);
			return;
		}
			console.log(stdout);
		}
	);

}

function openLocalSpriteSourceFolder(){
		exec('explorer "C:\\DDCArt\\0.0.10-RTG\\_Default Casino_\\HTML5Spa\\spritesource', function callback(error, stdout, stderr){
		if(error) {
			//console.log(error);
			return;
		}
			console.log(stdout);
		}
	);

}

function changeGameName(){
	uih.diableRawMode();
}