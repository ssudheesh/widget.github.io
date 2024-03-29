// Initialize conversation history
var conversation_history = "";

const ajaxCall = (key, url, prompt) => {
  return new Promise((resolve, reject) => {
    const messages = [
      { role: "user", content: prompt }
    ];

    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-4-turbo",
        messages: messages,
        max_tokens: 1024,
        n: 1,
        temperature: 0
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "region": "EU"
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        // Log the Origin header, if it exists
        const originHeader = xhr.getResponseHeader('Origin');
        console.log("Origin Header:", originHeader);
        alert(originHeader);
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        // Log the Origin header, if it exists
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

const url = "https://api.nlp.dev.uptimize.merckgroup.com/openai/deployments/gpt-4-turbo/chat/completions?api-version=2023-09-01-preview";

(function () {
  alert("main function");
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(apiKey, userPrompt, question) {
      alert("post request");
      try {
        // Include conversation history in the prompt
        const prompt = conversation_history ? conversation_history + '#INTERACTION#\n' + userPrompt : userPrompt;
        console.log("Updated Prompt");
        console.log(prompt);

        const { response } = await ajaxCall(apiKey, url, prompt);
        console.log(response);
        const text = response.choices[0].message.content;

        // Update conversation history with the current prompt and response
        conversation_history = 'Previous Question: ' + question + '\n Your previous Response: ' + text;

        // Split conversation history by the separator '#INTERACTION#'
        let historyInteractions = conversation_history.split('#INTERACTION#');

        // Limit conversation history to store only the last two interactions
        conversation_history = historyInteractions.slice(-2).join('#INTERACTION#');

        // Speak the text
        //this.speakText(text);

        return text;
      } catch (error) {
        console.error('An error occurred:', error);
        return error;
        //return 'An error occurred while processing the request.';
      }
    }

    speakText(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
  console.log("Spoken Text");

  // Set a timeout to stop speaking after 10 seconds
  setTimeout(() => {
    if (synth.speaking) {
      synth.cancel(); // Stop the speech synthesis if it's still speaking after 10 seconds
      console.log("Speech timeout reached. Stopping speech synthesis.");
    }
  }, 25000); // 10 seconds (10,000 milliseconds)
}

  }
  customElements.define("custom-widget", MainWebComponent);
})();
