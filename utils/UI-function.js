module.exports.FormatMoney = function(money) {
  if (money != null) {
    money = money.toString();
    var format = "";
    let i = money.length,
      k = 0;
    while (i-- > 0) {
      format = money[i] + format;
      k++;
      if (k % 3 === 0 && i != 0) format = "." + format;
    }
    return format;
  }
};

function checkTime(i) {
  return i < 10 ? "0" + i : i;
}

module.exports.FormatDate = function(date) {
  const h = checkTime(date.getHours()),
    m = checkTime(date.getMinutes()),
    s = checkTime(date.getSeconds());
  return date.toLocaleDateString() + " " + h + ":" + m + ":" + s;
};

module.exports.FormatBiddenName = function(name) {
  if (name != null) return name.substring(0, 5) + "***";
  else return "No one";
};
