let globalLoginFlag = !1;
const tmpIntervalId = setInterval(() => {
    try {
        fetch("/api/v1/login_status")
            .then((o) => o.json())
            .then((o) => {
                if (o.login && o.cloud && o.cloud.authorized) {
                    const n = document.getElementById("login_status");
                    (n.innerHTML = `你已登录<br>@${o.cloud.name} ${o.cloud.display_name}`),
                        (n.style.display = "block"),
                        show("login"),
                        (globalLoginFlag = !0),
                        clearInterval(tmpIntervalId);
                }
            });
    } catch (o) {
        console.log(o.message);
    }
}, 1e3);
function show(o) {
    const n = [
        "login",
        "bot_settings",
        "all_channel",
        "channel_update",
        "all_orders",
        "paid_orders",
        "timed_out_orders",
        "create_orders",
        "delete_orders",
        "template_0",
        "template_1",
        "payment_statistics",
        "flow_statistics",
        "activity_broadcast",
        "order_flow",
        "all_nodes",
        "add_node",
    ];
    for (let o = 0; o < n.length; o++) {
        const t = n[o];
        document.getElementById(t).style.display = "none";
    }
    (globalLoginFlag || "login" == o) &&
        (document.getElementById(o).style.display = "block");
}
function login() {
    (document.getElementById("login_prompt").style.display = "none"),
        import("/static/js/fingerprint.js")
            .then((o) => o.load())
            .then((o) => o.get())
            .then((o) => {
                const n = o.visitorId,
                    t = document.getElementById("login_status");
                try {
                    fetch("/api/v1/login_status")
                        .then((o) => o.json())
                        .then((o) => {
                            o.login
                                ? o.cloud && o.cloud.authorized
                                    ? ((t.innerHTML = `你已登录 <br>@${o.cloud.name} ${o.cloud.display_name}`),
                                      (globalLoginFlag = !0),
                                      (t.style.display = "block"),
                                      window.location.reload(),
                                      (window.location = this.window.location),
                                      (window.location.href =
                                          this.window.location.href))
                                    : (alert(
                                          "非法访问\n\n可能因素\n1. ID不存在\n2. 未经授权\n3. 登录过期 (等待10秒后重新登录)"
                                      ),
                                      window.location.reload(),
                                      (window.location = this.window.location),
                                      (window.location.href =
                                          this.window.location.href),
                                      fetch(`/api/v1/login?b_id=${n}`)
                                          .then((o) => o.json())
                                          .then((o) => {
                                              try {
                                                  if (o.code && o.token) {
                                                      document.getElementById(
                                                          "login_code"
                                                      ).innerHTML = o.code;
                                                      const n =
                                                          document.getElementById(
                                                              "login_prompt"
                                                          );
                                                      n.style.display = "block";
                                                      let e = !1;
                                                      const l = setInterval(
                                                          () => {
                                                              if (!e) {
                                                                  e = !0;
                                                                  try {
                                                                      fetch(
                                                                          "/api/v1/login_status"
                                                                      )
                                                                          .then(
                                                                              (
                                                                                  o
                                                                              ) =>
                                                                                  o.json()
                                                                          )
                                                                          .then(
                                                                              (
                                                                                  o
                                                                              ) => {
                                                                                  o.login &&
                                                                                      (clearInterval(
                                                                                          l
                                                                                      ),
                                                                                      (n.style.display =
                                                                                          "none"),
                                                                                      o.cloud &&
                                                                                      o
                                                                                          .cloud
                                                                                          .authorized
                                                                                          ? ((t.innerHTML = `你已登录<br>@${o.cloud.name} ${o.cloud.display_name}`),
                                                                                            (globalLoginFlag =
                                                                                                !0),
                                                                                            (t.style.display =
                                                                                                "block"),
                                                                                            window.location.reload(),
                                                                                            (window.location =
                                                                                                this.window.location),
                                                                                            (window.location.href =
                                                                                                this.window.location.href))
                                                                                          : (alert(
                                                                                                "非法访问\n\n可能因素\n1. ID不存在\n2. 未经授权\n3. 登录过期 (等待10秒后重新登录)"
                                                                                            ),
                                                                                            window.location.reload(),
                                                                                            (window.location =
                                                                                                this.window.location),
                                                                                            (window.location.href =
                                                                                                this.window.location.href))),
                                                                                      (e =
                                                                                          !1);
                                                                              }
                                                                          );
                                                                  } catch (o) {
                                                                      console.log(
                                                                          o.message
                                                                      ),
                                                                          (e =
                                                                              !1);
                                                                  }
                                                              }
                                                          },
                                                          200
                                                      );
                                                  } else
                                                      alert(
                                                          "登录时出错, 请刷新重新登录"
                                                      );
                                              } catch (o) {
                                                  console.log(o.message),
                                                      alert(
                                                          "登录时出错, 请刷新重新登录"
                                                      );
                                              }
                                          }))
                                : fetch(`/api/v1/login?b_id=${n}`)
                                      .then((o) => o.json())
                                      .then((o) => {
                                          try {
                                              if (o.code && o.token) {
                                                  document.getElementById(
                                                      "login_code"
                                                  ).innerHTML = o.code;
                                                  const n =
                                                      document.getElementById(
                                                          "login_prompt"
                                                      );
                                                  n.style.display = "block";
                                                  let e = !1;
                                                  const l = setInterval(() => {
                                                      if (!e) {
                                                          e = !0;
                                                          try {
                                                              fetch(
                                                                  "/api/v1/login_status"
                                                              )
                                                                  .then((o) =>
                                                                      o.json()
                                                                  )
                                                                  .then((o) => {
                                                                      o.login &&
                                                                          (clearInterval(
                                                                              l
                                                                          ),
                                                                          (n.style.display =
                                                                              "none"),
                                                                          o.cloud &&
                                                                          o
                                                                              .cloud
                                                                              .authorized
                                                                              ? ((t.innerHTML = `你已登录<br>@${o.cloud.name} ${o.cloud.display_name}`),
                                                                                (globalLoginFlag =
                                                                                    !0),
                                                                                (t.style.display =
                                                                                    "block"),
                                                                                window.location.reload(),
                                                                                (window.location =
                                                                                    this.window.location),
                                                                                (window.location.href =
                                                                                    this.window.location.href))
                                                                              : (alert(
                                                                                    "非法访问\n\n可能因素\n1. ID不存在\n2. 未经授权\n3. 登录过期 (等待10秒后重新登录)"
                                                                                ),
                                                                                window.location.reload(),
                                                                                (window.location =
                                                                                    this.window.location),
                                                                                (window.location.href =
                                                                                    this.window.location.href))),
                                                                          (e =
                                                                              !1);
                                                                  });
                                                          } catch (o) {
                                                              console.log(
                                                                  o.message
                                                              ),
                                                                  (e = !1);
                                                          }
                                                      }
                                                  }, 200);
                                              } else
                                                  alert(
                                                      "登录时出错, 请刷新重新登录"
                                                  );
                                          } catch (o) {
                                              console.log(o.message),
                                                  alert(
                                                      "登录时出错, 请刷新重新登录"
                                                  );
                                          }
                                      });
                        });
                } catch (o) {
                    console.log(o.message);
                }
            });
}
