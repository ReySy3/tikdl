const axios = require("axios");
const cheerio = require("cheerio");

class TikDownloader {
  async down(videoUrl) {
    try {
      const url = "https://tikdownloader.io/api/ajaxSearch";
      const params = new URLSearchParams({
        q: videoUrl,
        lang: "id",
      });

      const response = await axios.post(url, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "*/*",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
          Referer: "https://tikdownloader.io/id",
        },
      });

      const result = response.data;
      const $ = cheerio.load(result.data);

      return $(".video-data")
        .map((i, el) => {
          const thumbnail = $(el).find(".image-tik img").attr("src") || "No thumbnail";
          const title = $(el).find(".content h3").text().trim() || "No title";
          const downloadLinks = $(el)
            .find(".dl-action a")
            .map((i, em) => {
              const link = $(em).attr("href") || "";
              const tokenPart = link.split("token=")[1]?.split(".")[1] || "";
              if (!tokenPart) return null;

              const decoded = tokenPart.includes("-") ? tokenPart.split("-") : [tokenPart];
              const parsedUrl = decoded.length ? decoded.map((v) => atob(v)).join("") : null;

              try {
                const urlData = parsedUrl ? JSON.parse(parsedUrl) : null;
                return urlData
                  ? {
                      text: $(em).text().trim() || "No text",
                      link: urlData.url || "No URL",
                    }
                  : null;
              } catch (e) {
                console.error("Error parsing URL data:", e);
                return null;
              }
            })
            .get()
            .filter(Boolean);

          return downloadLinks.length
            ? {
                thumbnail: thumbnail,
                title: title,
                downloadLinks: downloadLinks,
              }
            : null;
        })
        .get()
        .filter(Boolean);
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }
}

module.exports = TikDownloader;
