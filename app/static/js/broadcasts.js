window.onload = () => {
    const audio = document.createElement("audio");
    audio.src = "https://dict.youdao.com/dictvoice?audio=语音播报正常&le=zh";
    audio.play();
};

let isProcessing = false;

setInterval(() => {
    try {
        if (!isProcessing) {
            isProcessing = true;

            fetch("/api/v1/broadcasts")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((jsonData) => {
                    console.log(jsonData);

                    if (jsonData.code === 0) {
                        const audio = document.createElement("audio");
                        audio.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
                            jsonData.data.message
                        )}&le=zh`;
                        audio.play();
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                })
                .finally(() => {
                    isProcessing = false;
                });
        }
    } catch (error) {
        console.log(error.message);
        isProcessing = false;
    }
}, 1000);
