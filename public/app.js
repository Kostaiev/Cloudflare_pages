const elements = {
  button:
    document.querySelector(
      "#refresh-button",
    ),

  message:
    document.querySelector(
      "#status-message",
    ),

  serviceStatus:
    document.querySelector(
      "#service-status",
    ),

  environment:
    document.querySelector(
      "#environment",
    ),

  release:
    document.querySelector(
      "#release",
    ),

  colo:
    document.querySelector(
      "#colo",
    ),

  country:
    document.querySelector(
      "#country",
    ),

  requestId:
    document.querySelector(
      "#request-id",
    ),

  rawResponse:
    document.querySelector(
      "#raw-response",
    ),
};

function setText(element, value) {
  element.textContent =
    value ?? "unknown";
}

async function loadStatus() {
  elements.button.disabled = true;

  elements.message.classList.remove(
    "error",
  );

  elements.message.textContent =
    "Get answer Pages Function…";

  try {
    const response = await fetch(
      "/api/status",
      {
        headers: {
          accept: "application/json",
        },

        cache: "no-store",
      },
    );

    const body = await response.json();

    if (!response.ok) {
      throw new Error(
        body?.error?.message ??
          `HTTP ${response.status}`,
      );
    }

    setText(
      elements.serviceStatus,
      body.status,
    );

    setText(
      elements.environment,
      body.environment,
    );

    setText(
      elements.release,
      body.release,
    );

    setText(
      elements.colo,
      body.cloudflare?.colo,
    );

    setText(
      elements.country,
      body.cloudflare?.country,
    );

    setText(
      elements.requestId,
      body.requestId,
    );

    elements.rawResponse.textContent =
      JSON.stringify(
        body,
        null,
        2,
      );

    elements.message.textContent =
      `API response: ${body.timestamp}`;
  } catch (error) {
    elements.message.classList.add(
      "error",
    );

    elements.message.textContent =
      `Error: ${error.message}`;
  } finally {
    elements.button.disabled = false;
  }
}

elements.button.addEventListener(
  "click",
  loadStatus,
);

loadStatus();
