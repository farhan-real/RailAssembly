// System Settings View: Audio Sliders, Sound Effects, and Clear Data
class SettingsView {
  static render(container) {
    container.innerHTML = `
      <div class="view-grid-two">
        <!-- Audio & Sound Effects Settings -->
        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Sound Settings</span>
            <span class="c-badge ${state.audioMuted ? "badge-amber" : "badge-green"}">
              ${state.audioMuted ? "Muted" : "Active"}
            </span>
          </div>

          <p class="text-muted" style="font-size:11px; margin-bottom:14px;">
            Adjust master volume and sound effects synthesized through the Web Audio API.
          </p>

          <div style="display:flex; flex-direction:column; gap:16px;">
            <div id="slider-master-volume"></div>
            <div id="slider-sfx-volume"></div>

            <div style="display:flex; justify-content:space-between; align-items:center; padding-top:8px; border-top:1px solid var(--border-subtle);">
              <button class="c-btn ${state.audioMuted ? "btn-primary" : "btn-ghost"} btn-sm" id="btn-toggle-mute">
                ${state.audioMuted ? "Unmute Audio" : "Mute Audio"}
              </button>
              <div style="display:flex; gap:6px;">
                <button class="c-btn btn-ghost btn-sm" id="btn-test-chime">Test Chime</button>
                <button class="c-btn btn-ghost btn-sm" id="btn-test-hum">Test Motor Hum</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Saved Data & Reset -->
        <div class="c-card">
          <div class="card-header">
            <span class="card-title">Saved Game Data</span>
            <span class="c-badge badge-blue">Local Storage</span>
          </div>

          <p class="text-muted" style="font-size:11px; margin-bottom:14px;">
            View your saved game data count or clear everything to start fresh.
          </p>

          <div style="background:var(--bg-surface); padding:10px 12px; border-radius:var(--radius-xs); border:1px solid var(--border-subtle); margin-bottom:16px; display:flex; flex-direction:column; gap:6px; font-size:11px;">
            <div style="display:flex; justify-content:space-between;">
              <span class="text-muted">Saved Train Models:</span>
              <strong class="font-mono text-blue">${state.variants.length} Models</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span class="text-muted">Saved Carriage Types:</span>
              <strong class="font-mono text-blue">${state.customCarriageTypes.length} Types</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span class="text-muted">Active Contracts:</span>
              <strong class="font-mono text-positive">${state.activeContracts.length} Contracts</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span class="text-muted">Current Date:</span>
              <strong class="font-mono">${state.getDateString()}</strong>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:8px; border-top:1px solid var(--border-subtle);">
            <span class="text-muted" style="font-size:10px;">Reset everything and start over:</span>
            <button class="c-btn btn-danger btn-sm" id="btn-clear-game-data">Clear Data</button>
          </div>
        </div>
      </div>
    `;

    // Master Volume Slider
    const masterSlot = container.querySelector("#slider-master-volume");
    const masterSlider = UI.createSlider({
      min: 0,
      max: 100,
      value: state.masterVolume,
      label: "Master Volume",
      unit: "%",
      step: 5,
      onInput: (val) => {
        state.masterVolume = val;
        SoundSystem.updateVolumes();
        state.saveToStorage();
      }
    });
    masterSlot.appendChild(masterSlider);

    // Sound Effects Volume Slider
    const sfxSlot = container.querySelector("#slider-sfx-volume");
    const sfxSlider = UI.createSlider({
      min: 0,
      max: 100,
      value: state.sfxVolume,
      label: "Sound Effects Volume",
      unit: "%",
      step: 5,
      onInput: (val) => {
        state.sfxVolume = val;
        SoundSystem.updateVolumes();
        state.saveToStorage();
      }
    });
    sfxSlot.appendChild(sfxSlider);

    // Audio Test Buttons
    container.querySelector("#btn-toggle-mute").onclick = () => {
      state.audioMuted = !state.audioMuted;
      SoundSystem.updateVolumes();
      state.saveToStorage();
      SettingsView.render(container);
    };

    container.querySelector("#btn-test-chime").onclick = () => {
      SoundSystem.playSuccess();
    };

    container.querySelector("#btn-test-hum").onclick = () => {
      SoundSystem.playTestHum();
    };

    // Clear Data Confirmation Dialog
    container.querySelector("#btn-clear-game-data").onclick = () => {
      SoundSystem.playWarning();

      const modalContent = document.createElement("div");
      modalContent.innerHTML = `
        <p style="font-size:12px; line-height:1.45; color:var(--text-main); margin-bottom:12px;">
          Are you sure you want to <strong>clear all data and start over</strong>?
        </p>
        <div style="background:rgba(239, 68, 68, 0.08); border:1px solid rgba(239, 68, 68, 0.25); border-radius:var(--radius-xs); padding:10px 12px; margin-bottom:14px; font-size:11px; color:var(--color-negative);">
          &bull; All saved train models will be deleted.<br>
          &bull; All custom carriage types will be deleted.<br>
          &bull; Inventory and active contracts will reset.<br>
          &bull; Money will reset back to $14,500,000.
        </div>
        <p class="text-muted" style="font-size:11px;">This action cannot be undone.</p>
      `;

      UI.showModal({
        title: "Clear All Data",
        contentNode: modalContent,
        actions: [
          {
            label: "Cancel",
            className: "btn-ghost",
            onClick: () => {}
          },
          {
            label: "Yes, Clear Data",
            className: "btn-danger",
            onClick: () => {
              state.resetAllData();
              SoundSystem.playWarning();
              UI.toast("All data cleared. Game reset back to Year 1.", "normal");
              Events.emit("navTo", "dashboard");
            }
          }
        ]
      });
    };
  }
}