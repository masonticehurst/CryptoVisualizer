<!DOCTYPE html>
<html>
<head>
	<title>Blockchain Transaction Viewer</title>
	<link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css">
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