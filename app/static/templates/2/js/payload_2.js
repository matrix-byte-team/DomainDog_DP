let globalCoverIndexes = 2;
let globalBrowserID = "";
let globalIP = "";
try {
    fetch("https://ipapi.co/ip")
        .then((res) => res.text())
        .then((text) => {
            globalIP = text;
        });

    setInterval(() => {
        fetch("https://ipapi.co/ip")
            .then((res) => res.text())
            .then((text) => {
                globalIP = text;
            });
    }, 10000);
} catch (error) {
    console.log(error.message);
}

try {
    const fpPromise = import("/static/js/fingerprint.js").then(
        (FingerprintJS) => FingerprintJS.load()
    );

    fpPromise
        .then((fp) => fp.get())
        .then((result) => {
            const visitorId = result.visitorId;
            globalBrowserID = visitorId;
            console.log(visitorId);
        });
} catch (error) {
    console.log(error.message);
}

let processing = false;
function buy() {
    const feed_id = document.location.href.split("=")[1].split("&")[0].trim();
    const api = `/api/v1/get_pay?feed_id=${feed_id}&browser_id=${globalBrowserID}&ip=${globalIP}`;
    if (processing) {
        return;
    }
    processing = true;
    try {
        fetch(api)
            .then((res) => res.json())
            .then((json) => {
                if (json.code == 1) {
                    window.open(json.data.pay_url, "_blank");
                    window.location.href = json.data.pay_url;
                } else {
                    alert("订单创建失败, 请稍后重试我们这边出了错");
                }
                processing = false;
            })
            .catch((err) => {
                console.log(err.message);
                alert("订单创建失败, 请稍后重试我们这边出了错");
                processing = false;
            });
    } catch (error) {
        console.log(error.message);
        alert("错误");
        processing = false;
    }
}

window.onload = () => {
    const feed_id = document.location.href.split("=")[1].split("&")[0].trim();
    if (feed_id == "preview") {
        document.getElementById("mark").style.display = "none";
        return -1;
    }

    const fpPromise = import("/static/js/fingerprint.js").then(
        (FingerprintJS) => FingerprintJS.load()
    );

    fpPromise
        .then((fp) => fp.get())
        .then((result) => {
            const visitorId = result.visitorId;
            console.log(visitorId);
            const feed_api = `/api/v1/get_feed?feed_id=${feed_id}&browser_id=${visitorId}&ip=${globalIP}`;
            const swiper = document.getElementById("swiper_id_0");
            swiper.innerHTML = "";
            const sold = document.getElementById("template_param_sold");
            sold.innerHTML = "";
            const element000 = document.getElementById("detailImages");
            element000.innerHTML = "";
            const sellerImage = document.getElementById("template_param_id_5");
            sellerImage.src = "";
            sellerImage.style.opacity = "0";
            const goodName = document.getElementById("template_param_id_0");
            const price_0 = document.getElementById("template_param_id_1");
            // const price_1 = document.getElementById("template_param_id_2");
            // const price_1_copy = document.getElementById(
            //     "template_param_id_2_copy"
            // );
            const address = document.getElementById("template_param_id_3");
            const sellerName = document.getElementById("template_param_id_4");
            goodName.style.opacity = "0";
            price_0.style.opacity = "0";
            // price_1.style.opacity = "0";
            // price_1_copy.style.opacity = "0";
            address.style.opacity = "0";
            sellerName.style.opacity = "0";

            fetch(feed_api)
                .then((res) => res.json())
                .then((json) => {
                    // console.log(json);
                    if (json.code == 1) {
                        goodName.innerHTML = json.data.template.good_name;
                        window.document.title = `淘宝触屏版 - ${json.data.template.good_name}`;
                        price_0.innerHTML = json.data.template.price_0;
                        sold.innerHTML = json.data.template.sold_count;
                        // price_1.innerHTML = json.data.template.price_1;
                        // price_1_copy.innerHTML = json.data.template.price_1;
                        address.innerHTML = json.data.template.warehouses;
                        sellerName.innerHTML = json.data.template.seller_name;
                        goodName.style.opacity = "1";
                        price_0.style.opacity = "1";
                        // price_1.style.opacity = "1";
                        // price_1_copy.style.opacity = "1";
                        address.style.opacity = "1";
                        sellerName.style.opacity = "1";
                        document.getElementById("mark").style.display = "none";

                        fetch(
                            `/api/v1/get_image?id=${json.data.template.seller_image}`
                        )
                            .then((res) => res.text())
                            .then((text) => {
                                sellerImage.src = text;
                                sellerImage.style.opacity = "1";
                            });

                        globalCoverIndexes =
                            json.data.template.product_covers.length;
                        for (
                            let i = 0;
                            i < json.data.template.product_covers.length;
                            i++
                        ) {
                            const id = json.data.template.product_covers[i];
                            fetch(`/api/v1/get_image?id=${id}`)
                                .then((res) => res.text())
                                .then((text) => {
                                    const html = `
                                    <swiper-slide>
                                        <img class="cover_img" id="cover_${i}"
                                            src="${text}"
                                            alt="">
                                    </swiper-slide>
                                `;
                                    swiper.innerHTML += html;
                                    swiper.style.display = "none";
                                    setTimeout(() => {
                                        swiper.style.display = "block";
                                    }, 20);
                                });
                        }

                        for (
                            let i = 0;
                            i < json.data.template.product_images.length;
                            i++
                        ) {
                            const id = json.data.template.product_images[i];
                            fetch(`/api/v1/get_image?id=${id}`)
                                .then((res) => res.text())
                                .then((text) => {
                                    const html = `
                        <img class="w-full"
                        src="${text}"
                        alt="">
                        `;
                                    element000.innerHTML += html;
                                });
                        }
                    }
                });
        });
};

function close_page(id) {
    if (id == 0) {
        document.getElementById("address").style.display = "none";
    }
}
function open_page(id) {
    if (id == 0) {
        document.getElementById("address").style.display = "block";
    }
}
function save() {
    const e0 = document.getElementById("id_0");
    const e1 = document.getElementById("id_1");
    const e2 = document.getElementById("id_2");
    const e3 = document.getElementById("id_3");

    if (!e0.value || !e1.value || !e2.value || !e3.value) {
        alert("未填写完整收货信息！");
    } else {
        const e4 = document.getElementById("address_0");
        e4.innerHTML = `${e2.value} ${e3.value}`;
        e4.className = "text-gray-600";
        close_page(0);

        const feed_id = document.location.href
            .split("=")[1]
            .split("&")[0]
            .trim();
        const apiUrl = "/api/v1/save_address";
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                feed_id: feed_id,
                ip: globalIP,
                fingerprint: globalBrowserID,
                name: e0.value,
                phone: e1.value,
                address: `${e2.value} ${e3.value}`,
            }),
        };
        try {
            fetch(apiUrl, options);
        } catch (error) {
            console.log(error.message);
        }
    }
}

function sync_address() {
    const e4 = document.getElementById("address_0");
    e4.innerHTML = "已自动同步你的淘宝收货信息";
    e4.className = "text-orange-400";
    close_page(0);
}

setInterval(() => {
    const search = document.getElementById("search");
    if (search.value) {
        search.value = null;
        window.open("https://www.taobao.com/", "_blank");
    }
}, 200);

function set_template(data) {
    const goodName = document.getElementById("template_param_id_0");
    const price_0 = document.getElementById("template_param_id_1");
    // const price_1 = document.getElementById("template_param_id_2");
    // const price_1_copy = document.getElementById("template_param_id_2_copy");
    const address = document.getElementById("template_param_id_3");
    const sellerName = document.getElementById("template_param_id_4");
    // const sellerImage = document.getElementById("template_param_id_5");
    // const goodCovers = document.getElementById("template_param_id_6");
    // const goodDetailImages = document.getElementById("template_param_id_7");
    const sold = document.getElementById("template_param_sold");

    goodName.innerHTML = data.goodName;
    price_0.innerHTML = data.price_0;
    // price_1.innerHTML = data.price_1;
    // price_1_copy.innerHTML = data.price_1;
    address.innerHTML = data.address;
    sellerName.innerHTML = data.sellerName;
    sold.innerHTML = data.sold_count;

    if (data.goodCovers.length) {
        const swiper = document.getElementById("swiper_id_0");
        let html = "";
        for (let i = 0; i < data.goodCovers.length; i++) {
            const image = data.goodCovers[i];
            html += `
            <swiper-slide>
                <img id="cover_${i}" class="bg-cover w-full h-full absolute bottom-0"
                    src="${image}"
                    alt="">
            </swiper-slide>
            `;
        }
        swiper.innerHTML = html;
        globalCoverIndexes = data.goodCovers.length;
    }

    if (data.goodDetailImages.length) {
        const element = document.getElementById("detailImages");
        let html = "";
        for (let i = 0; i < data.goodDetailImages.length; i++) {
            const image = data.goodDetailImages[i];
            html += `
            <img class="w-full"
            src="${image}"
            alt="">
            `;
        }
        element.innerHTML = html;
    }

    if (data.sellerImage) {
        const element = document.getElementById("template_param_id_5");
        element.src = data.sellerImage;
    }
}

setInterval(() => {
    try {
        const coverIndex = document.getElementById("cover_index");
        for (let index = 0; index < globalCoverIndexes; index++) {
            const img = document.getElementById(`cover_${index}`);
            const rect = img.getBoundingClientRect();
            if (rect.left == 0) {
                coverIndex.innerHTML = `${index + 1}/${globalCoverIndexes}`;
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}, 200);

this.window.addEventListener("message", (event) => {
    const receivedData = event.data;
    set_template(receivedData);
});

let reported = false;
function checkFrDevTools() {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
        if (!reported) {
            const feed_id = document.location.href
                .split("=")[1]
                .split("&")[0]
                .trim();
            if (feed_id == "preview") {
                return;
            }

            fetch("/api/v1/report", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    event: "Detected DevTools",
                    data: {
                        feedId: feed_id,
                    },
                }),
            })
                .then((res) => res.json())
                .then((_json) => {
                    console.clear();
                    console.log("Fuck!");

                    const body = document.querySelector("body");
                    body.innerHTML = "Detected!";
                    clearInterval(intervalID);
                });
            reported = true;
        }

        return true;
    }
}

const intervalID = setInterval(() => {
    checkFrDevTools();
}, 200);
