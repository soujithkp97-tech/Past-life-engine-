const form = document.getElementById("reading-form");
const submit = document.getElementById("submit");
const errorBox = document.getElementById("error");
const resultWrap = document.getElementById("result-wrap");
const reading = document.getElementById("reading");
const formPanel = document.getElementById("form-panel");

document.getElementById("dob").max = new Date().toISOString().slice(0,10);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.textContent = "";
  submit.disabled = true;
  submit.querySelector("span").textContent = "UNFOLDING YOUR STORY…";
  const payload = {
    name: form.name.value.trim(),
    dob: form.dob.value,
    language: form.language.value
  };
  try {
    const response = await fetch("/api/reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to create the reading.");
    reading.textContent = data.reading;
    formPanel.classList.add("hidden");
    resultWrap.classList.remove("hidden");
    resultWrap.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    errorBox.textContent = err.message;
  } finally {
    submit.disabled = false;
    submit.querySelector("span").textContent = "REVEAL MY STORY";
  }
});

document.getElementById("new-reading").addEventListener("click", () => {
  resultWrap.classList.add("hidden");
  formPanel.classList.remove("hidden");
  form.reset();
  window.scrollTo({ top: 0, behavior: "smooth" });
});