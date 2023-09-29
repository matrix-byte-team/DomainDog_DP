function baseOrderList() {
    fetch("/api/v1/agent_base_orders")
        .then((res) => res.json())
        .then((json) => {
            if (json.code == 0) {
                const orderData = json.data;
                const goods = document.getElementById("goods");
                for (const iterator of orderData) {
                    // console.log(iterator);
                    const option = `<option value="${iterator.orderId}">${iterator.goodName}</option>`;
                    goods.innerHTML += option;
                }
            }
        });
}

window.onload = () => {
    updateEmployeeInfo();
    baseOrderList();

    setInterval(() => {
        updateEmployeeInfo();
    }, 2000);
};

function updateEmployeeInfo() {
    const employee_id_number = document.getElementById("employee_id_number");
    const today_id0 = document.getElementById("today_id0");
    const history_id0 = document.getElementById("history_id0");
    const today_id1 = document.getElementById("today_id1");
    const history_id1 = document.getElementById("history_id1");
    const today_id2 = document.getElementById("today_id2");
    const history_id2 = document.getElementById("history_id2");
    const today_id3 = document.getElementById("today_id3");
    const history_id3 = document.getElementById("history_id3");

    fetch("/api/v1/getEmployee")
        .then((res) => res.json())
        .then((json) => {
            if (json.code == 0) {
                document.getElementById("loginPage").style.display = "none";

                employee_id_number.innerHTML = json.data.employee_id;
                today_id0.innerHTML = json.data.conversion_count;
                today_id1.innerHTML = json.data.orderCount;
                history_id0.innerHTML = json.data.history.conversionCount;
                history_id1.innerHTML = json.data.history.orderCount;
                today_id2.innerHTML = json.data.amount.toFixed(2);
                history_id2.innerHTML = json.data.history.amount.toFixed(2);
                today_id3.innerHTML = (
                    json.data.amount * 0.6 +
                    json.data.conversion_count * 1
                ).toFixed(2);
                history_id3.innerHTML = (
                    json.data.history.amount * 0.6 +
                    json.data.history.conversionCount * 1
                ).toFixed(2);
            }
        });
}

function e_login() {
    const eid = document.getElementById("employee_id");
    if (!eid.value) {
        alert("eid is required.");
        return -1;
    }

    const apiUrl = "/api/v1/employee_login";
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            employee_id: eid.value,
        }),
    };

    fetch(apiUrl, options)
        .then((res) => res.json())
        .then((json) => {
            if (json.code != 0) {
                alert("Login failed");
            } else {
                document.getElementById("loginPage").style.display = "none";
                updateEmployeeInfo();
            }
        });
}

let requestOrderButton = document.getElementById("requestOrderButton");
let requestOrderProcessing = false;
function create_order() {
    const goods = document.getElementById("goods");
    if (!goods.value) {
        alert("Empty");
        return -1;
    }

    if (requestOrderProcessing) {
        alert("Processing...");
        retrun;
    }
    requestOrderProcessing = true;
    requestOrderButton.innerHTML = "正在处理...";

    const apiUrl = "/api/v1/agent_create_order";
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            base_order_id: goods.value,
        }),
    };
    fetch(apiUrl, options)
        .then((res) => res.json())
        .then((json) => {
            if (json.code == 0) {
                const feedData = json.data;
                // console.log(feedData);
                const linkElement = document.getElementById("order_link");

                const domainName = document.domain;
                const template_index = 2;
                linkElement.innerHTML = `https://${domainName}/template/${template_index}?feed_id=${feedData.feedId}`;

                document.getElementById("order_result").style.display = "flex";
            } else {
                alert("订单创建失败，如果多次失败请联系你的老板");
            }

            requestOrderButton.innerHTML = "申请订单";
            requestOrderProcessing = false;
        })
        .catch((_err) => {
            requestOrderButton.innerHTML = "申请订单";
            requestOrderProcessing = false;
        });
}

function close_order_result() {
    document.getElementById("order_result").style.display = "none";
}
