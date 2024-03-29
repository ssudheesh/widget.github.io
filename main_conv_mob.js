const ajaxCall = (key, url, prompt) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      data: {
        "name": "morpheus",
        "job": "leader"
        },

      success: function (response, status, xhr) {
        debugger;
        const originHeader = xhr.getResponseHeader('Origin');
        console.log("Origin Header:", originHeader);
        alert(originHeader);
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        debugger;
        const originHeader = xhr.getResponseHeader('Origin');
        console.log("Origin Header:", originHeader);
        alert(originHeader);
        const err = new Error('xhr error');
        err.status = xhr.status;
        reject(err);
      },
    });
  });
};

const url = "https://reqres.in/api/users";

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(apiKey, prompt) {
      const { response } = await ajaxCall(
        apiKey,
        url,
        prompt
      );
      console.log(response)
      return response;
    }
  }
  customElements.define("custom-widget", MainWebComponent);
})();
