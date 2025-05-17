// 🌐 NASA API Key (tek yerde tanımlı)
const NASA_API_KEY = "FWgQklCnUOvZXvuUF0Bh2Ju2XwP09Kb8uMmyASRL";

function loadAPOD() {
    $("#jsTitle").text("📅 APOD: Astronomy Picture of the Day");

    $("#jsContent").html(`
        <p>Bir tarih seçerek o güne ait astronomi görselini alın:</p>
        <input type="date" id="apodDate" class="input" value="${new Date().toISOString().split('T')[0]}" />
        <button id="fetchApod" type="button" class="btn">🔭 Görseli Getir</button>
        <div id="apodResult" class="result-box">⏳ Varsayılan görsel yükleniyor...</div>
    `);

    function fetchAPOD(date) {
        const url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${NASA_API_KEY}`;
        $("#apodResult").html("⏳ Görsel yükleniyor...");

        $.get(url)
            .done(function (data) {
                let media = data.media_type === "image"
                    ? `<img src="${data.url}" width="600" />`
                    : `<iframe width="560" height="315" src="${data.url}" frameborder="0" allowfullscreen></iframe>`;

                $("#apodResult").html(`
                    <h3>${data.title}</h3>
                    ${media}
                    <p>${data.explanation}</p>
                    <p><strong>Tarih:</strong> ${data.date}</p>
                `);
            })
            .fail(function (xhr) {
                $("#apodResult").html(`<p style="color:red;">🚨 Görsel alınamadı: ${xhr.status} - ${xhr.statusText}</p>`);
            });
    }

    fetchAPOD(new Date().toISOString().split("T")[0]);

    $("#fetchApod").on("click", function () {
        const selectedDate = $("#apodDate").val();
        fetchAPOD(selectedDate);
    });
}


function loadImageLibrary() {
    $("#jsTitle").text("🎞 NASA Görsel Arşivi");

    $("#jsContent").html(`
        <p>Ay ile ilgili görsellerin belli bir aralığını seçin:</p>
        <label class="label">Başlangıç: <input type="number" id="imgStart" class="input" value="0" /></label>
        <label class="label">Bitiş: <input type="number" id="imgEnd" class="input" value="4" /></label>
        <button id="fetchImages" type="button" class="btn">🖼 Görselleri Getir</button>
        <div id="imageGallery" class="result-box">⏳ Görseller yükleniyor...</div>
    `);

    function fetchImages(start, end) {
        const url = "https://images-api.nasa.gov/search?q=moon&media_type=image";
        $("#imageGallery").html("⏳ Yükleniyor...");

        $.get(url)
            .done(function (data) {
                const items = data.collection.items.slice(start, end);

                if (items.length === 0) {
                    $("#imageGallery").html("<p style='color:orange;'>⚠️ Bu aralıkta görsel bulunamadı.</p>");
                    return;
                }

                const gallery = items.map(i => {
                    const title = i.data[0].title;
                    const img = i.links[0].href;
                    return `<div style="margin-bottom:15px;"><h4>${title}</h4><img src="${img}" width="300" /></div>`;
                }).join('');

                $("#imageGallery").html(gallery);
            })
            .fail(function (xhr) {
                $("#imageGallery").html(`<p style="color:red;">🚨 Hata: ${xhr.status} - ${xhr.statusText}</p>`);
            });
    }

    fetchImages(0, 4);

    $("#fetchImages").on("click", function () {
        const start = parseInt($("#imgStart").val()) || 0;
        const end = parseInt($("#imgEnd").val()) || 4;
        fetchImages(start, end);
    });
}


function loadVideoLibrary() {
    $("#jsTitle").text("🎥 NASA Video Arşivi");

    $("#jsContent").html(`
        <p>Ay ile ilgili videoların belli bir aralığını seçin:</p>
        <label class="label">Başlangıç: <input type="number" id="vidStart" class="input" value="0" /></label>
        <label class="label">Bitiş: <input type="number" id="vidEnd" class="input" value="3" /></label>
        <button id="fetchVideos" type="button" class="btn">📽 Videoları Getir</button>
        <div id="videoGallery" class="result-box">⏳ Videolar yükleniyor...</div>
    `);


    function fetchVideos(start, end) {
        const url = "https://images-api.nasa.gov/search?q=moon&media_type=video";
        $("#videoGallery").html("⏳ Yükleniyor...");

        $.get(url)
            .done(function (data) {
                const items = data.collection.items.slice(start, end);

                if (items.length === 0) {
                    $("#videoGallery").html("<p style='color:orange;'>⚠️ Bu aralıkta video bulunamadı.</p>");
                    return;
                }

                const videoPromises = items.map(i => {
                    const title = i.data[0].title;
                    const metadataUrl = i.href;

                    return $.get(metadataUrl).then(mediaList => {
                        // İlk oynatılabilir mp4’ü bul
                        const videoUrl = mediaList.find(link => link.endsWith("~large.mp4") || link.endsWith("~orig.mp4"));
                        return `
                            <div style="margin-bottom:15px;">
                                <h4>${title}</h4>
                                ${videoUrl ? `<video width="500" controls src="${videoUrl}"></video>` : "<p style='color:red;'>🎬 Video oynatılamıyor</p>"}
                            </div>
                        `;
                    });
                });

                // Tüm videolar yüklendiğinde
                Promise.all(videoPromises).then(videos => {
                    $("#videoGallery").html(videos.join(''));
                });
            })
            .fail(function (xhr) {
                $("#videoGallery").html(`<p style="color:red;">🚨 Hata: ${xhr.status} - ${xhr.statusText}</p>`);
            });
    }

    fetchVideos(0, 3);

    $("#fetchVideos").on("click", function () {
        const start = parseInt($("#vidStart").val()) || 0;
        const end = parseInt($("#vidEnd").val()) || 3;
        fetchVideos(start, end);
    });
}

function loadMarsWeather() {
    $("#jsTitle").text("🌫 Mars Insight Hava Durumu (Sol Seçimi)");

    $("#jsContent").html(`
        <p>Bir <strong>Sol numarası</strong> girerek Mars Insight hava verisini görebilirsiniz (1 - 3742):</p>
        <label class="label">🔢 Sol Numarası:
            <input type="number" id="solInput" class="input" min="1" max="3742" value="3742" />
        </label>
        <button id="fetchWeatherBtn" type="button" class="btn">🌡 Veriyi Getir</button>
        <div id="weatherResult" class="result-box">⏳ Veri bekleniyor...</div>
    `);

    function fetchWeather(solNumber) {
        const url = `https://api.maas2.apollorion.com/${solNumber}`;
        $("#weatherResult").html("⏳ Yükleniyor...");

        $.get(url, function (response) {
            let data = typeof response === "string" ? JSON.parse(response) : response;

            const sol = data.sol ?? "Bilinmiyor";
            const min = data.min_temp ?? "Bilinmiyor";
            const max = data.max_temp ?? "Bilinmiyor";
            const pressure = data.pressure ?? "Bilinmiyor";
            const season = data.season ?? "Bilinmiyor";
            const date = data.terrestrial_date ?? "Bilinmiyor";
            const opacity = data.atmo_opacity ?? "Bilinmiyor";

            $("#weatherResult").html(`
                <table border="1" cellpadding="6" style="border-collapse:collapse;">
                    <tr><th>Tarih</th><td>${date}</td></tr>
                    <tr><th>Sol</th><td>${sol}</td></tr>
                    <tr><th>Min Sıcaklık</th><td>${min} °C</td></tr>
                    <tr><th>Max Sıcaklık</th><td>${max} °C</td></tr>
                    <tr><th>Basınç</th><td>${pressure} Pa</td></tr>
                    <tr><th>Durum</th><td>${season} | ${opacity}</td></tr>
                </table>
                <p style="color:orange;">📝 Not: Sol numarası 1 ile 3742 arasında olmalıdır.</p>
            `);
        }).fail(function () {
            $("#weatherResult").html(`<p style="color:red;">🚨 Veri alınamadı.</p>`);
        });
    }

    // İlk açılışta son SOL'u yükle (default 3742)
    fetchWeather(3742);

    // Butona basınca seçilen SOL numarasını al
    $("#fetchWeatherBtn").on("click", function () {
        const solNumber = parseInt($("#solInput").val());
        if (isNaN(solNumber) || solNumber < 1 || solNumber > 3742) {
            $("#weatherResult").html(`<p style="color:red;">⚠️ Geçerli bir sol numarası girin (1-3742)</p>`);
            return;
        }
        fetchWeather(solNumber);
    });
}


function loadMarsPhotos() {
    $("#jsTitle").text("🚀 Mars Rover Fotoğrafları");

    $("#jsContent").html(`
        <p>Bir tarih seçerek o güne ait Mars yüzey görüntülerini alabilirsiniz:</p>
        <label class="label">📅 Tarih (YYYY-MM-DD): <input type="date" id="marsPhotoDate" class="input" value="2025-05-15" /></label>
        <button id="fetchMarsPhotosBtn" type="button" class="btn">📷 Fotoğrafları Getir</button>
        <div id="marsPhotoResult" style="margin-top: 20px;" class="result-box" >⏳ Bekleniyor...</div>
    `);

    function fetchMarsPhotos(date) {
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${NASA_API_KEY}`;
        $("#marsPhotoResult").html("⏳ Fotoğraflar yükleniyor...");

        $.get(url, function (data) {
            const photos = data.photos;

            if (!photos || photos.length === 0) {
                $("#marsPhotoResult").html("<p>❌ Bu tarihe ait fotoğraf bulunamadı.</p>");
                return;
            }

            const gallery = photos.slice(0, 5).map(p => `
                <div style="margin-bottom: 15px;">
                    <img src="${p.img_src}" width="300" /><br/>
                    <strong>${p.camera.full_name}</strong> – ${p.earth_date}
                </div>
            `).join('');

            $("#marsPhotoResult").html(gallery);
        }).fail(function () {
            $("#marsPhotoResult").html(`<p style="color:red;">🚨 API hatası: Mars fotoğrafları alınamadı.</p>`);
        });
    }

    // Varsayılan olarak ilk çağrıyı yap
    fetchMarsPhotos("2025-05-12");

    // Kullanıcı tıklarsa tekrar yükle
    $("#fetchMarsPhotosBtn").on("click", function () {
        const selectedDate = $("#marsPhotoDate").val();
        if (!selectedDate) {
            $("#marsPhotoResult").html("<p style='color:red;'>❗ Lütfen geçerli bir tarih girin.</p>");
            return;
        }
        fetchMarsPhotos(selectedDate);
    });
}

function loadSolarEvents() {
    $("#jsTitle").text("☀️ Güneş Patlamaları");

    $("#jsContent").html(`
        <p>Tarih aralığı seçerek ilgili güneş patlamalarını görüntüleyin:</p>
        <label class="label">Başlangıç Tarihi: <input type="date" id="solarStart" class="input" value="2024-01-01" /></label>
        <label class="label">Bitiş Tarihi: <input type="date" id="solarEnd" class="input" value="2024-01-10" /></label>
        <button id="fetchSolar" type="button" class="btn">🔍 Getir</button>
        <div id="solarResult" style="margin-top: 20px;" class="result-box">⏳ Bekleniyor...</div>
    `);

    $("#fetchSolar").on("click", function () {
        const start = $("#solarStart").val();
        const end = $("#solarEnd").val();

        if (!start || !end) {
            $("#solarResult").html(`<p style="color:red;">🚨 Lütfen geçerli bir tarih aralığı girin.</p>`);
            return;
        }

        const url = `https://api.nasa.gov/DONKI/FLR?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`;

        $("#solarResult").html("⏳ Güneş olayları yükleniyor...");

        $.get(url, function (data) {
            if (!data || data.length === 0) {
                $("#solarResult").html("<p>⚠️ Bu tarihlerde kayıtlı güneş patlaması yok.</p>");
                return;
            }

            const list = data.map(e => `
                <tr>
                    <td>${e.beginTime}</td>
                    <td>${e.classType}</td>
                    <td>${e.sourceLocation ?? "?"}</td>
                    <td>${e.link ? `<a href="${e.link}" target="_blank">Detay</a>` : "-"}</td>
                </tr>
            `).join('');

            $("#solarResult").html(`
            <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%; max-width:800px;">
                <thead>
                    <tr>
                        <th>Başlangıç Zamanı</th>
                
                        <th class="solar-tooltip-header">Sınıf
                            <span class="solar-tooltip-box">🔍 Patlamanın büyüklük kategorisi (ör: X = en güçlü, M = orta, C = zayıf;<br> 0-10 arası deger alir)</span>
                        </th>
                
                        <th class="solar-tooltip-header">Konum
                            <span class="solar-tooltip-box">🧭 Güneş diski üzerindeki patlama konumu (ör: N15E23 → kuzey 15°, doğu 23°)</span>
                        </th>
                
                        <th>Kaynak</th>
                    </tr>
                </thead>
                <tbody>${list}</tbody>
            </table>
        `);


        }).fail(function () {
            $("#solarResult").html(`<p style="color:red;">🚨 API hatası: Veri alınamadı.</p>`);
        });
    });
}

function loadAsteroids() {
    $("#jsTitle").text("☄️ Yakın Dünya Asteroidleri");

    $("#jsContent").html(`
        <p>Belirli bir gün için asteroid verilerini görüntüleyin:</p>
        <label class="label">Tarih: <input type="date" id="asteroidDate" class="input" value="2024-05-01" /></label>
        <button id="fetchAsteroids" type="button" class="btn">🔎 Getir</button>
        <div id="asteroidResult" style="margin-top: 20px;" class="result-box">⏳ Bekleniyor...</div>
    `);

    $("#fetchAsteroids").on("click", function () {
        const date = $("#asteroidDate").val();

        if (!date) {
            $("#asteroidResult").html(`<p style="color:red;">🚨 Lütfen bir tarih girin.</p>`);
            return;
        }

        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${NASA_API_KEY}`;

        $("#asteroidResult").html("⏳ Veriler yükleniyor...");

        $.get(url, function (data) {
            const list = data.near_earth_objects[date];

            if (!list || list.length === 0) {
                $("#asteroidResult").html("<p>⚠️ Bu tarihte yakın Dünya asteroid kaydı yok.</p>");
                return;
            }

            const tableRows = list.map(obj => `
                <tr>
                    <td>${obj.name}</td>
                    <td>${obj.close_approach_data[0].miss_distance.kilometers} km</td>
                    <td>${obj.close_approach_data[0].relative_velocity.kilometers_per_hour} km/h</td>
                    <td>${obj.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</td>
                </tr>
            `).join('');

            $("#asteroidResult").html(`
                <table border="1" cellpadding="6" style="border-collapse:collapse;">
                    <thead>
                        <tr><th>Ad</th><th>Yaklaşım Mesafesi</th><th>Hız</th><th>Maks. Çap</th></tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            `);
        }).fail(function () {
            $("#asteroidResult").html(`<p style="color:red;">🚨 API hatası: Veri alınamadı.</p>`);
        });
    });
}

function loadEarthImagery() {
    $("#jsTitle").text("🌍 Earth Imagery API");

    $("#jsContent").html(`
        <p>Bir konum ve tarih girerek NASA'dan uydu fotoğrafı alın:</p>
        <div style="margin-bottom: 10px;">
            <label class="label">📍 Enlem (Latitude): <input type="text" id="lat" class="input" value="41.012260" /></label><br />
            <label class="label">📍 Boylam (Longitude): <input type="text" id="lon" class="input" value="28.985229" /></label><br />
            <label class="label">📅 Tarih (YYYY-MM-DD): <input type="date" id="date" class="input" value="2024-08-08" /></label><br />
            <label class="label">🔍 Görüntü Ölçeği (dim, opsiyonel): <input type="text" id="dim" class="input" value="0.32" /></label><br />
            <button id="getImageBtn" type="button" class="btn">📸 Görseli Getir</button>
        </div>
        <div id="earthImageResult" class="result-box"></div>
    `);

    $("#getImageBtn").on("click", function () {
        const lat = $("#lat").val();
        const lon = $("#lon").val();
        const date = $("#date").val();
        const dim = $("#dim").val() || "0.1";

        const imgUrl = `https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=${date}&dim=${dim}&api_key=${NASA_API_KEY}`;

        $("#earthImageResult").html("⏳ Görsel yükleniyor...");

        // Görseli test et
        const img = new Image();
        img.onload = function () {
            $("#earthImageResult").html(`
                <p>📷 <strong>${date}</strong> tarihli uydu görüntüsü:</p>
                <img src="${imgUrl}" width="500" style="filter: contrast(110%) brightness(105%) saturate(130%);" />
            `);
        };
        img.onerror = function () {
            $("#earthImageResult").html(`<p style="color:red;">🚫 Görsel bulunamadı. Bu tarih/konum kombinasyonunda görüntü yok.</p>`);
        };
        img.src = imgUrl;
    });
}

function loadEpic() {
    $("#jsTitle").text("🌐 EPIC Dünya Görüntüleri");

    $("#jsContent").html(`
        <p>Belirli bir aralıkta EPIC uydu görsellerini görmek için aralık seçin:</p>
        <label class="label">Başlangıç: <input type="number" id="epicStart" class="input" value="0" /></label>
        <label class="label">Bitiş: <input type="number" id="epicEnd" class="input" value="5" /></label>
        <button id="fetchEpicBtn" type="button" class="btn">🛰 Fotoğrafları Getir</button>
        <div id="epicGallery" style="margin-top: 20px;" class="result-box">⏳ Görseller yükleniyor...</div>
    `);

    function fetchEpic(start, end) {
        const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`;
        console.log("📡 EPIC API:", url);

        $("#epicGallery").html("⏳ Yükleniyor...");

        $.get(url)
            .done(function (data) {
                const items = data.slice(start, end);

                if (items.length === 0) {
                    $("#epicGallery").html("<p style='color:orange;'>⚠️ Bu aralıkta görüntü bulunamadı.</p>");
                    return;
                }

                const gallery = items.map(item => {
                    const [year, month, day] = item.date.split(" ")[0].split("-");
                    const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${item.image}.jpg`;

                    return `
                        <div style="margin-bottom:20px;">
                            <h4>${item.caption}</h4>
                            <img src="${imageUrl}" width="500" />
                            <p>📅 ${item.date}</p>
                        </div>
                    `;
                }).join('');

                $("#epicGallery").html(gallery);
            })
            .fail(function (xhr) {
                $("#epicGallery").html(`<p style="color:red;">🚨 API hatası: ${xhr.status} - ${xhr.statusText}</p>`);
            });
    }

    // Sayfa yüklendiğinde 0–5 arası getir
    fetchEpic(0, 5);

    $("#fetchEpicBtn").on("click", function () {
        const start = parseInt($("#epicStart").val()) || 0;
        const end = parseInt($("#epicEnd").val()) || 5;
        fetchEpic(start, end);
    });
}

function loadGeneLab() {
    $("#jsTitle").text("🧬 GeneLab Veri Arşivi");

    $("#jsContent").html(`
        <p>GeneLab, NASA'nın uzay biyolojisi alanındaki genomik veri arşividir.</p>
        <p>Şu anda GeneLab API erişimi doğrudan JSON formatında sağlanmamaktadır. Ancak veriler portal üzerinden erişilebilir:</p>
        <ul>
            <li><a href="https://genelab-data.ndc.nasa.gov/genelab/projects" target="_blank">🔗 GeneLab Projeleri</a></li>
        </ul>
        <p style="color:orange;">⚠️ Not: Gerçek zamanlı API veri çekme desteği şu anda devre dışıdır.</p>
    `);
}
