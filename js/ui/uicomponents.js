// Professional Enterprise UI Components
class UI {
  static createStepper({ min, max, value, step = 1, onChange }) {
    const wrap = document.createElement("div");
    wrap.className = "c-stepper";

    const btnDec = document.createElement("button");
    btnDec.type = "button";
    btnDec.textContent = "-";

    const display = document.createElement("span");
    display.textContent = value;

    const btnInc = document.createElement("button");
    btnInc.type = "button";
    btnInc.textContent = "+";

    let cur = value;
    const update = (v) => {
      cur = Math.min(max, Math.max(min, v));
      display.textContent = cur;
      if (onChange) onChange(cur);
    };

    btnDec.onclick = () => update(cur - step);
    btnInc.onclick = () => update(cur + step);

    wrap.appendChild(btnDec);
    wrap.appendChild(display);
    wrap.appendChild(btnInc);
    return wrap;
  }

  static createSlider({ min, max, value, label, unit = "", step = 1, onInput }) {
    const container = document.createElement("div");
    container.className = "c-slider-wrap";

    const head = document.createElement("div");
    head.className = "c-slider-head";

    const lbl = document.createElement("span");
    lbl.className = "text-muted";
    lbl.textContent = label;

    const valBadge = document.createElement("span");
    valBadge.className = "font-mono text-blue";
    valBadge.textContent = `${value}${unit}`;

    head.appendChild(lbl);
    head.appendChild(valBadge);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "c-slider";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;

    slider.oninput = (e) => {
      const val = Number(e.target.value);
      valBadge.textContent = `${val}${unit}`;
      if (onInput) onInput(val);
    };

    container.appendChild(head);
    container.appendChild(slider);
    return container;
  }

  static showModal({ title, contentNode, actions = [] }) {
    const modalLayer = document.getElementById("modal-container");
    const modalFrame = document.getElementById("modal-content");
    modalFrame.innerHTML = "";

    const header = document.createElement("div");
    header.className = "card-header";
    const h3 = document.createElement("h3");
    h3.className = "card-title";
    h3.textContent = title;
    header.appendChild(h3);

    const closeBtn = document.createElement("button");
    closeBtn.className = "c-btn btn-ghost btn-sm";
    closeBtn.textContent = "Close";
    closeBtn.onclick = UI.closeModal;
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.style.margin = "12px 0";
    if (typeof contentNode === "string") {
      body.innerHTML = contentNode;
    } else {
      body.appendChild(contentNode);
    }

    const actionRow = document.createElement("div");
    actionRow.style.display = "flex";
    actionRow.style.justifyContent = "flex-end";
    actionRow.style.gap = "8px";

    actions.forEach(act => {
      const b = document.createElement("button");
      b.className = `c-btn ${act.className || "btn-ghost"}`;
      b.textContent = act.label;
      b.onclick = () => {
        if (act.onClick) act.onClick();
        if (!act.keepOpen) UI.closeModal();
      };
      actionRow.appendChild(b);
    });

    modalFrame.appendChild(header);
    modalFrame.appendChild(body);
    modalFrame.appendChild(actionRow);

    modalLayer.classList.remove("hidden");
  }

  static closeModal() {
    document.getElementById("modal-container").classList.add("hidden");
  }

  static toast(text, type = "normal") {
    const shelf = document.getElementById("toast-shelf");
    const t = document.createElement("div");
    t.className = "c-toast";
    if (type === "danger") t.style.borderColor = "var(--color-negative)";
    if (type === "success") t.style.borderColor = "var(--color-positive)";
    t.textContent = text;
    shelf.appendChild(t);

    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transition = "opacity 0.25s ease";
      setTimeout(() => t.remove(), 250);
    }, 3000);
  }
}