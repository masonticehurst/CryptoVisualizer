<!DOCTYPE html>
<html>
<head>
	<title>Blockchain Transaction Viewer</title>
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
		<script src="https://rawgit.com/ethereum/web3.js/1.0/dist/web3.min.js"></script>
</head>
<body>
	<div id="particles-js"></div>

	<script src="js/particles.js"></script>
	<script src="js/app.js"></script>

	<div class="settings">
		<div class="innerSettings">
			<input type="checkbox" id="showETH" checked>
				<label for="showETH">Ethereum (ETH)</label>
			</input>
			&nbsp;&nbsp;&nbsp;
			<input type="checkbox" id="showBTC" checked>
				<label for="showBTC">Bitcoin (BTC)</label>
			</input>
			<br>
			<center><span>Session Details:</span></center>
			<span>BTC Transacted: </span>
			<span id="BTCTransacted" class="bitcoin">0</span>
			<span> BTC</span>
			<br>
			<span>BTC Transactions: </span>
			<span id="BTCTransactions" class="bitcoin">0</span>
			<br>
			<span>BTC Tx/s: </span>
			<span id="TXs_BTC" class="bitcoin"></span>
			<br>
			<span>Largest TX: </span>
			<span id="MaxTx_BTC" class="bitcoin">0</span>
			<br>
			<span>ETH Transacted: </span>
			<span id="ETHTransacted" class="ethereum">0</span>
			<span> ETH</span>
			<br>
			<span>ETH Transactions: </span>
			<span id="ETHTransactions" class="ethereum">0</span>
			<br>
			<span>ETH Tx/s: </span>
			<span id="TXs_ETH" class="ethereum"></span>
			<br>
			<span>Largest TX: </span>
			<span id="MaxTx_ETH" class="ethereum">0</span>
		</div>
	</div>

	<div class="transactionBTC"></div>
	<div class="transactionETH"></div>
	<script src="js/main.js"></script>
</body>
</html>