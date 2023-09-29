let goodCovers = [];
let goodDetailImages = [];
let globalSellerImage;
let cCount0 = 0;
let cCount1 = 0;

let globalConfig = {
    template: {
        good_name:
            "短袖T恤女白色夏天潮流爆款个性绝美韩版气质遮肉显瘦上衣打底衫",
        price_0: 269,
        price_1: 259,
        warehouses: "广东广州仓发货",
        seller_name: "海外旗舰店",
        seller_image: "",
        product_covers: [],
        product_images: [],
        sold_count: "",
    },
    pay_channel: "p0",
    timeout: 60,
    magic: true,
    lock: false,
};

setInterval(() => {
    try {
        const goodName = document.getElementById("template_param_id_0");
        const price_0 = document.getElementById("template_param_id_1");
        const price_1 = document.getElementById("template_param_id_2");
        const address = document.getElementById("template_param_id_3");
        const sellerName = document.getElementById("template_param_id_4");
        // const sellerImage = document.getElementById("template_param_id_5");
        // const goodCovers = document.getElementById("template_param_id_6");
        // const goodDetailImages = document.getElementById("template_param_id_7");
        const magic = document.getElementById("security_setting_id_1");
        const timeout = document.getElementById("security_setting_id_0");
        const sold = document.getElementById("template_param_sold");
        const channel = document.getElementById("pay_channels");
        const lock = document.getElementById("security_setting_id_2");

        const data = {
            goodName: goodName.value,
            price_0: price_0.value,
            price_1: price_1.value,
            address: address.value,
            sellerName: sellerName.value,
            sellerImage: globalSellerImage,
            goodCovers: goodCovers,
            goodDetailImages: goodDetailImages,
            sold_count: sold.value,
            pay_channel: channel.value,
        };

        globalConfig.template.good_name = data.goodName;
        globalConfig.template.price_0 = data.price_0;
        globalConfig.template.price_1 = data.price_1;
        globalConfig.template.warehouses = data.address;
        globalConfig.template.seller_name = data.sellerName;
        globalConfig.template.seller_image = data.sellerImage;
        globalConfig.template.product_covers = data.goodCovers;
        globalConfig.template.product_images = data.goodDetailImages;
        globalConfig.timeout = timeout.value || 60;
        globalConfig.magic = magic.checked;
        globalConfig.template.sold_count = sold.value;
        globalConfig.pay_channel = channel.value;
        globalConfig.lock = lock.checked;

        const iframe = document.getElementById("template_preview");
        iframe.contentWindow.postMessage(data);
        if (cCount0 != cCount1) {
            iframe.className = "w-auto h-auto";
            cCount1 = cCount0;
            setTimeout(() => {
                iframe.className = "w-full h-full";
            }, 20);
        }
    } catch (error) {
        console.log(error.message);
    }
}, 200);

function download_config() {
    const jsonText = JSON.stringify(globalConfig, null, 4);
    const blob = new Blob([jsonText], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "template_params.json";
    a.click();
    URL.revokeObjectURL(a.href);
}

function load_config() {
    const fileInput = document.getElementById("config_file");
    fileInput.click();
    fileInput.addEventListener("change", () => {
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
                const fileContent = event.target.result;
                const jsonData = JSON.parse(fileContent);
                console.log(jsonData);
                globalConfig = jsonData;
                goodCovers = jsonData.template.product_covers;
                goodDetailImages = jsonData.template.product_images;
                globalSellerImage = jsonData.template.seller_image;

                const goodName = document.getElementById("template_param_id_0");
                const price_0 = document.getElementById("template_param_id_1");
                const price_1 = document.getElementById("template_param_id_2");
                const address = document.getElementById("template_param_id_3");
                const sellerName = document.getElementById(
                    "template_param_id_4"
                );
                const magic = document.getElementById("security_setting_id_1");
                const timeout = document.getElementById(
                    "security_setting_id_0"
                );
                goodName.value = jsonData.template.good_name;
                price_0.value = jsonData.template.price_0;
                price_1.value = jsonData.template.price_1;
                sellerName.value = jsonData.template.seller_name;
                address.value = jsonData.template.warehouses;
                timeout.value = jsonData.timeout;
                magic.checked = jsonData.magic;

                cCount0++;
            });
            reader.readAsText(selectedFile);
        }
    });
}

function uploadGoodCovers() {
    const fileInput = document.getElementById("template_param_id_6");
    fileInput.click();

    fileInput.addEventListener("change", (event) => {
        const files = event.target.files;
        const tmpArray = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                tmpArray.push(base64Data);
            };
            reader.readAsDataURL(file);
        }
        goodCovers = tmpArray;
        cCount0++;
    });
}

function uploadDetailImages() {
    const fileInput = document.getElementById("template_param_id_7");
    fileInput.click();

    fileInput.addEventListener("change", (event) => {
        const files = event.target.files;
        const tmpArray = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                tmpArray.push(base64Data);
            };
            reader.readAsDataURL(file);
        }
        goodDetailImages = tmpArray;
        cCount0++;
    });
}

function uploadSellerImage() {
    const fileInput = document.getElementById("template_param_id_5");
    fileInput.click();

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Data = e.target.result;
            globalSellerImage = base64Data;
        };
        reader.readAsDataURL(file);
        cCount0++;
    });
}

function close_result() {
    document.getElementById("create_result").style.display = "none";
}

let processing_order = false;
function create_order() {
    const button = document.getElementById("create_order_button");
    if (processing_order) {
        alert("处理中......");
        return -1;
    }
    processing_order = true;
    button.innerHTML = "处理中...";

    const api = "/api/v1/create_order";
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(globalConfig),
    };
    fetch(api, options)
        .then((res) => res.json())
        .then((json) => {
            if (json.code == 1) {
                document.getElementById("create_result").style.display =
                    "block";
                document.getElementById("result_feed_id").innerHTML =
                    json.data.feed_id;
                const t = document.getElementById("templates");
                let template_index = 0;
                if (t.value == "t1") {
                    template_index = 2;
                }
                if (t.value == "t0") {
                    template_index = 0;
                }
                const domainName = document.domain;
                document.getElementById(
                    "result_origin_link"
                ).innerHTML = `https://${domainName}/template/${template_index}?feed_id=${json.data.feed_id}`;
            } else {
                alert("失败");
            }

            button.innerHTML = "生成一个订单";
            processing_order = false;
        })
        .catch((err) => {
            console.log(err.message);
            alert("错误");
            button.innerHTML = "生成一个订单";
            processing_order = false;
        });
}

function update_token_a() {
    const api = "/api/v1/update_token_pay_channel_a";
    const token = document.getElementById("pay_channel_a_auth_token");
    if (!token.value) {
        alert("Auth Token is empty!");
        return -1;
    }

    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            token: token.value,
        }),
    };

    fetch(api, options)
        .then((res) => res.json())
        .then((json) => {
            if (json.code == -3) {
                alert("Auth Token 无效");
            } else if (json.code == 1) {
                alert("更新成功");
            } else {
                alert("更新失败");
            }
        });
}

function check_cloud_token_a() {
    const api = "/api/v1/check_token_a";
    fetch(api)
        .then((res) => res.json())
        .then((json) => {
            if (json.code == 1) {
                alert("有效");
            } else if (json.code == -2) {
                alert("Token 未设置");
            } else if (json.code == -3) {
                alert("Token 已失效, 需更新");
            } else {
                alert("错误");
            }
        });
}

let last_template = document.getElementById("templates").value;
setInterval(() => {
    try {
        const t = document.getElementById("templates");
        console.log(t.value);
        if (t.value == "t1" && t.value != last_template) {
            last_template = document.getElementById("templates").value;
            document.getElementById("template_preview").src = "";
            document.getElementById(
                "template_preview"
            ).src = `/template/2?feed_id=preview`;
        }
        if (t.value == "t0" && t.value != last_template) {
            last_template = document.getElementById("templates").value;
            document.getElementById("template_preview").src = "";
            document.getElementById(
                "template_preview"
            ).src = `/template/0?feed_id=preview`;
        }
    } catch (error) {
        console.log(error.message);
    }
}, 400);

function update_channel_b_info() {
    const apiUrl = "/api/v1/get_pay_channel_b_info";
    const e0 = document.getElementById("pcb_image");
    const e1 = document.getElementById("pcb_name");
    const e2 = document.getElementById("pcb_id");
    const e3 = document.getElementById("pcb_status");
    fetch(apiUrl)
        .then((res) => res.json())
        .then((json) => {
            if (json.code == 1) {
                e3.innerHTML = "已设置";
                e3.className = "text-lime-500";
                e0.src = json.data.headUrl;
                e1.innerHTML = json.data.userName;
                e2.innerHTML = json.data.userId;
            }
        });
}

function update_token_b0() {
    const e = document.getElementById("pay_channel_b_user_id");
    if (!e.value) {
        alert("Empty");
        return;
    }

    const apiUrl = `/api/v1/update_pcb_user_id/${e.value}`;
    fetch(apiUrl)
        .then((res) => res.json())
        .then((json) => {
            if (json.code == -1) {
                alert("错误");
            }
            if (json.code == 1) {
                alert("成功");
                update_channel_b_info();
            }
            if (json.code == -2) {
                alert("");
            }
        });
}

function update_channel_c_info() {
    const apiUrl = "/api/v1/getPCC_info";
    const e0 = document.getElementById("pcc_image");
    const e1 = document.getElementById("pcc_name");
    const e2 = document.getElementById("pcc_id");
    const e3 = document.getElementById("pcc_status");
    fetch(apiUrl)
        .then((res) => res.json())
        .then((json) => {
            if (json.code == 1) {
                e3.innerHTML = "已设置";
                e3.className = "text-lime-500";
                e0.src = json.data.headUrl;
                e1.innerHTML = json.data.nickname;
                e2.innerHTML = json.data.displayId;
            }
        });
}

function update_pcc_cookie() {
    const c = document.getElementById("pay_channel_c_cookie");
    const v = document.getElementById("pay_channel_c_verify");
    if (!c.value || !v.value) {
        alert("Empty");
        return;
    }

    const apiUrl = "/api/v1/update_pcc_cookie";
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            cookie: c.value,
            verify: v.value,
        }),
    };

    fetch(apiUrl, options)
        .then((res) => res.json())
        .then((json) => {
            if (json.code == 1) {
                alert("成功");
                update_channel_c_info();
            }
            if (json.code == -2) {
                alert("");
            }
        });
}

function change_me(e_id) {
    const fileInput = document.getElementById(`img_${e_id}`);
    fileInput.click();

    fileInput.addEventListener("change", (event) => {
        const files = event.target.files;
        const file = files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                const element = document.getElementById(e_id);
                element.src = base64Data;
            };
            reader.readAsDataURL(file);
        }
    });
}

function save_card() {
    html2canvas(document.querySelector("#capture")).then((canvas) => {
        document.getElementById("card_img").appendChild(canvas);
    });
}

setInterval(() => {
    try {
        fetch("/api/v1/getLock")
            .then((res) => res.json())
            .then((json) => {
                if (json.locked) {
                    window.location.reload();
                    window.location = this.window.location;
                    window.location.href = this.window.location.href;
                }
            });
    } catch (error) {
        console.log(error.message);
    }
}, 3000);

window.onload = () => {
    update_channel_b_info();
    update_channel_c_info();
};

function randomDelay() {
    return Math.random() * 2000;
}

function randomBlinks() {
    return Math.floor(Math.random() * 5) + 1;
}

function blinkLetter(letter) {
    setTimeout(function () {
        letter.style.visibility = "hidden";
        setTimeout(function () {
            letter.style.visibility = "visible";
            const blinks = randomBlinks();
            for (let i = 0; i < blinks; i++) {
                setTimeout(function () {
                    blinkLetter(letter);
                }, randomDelay());
            }
        }, randomDelay());
    }, randomDelay());
}

document.addEventListener("DOMContentLoaded", function () {
    update_channel_b_info();
    update_channel_c_info();

    const name = document.getElementById("blinking");
    const letters = name.textContent.split("");
    name.textContent = "";

    letters.forEach(function (letter) {
        const span = document.createElement("span");
        span.textContent = letter;
        name.appendChild(span);
        blinkLetter(span);
    });
});
