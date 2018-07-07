//		--[[ Variables ]]--

// Stores all of the websockets once they have been initialized
var AVAILABLE_SOCKETS = {};

// Stores data related to the current session (time on page and transactions while on page)
var SESSION_DATA = {
	time: 0,

	TXnCount: {
		"BTC": 0,
		"ETH": 0,
	},

	show: {
		"BTC": true,
		"ETH": true,
	},

	highest: {
		"BTC": 0,
		"ETH": 0,
	}
};

// Stores current coin prices for translation from (ETC/BTC -> USD)
var COIN_PRICES = {
	"BTC": 0,
	"ETH": 0
};

// Refer to public price API, %s resembles string object to be parsed as ( coin, conversion_currency )
var COIN_API = "https://min-api.cryptocompare.com/data/price?fsym=%s&tsyms=%s";

// Currency (USD, EUR, etc)
var CURRENCY = "USD";

// Websites for transaction viewing
var CHAIN_EXPLORERS = {
	"BTC": "https://www.blocktrail.com/BTC/tx/",
	"ETH": "https://etherscan.io/tx/"
};

//		--[[ Functions ]]--

// Validate open status of socket (CONNECTING, OPEN, CLOSING, CLOSED)
function isSocketOpen(wSocket) {
	return (wSocket.readyState == wSocket.OPEN);
};

// Initializes web socket and stores it in our AVAILABLE_SOCKET array
function InitializeWebSocket(sURL, sCoin, tCommand, fCallback) {
	AVAILABLE_SOCKETS[sCoin] = new WebSocket(sURL);

	var activeSocket = AVAILABLE_SOCKETS[sCoin];

	// Attempt socket open
	activeSocket.onopen = function() {
		activeSocket.send(JSON.stringify(tCommand));
		console.log("WebSocket for " + sCoin + " successfully initialized!");
	};

	// Error handler (API down, etc)
	activeSocket.onerror = function() {
		// Uh-oh, something went wrong -- Let's try again later
		console.log("Error connecting to websocket, trying again in 30 seconds!");
		setTimeout(InitializeWebSocket, 30 * 1000, sURL, sCoin, tCommand, fCallback);

		return;
	};

	// Run our callback function when a message is received from the socket
	activeSocket.onmessage = fCallback;

	return activeSocket;
};

// Simple timer for calculating transactions per second
function timer(x) {
	return x > 9 ? x : "0" + x;
}

// Utility function for formatting strings (Stolen from EcmaScript (I think??))
String.prototype.format = function() {
	return [...arguments].reduce((p, c) => p.replace(/%s/, c), this);
};

// Update session timer once per second
setInterval(function() {
	var SESSION_ACTIVE = timer(++SESSION_DATA["time"] % 60);

	for (var k in SESSION_DATA["TXnCount"]) {
		// Update page text (Tx/s)
		$("#TXs_" + k).html(Math.round(SESSION_DATA["TXnCount"][k] / SESSION_ACTIVE));
	}
}, 1000);

// Get current coin prices (Cryptocompare API)
function getCoinPrices(sCoinID) {
	var req = new XMLHttpRequest();

	req.onload = function() {
		var obj = JSON.parse(req.responseText);

		// Very simple reply

		/*
			CURRENCY : PRICE (Float)
			{ "USD" : 6589.1 }
		*/

		COIN_PRICES[sCoinID] = obj.USD;
	}

	req.open("GET", COIN_API.format(sCoinID, CURRENCY), true);
	req.send();
};

for (var coin in COIN_PRICES) {
	// Check again for coin prices every 2 minutes
	setInterval(getCoinPrices, 120 * 1000, coin);
};

// Enable/Disable showing a coin
for (var k in SESSION_DATA["show"]) {
	$("#show" + k).change(function() {
		SESSION_DATA["show"][k] = this.checked;

		if (!this.checked) {
			var t = document.getElementsByClassName("transactionBG");

			for (var i = 0; i < t.length; i++) {
				if ($(t[i]).attr("id") == SESSION_DATA["show"][k]) {
					// Remove active elements
					$(t[i]).remove();
				};
			};
		}
	});
};

var lastTXN = 0;

// Add transaction to page
function addTX(s, l, scale, hash, totalTransacted) {

	// Dont add transaction if we're not allowed to see it
	if (!SESSION_DATA["show"][s]) {
		return;
	}

	// Increment TX counter
	SESSION_DATA["TXnCount"][s]++;

	// Wait in MS
	var __WAIT = 100;

	// If unrestricted specified, ignore waiting
	if (window.location.href.indexOf('eth_unrestricted=true') >= 0) {
		__WAIT = 0;
	};

	// Block transactions called too quickly (100ms or 1/10th of a second)
	if ((Date.now() - lastTXN) < __WAIT) {
		return;
	};

	// Replace highest TX if the current record is lower
	if (totalTransacted > SESSION_DATA["highest"][s]) {
		SESSION_DATA["highest"][s] = totalTransacted;

		var elem = document.getElementById("MaxTx_" + s);
		elem.innerHTML = (totalTransacted).toFixed(5);
	};

	// Remove non visible transactions
	var t = document.getElementsByClassName("transactionBG");

	for (var i = 0; i < t.length; i++) {
		if ($(t[i]).css('visibility') == "hidden") {
			$(t[i]).remove();
		};
	}

	// 		--[[ Begin Transaction Creation ]]--

	var background_tx = document.createElement("div");
	background_tx.className = ('transactionBG');
	background_tx.id = s;
	background_tx.style.animation = "translate " + l + "s linear forwards";
	background_tx.style.top = (Math.random() * (80 + 10)) + "%";

	// TX scale * original size (128 px)
	var size_adjusted = scale * 128;

	background_tx.style.width = size_adjusted + "px";
	background_tx.style.height = (size_adjusted + 100) + "px";

	var d = document.getElementsByClassName("transaction" + s);
	$(function() {
		$(d).append(background_tx);
	});

	var tx = document.createElement("img");
	tx.className = ('transaction');
	tx.src = "https://raw.githubusercontent.com/hyperdexapp/cryptocurrency-icons/master/128/icon/" + s.toLowerCase() + ".png";
	tx.style.width = (size_adjusted) + "px";
	tx.style.height = (size_adjusted) + "px";
	tx.onclick = function() {
		window.open(CHAIN_EXPLORERS[s] + hash, "_blank");
	};

	var h = size_adjusted / 4;
	var truncated_total = Math.round(totalTransacted * 10000) / 10000;

	var text = document.createElement("h4");
	text.className = ('amountOverlay');

	text.textContent = truncated_total;
	text.style.top = size_adjusted - (size_adjusted / 1.4) + "px";
	text.style.fontSize = size_adjusted / 4 + "px";
	text.onclick = function() {
		// Open explorer when clicking
		window.open(CHAIN_EXPLORERS[s] + hash, "_blank");
	};

	var set_attrib = [tx, text];

	for (var i = 0; i < set_attrib.length; i++) {
		set_attrib[i].setAttribute('data-toggle', 'tooltip');
		set_attrib[i].setAttribute('data-placement', 'top');
		set_attrib[i].setAttribute('data-html', 'true');

		var coin_error = "Error obtaining price data";

		if (COIN_PRICES[s] == 0) {
			getCoinPrices(s);
		}

		if (COIN_PRICES[s] == 0) {
			set_attrib[i].setAttribute('data-original-title', truncated_total + " " + s + "<br>" + coin_error);
		} else {
			var USDPrice = Math.round(COIN_PRICES[s] * truncated_total * 100) / 100;
			set_attrib[i].setAttribute('data-original-title', truncated_total + " " + s + "<br>" + "~ $" + USDPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
		}

		$(set_attrib[i]).tooltip();

		$(set_attrib[i])
			.mouseover(function() {
				$(background_tx).css("animation-play-state", "paused");
				$(text).css("animation-play-state", "paused");
				$(tx).css("animation-play-state", "paused");
			}).mouseleave(function() {
				$(background_tx).css("animation-play-state", "running");
				$(text).css("animation-play-state", "running");
				$(tx).css("animation-play-state", "running");
			});
	}

	background_tx.appendChild(tx);
	background_tx.appendChild(text);

	lastTXN = Date.now();
};

function BTCCallback(event) {
	var obj = JSON.parse(event.data);
	var hash = obj.x.hash;
	var totalTransacted = 0;

	for (var i2 = 0; i2 < obj.x.out.length; i2++) {
		totalTransacted = totalTransacted + (obj.x.out[i2].value / 100000000);
	}

	//console.log(  totalTransacted  );
	totalTransacted = (Math.round(totalTransacted * 100000000) / 100000000);

	var elem = document.getElementById("BTCTransacted");
	elem.innerHTML = (Number(elem.innerHTML) + totalTransacted).toFixed(5);

	var elem = document.getElementById("BTCTransactions");
	elem.innerHTML = (Number(elem.innerHTML) + 1).toFixed(0);

	// Maybe I should make this more dynamic sometime hmm....

	var moveSpeed;
	var scale;

	if (totalTransacted >= 500.00) {
		moveSpeed = 30;
		scale = 1.5;
	} else if (totalTransacted >= 100.00) {
		moveSpeed = 25;
		scale = 1;
	} else if (totalTransacted >= 10.00) {
		moveSpeed = 20;
		scale = 0.8;
	} else if (totalTransacted >= 1.00) {
		moveSpeed = 15;
		scale = 0.6;
	} else if (totalTransacted >= 0.10) {
		moveSpeed = 10;
		scale = 0.4;
	} else {
		moveSpeed = 5;
		scale = 0.3;
	}

	addTX("BTC", moveSpeed, scale, hash, totalTransacted);
}

// Initialize a socket to blockchain.info and register ourselves to receive transaction events
$( document ).ready( function() {
	var BTC_MAIN_SOCKET = InitializeWebSocket("wss://ws.blockchain.info/inv", "BTC", {
		op: "unconfirmed_sub"
	}, BTCCallback);
});

/* New block event -- saving for later :)
	/*
		op: "block"
		x:
			bits: 389315112
			blockIndex: 1708210
			estimatedBTCSent: 119582261015
			foundBy: {description: "Unknown", ip: "127.0.0.1", link: "http://www.blockchain.info/tx/eba0929919e0d55f36306536b5ee279b86480a6c87d5ec167a2f853e42f2c0e0", time: 1530764647}
			hash: "0000000000000000001cc663cb531c0f1e3f9ee1700e11946f9ebbccd25b4951"
			height: 530524
			mrklRoot: "b865fe6b121f819ee797bab271762d9c2b81113c50ec0922301c6fa8ec60b3d6"
			nTx: 2347
			nonce: 921498569
			prevBlockIndex: 1708209
			reward: 0
			size: 1116059
			time: 1530764647
			totalBTCSent: 640899605357
			txIndexes:
			(2347) [358409786, 358406872, 358409671, 358408532, 358406043, 358406158, 358406012, 358408501, 358409690, 358407379, 358406288, 358406833, 358407919, 358408350, 358406266, 358407212, 358408453, 358408444, 358405959, 358406878, 358406873, 358405965, 358406880, 358406877, 358406875, 358407491, 358409497, 358406199, 358407268, 358408070, 358407260, 358407249, 358407750, 358408137, 358406895, 358409458, 358407364, 358408545, 358407221, 358407187, 358409711, 358407866, 358409640, 358408169, 358408238, 358407938, 358406841, 358409641, 358409688, 358407401, 358409436, 358408150, 358408486, 358408011, 358409460, 358408135, 358408083, 358408318, 358408412, 358407396, 358408522, 358406849, 358406851, 358407556, 358409558, 358407144, 358407691, 358407634, 358409682, 358408446, 358408072, 358408357, 358409534, 358407086, 358407246, 358406115, 358406267, 358409541, 358407753, 358407734, 358406327, 358408133, 358407391, 358407956, 358408567, 358408450, 358405972, 358406186, 358408321, 358406860, 358407925, 358407378, 358409787, 358407116, 358408046, 358407218, 358408045, 358409430, 358407525, 358407325, …]
			version: 536870912
			weight: 3993026
	/*
*/

// Initialize a socket for the Ethereum blockchain using infura.io as our communicator
// Thankfully, Ethereum has their own websocket platform, very cool!

var ETH_WEBSOCKET;

function startETHSocket(ETH_WEBSOCKET) {
	return new Web3('wss://mainnet.infura.io/_ws');
}

ETH_WEBSOCKET = startETHSocket(ETH_WEBSOCKET);

// Subscribe to new block events
ETH_WEBSOCKET.eth.subscribe('newBlockHeaders', function(error, result) {
		if (error) {
			console.log("ERR: " + error);
		}
	})
	.on("data", function(blockHeader) {
		// Eth block mined, for later functionality
	});

// Subscribe to new transaction events
ETH_WEBSOCKET.eth.subscribe('pendingTransactions', function(error, result) {})
	.on("data", function(transactionHash) {
		ETH_WEBSOCKET.eth.getTransaction(transactionHash)
			.then(function(transaction) {

				if (!transaction || !transaction.hash || transaction.blockNumber) {
					return;
				}

				// The duplicate issue should be fixed entirely (hopefully)
				/*
					if (duplicate_cull.indexOf(transaction.hash) >= 0) {
						console.log("DUPLICATE!");
						return;
					}
				*/

				var totalTransacted = (transaction.value / 10E17);

				if (totalTransacted == 0) {
					return;
				}

				var elem = document.getElementById("ETHTransacted");
				elem.innerHTML = (Number(elem.innerHTML) + totalTransacted).toFixed(5);

				var elem = document.getElementById("ETHTransactions");
				elem.innerHTML = (Number(elem.innerHTML) + 1).toFixed(0);


				//duplicate_cull.push(transaction.hash);

				var hash = transaction.hash;

				// Maybe I should make this more dynamic sometime hmm....

				var moveSpeed;
				var scale;

				if (totalTransacted >= 5000.00) {
					moveSpeed = 40;
					scale = 1.5;
				} else if (totalTransacted >= 1000.00) {
					moveSpeed = 30;
					scale = 1.2;
				} else if (totalTransacted >= 100.00) {
					moveSpeed = 25;
					scale = 1;
				} else if (totalTransacted >= 10.00) {
					moveSpeed = 20;
					scale = 0.8;
				} else if (totalTransacted >= 1.00) {
					moveSpeed = 15;
					scale = 0.6;
				} else if (totalTransacted >= 0.10) {
					moveSpeed = 10;
					scale = 0.4;
				} else {
					moveSpeed = 5;
					scale = 0.3;
				}

				// Create transaction
				addTX("ETH", moveSpeed, scale, hash, totalTransacted);
			});
	})