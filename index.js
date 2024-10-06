const apiUrl = "https://api.kenliejugarap.com/tikwmbymarjhun/?url=${encodeURIComponent(url)"
fetch (apiUrl)
.then(response =>response.json())
.then(data>{
  console.log(data);
{
