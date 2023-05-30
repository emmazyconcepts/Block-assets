function calculateRates() {
  var coinIDs = Array(),
    coinTable;
  coinTable = $(".coin-list");
  if (coinTable.length == 0) {
    return false;
  }
  $(".coin-id").map(function () {
    coinIDs.push($(this).text());
  });

  $.ajax({
    type: "get",
    url: "backend/_rateCalculator.php",
    data: {
      coins: coinIDs.toString(),
    },
    dataType: "Json",
    error: function () {
      Notiflix.Notify.Warning("Unable to update market prices");
    },
    success: function (response) {
      response = response[0];
      if (response["status"] == 0) {
        Notiflix.Notify.Warning(response["msg"]);
      } else {
        var quantity,
          attr,
          amount,
          assetSum = 0;
        //UPDATE RECORDS
        $(".coin-quantity").each(function () {
          quantity = Number($(this).text());
          attr = $(this).attr("coin-id");
          if (response["msg"][attr]) {
            amount = quantity * Number(response["msg"][attr]["usd"]);
            $(this)
              .parent()
              .find(".coin-usd-balance[coin-id=" + attr + "]")
              .text("$ " + parseFloat(amount, 10).toFixed(6).toString());
            assetSum += amount;
          }
          $("#portfolio_balance").text("$ " + assetSum.toFixed(6));
          $("#portfolio_balance_mini").text(assetSum.toFixed(6) + " USD");
        });
        //UPDATE MAIN ACCOUNT
      }
    },
  });
}

$(document).ready(function () {
  calculateRates();
  $("body").on("contextmenu", function (e) {
    e.preventDefault(); // prevent the default context menu from showing
    return false; // prevent further propagation of the event
  });
});

setInterval(calculateRates, 15000);
