
// bu dosya aslında bir module. ve biz module.exports yada kısaca exports
// diyerek bu module un require edildiğinde dışarı ne vereceğini söylüyorum.
// Body parser çağırmamdan hiçbir farkı yok.

// module.exports.getDay = function {
// burada fonksiyonun adı zaten sadece exportta önemli olduğu için fonksiyona
// bir variable muamelesi yapıyorum. Bu fonksiyonu aslında var fonkname gibi
// bir fonksiyona da eşitleyebilirdim.
exports.getDay = function() {
  // Burada bugünün adını oluşturuyorum göstrermek için
  let dateStr = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  let date = new Date(dateStr);
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return  date.toLocaleDateString("en-US", options);

}


exports.getDayName = function() {
  // Burada bugünün adını oluşturuyorum göstrermek için
  let dateStr = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  let date = new Date(dateStr);
  let options = {
    weekday: "long",
  };
  return  date.toLocaleDateString("en-US", options);

}
