// Dedicated Menu-Driven Carriage Consist Customization Modal
class ConsistView {
  static openConsistModal(builderInstance) {
    const container = document.createElement("div");

    const header = document.createElement("p");
    header.className = "text-muted";
    header.style.fontSize = "11px";
    header.style.marginBottom = "12px";
    header.textContent = "Specify trainset carriage count and customize individual coach traction distribution and operational roles:";
    container.appendChild(header);

    // Consist Length & Quick Presets Bar
    const controlBar = document.createElement("div");
    controlBar.style.display = "flex";
    controlBar.style.justifyContent = "space-between";
    controlBar.style.alignItems = "center";
    controlBar.style.marginBottom = "14px";
    controlBar.style.background = "var(--bg-panel)";
    controlBar.style.padding = "8px 12px";
    controlBar.style.borderRadius = "var(--radius-xs)";

    const lengthLabel = document.createElement("span");
    lengthLabel.style.fontSize = "11px";
    lengthLabel.style.fontWeight = "700";
    lengthLabel.textContent = `Consist Length: ${builderInstance.consistConfig.carriageCount} Carriages`;

    const stepper = UI.createStepper({
      min: 2,
      max: 12,
      value: builderInstance.consistConfig.carriageCount,
      step: 1,
      onChange: (newCount) => {
        ConsistView.resizeConsist(builderInstance, newCount);
        ConsistView.openConsistModal(builderInstance);
      }
    });

    controlBar.appendChild(lengthLabel);
    controlBar.appendChild(stepper);
    container.appendChild(controlBar);

    // Carriages List
    const carriageList = document.createElement("div");
    carriageList.style.display = "flex";
    carriageList.style.flexDirection = "column";
    carriageList.style.gap = "6px";
    carriageList.style.maxHeight = "360px";
    carriageList.style.overflowY = "auto";

    builderInstance.consistConfig.carriages.forEach((car, idx) => {
      const row = document.createElement("div");
      row.className = `carriage-item-row ${car.isPowered ? "powered" : "trailer"}`;

      row.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:2px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <strong style="font-size:12px;">Carriage ${idx + 1}</strong>
            <span class="c-badge ${car.isPowered ? "badge-blue" : "badge-amber"}">
              ${car.isPowered ? "Powered Motor Car" : "Unpowered Trailer Car"}
            </span>
          </div>
          <span class="text-muted" style="font-size:10px;">${car.name}</span>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="c-btn btn-ghost btn-sm btn-toggle-power" data-idx="${idx}">
            ${car.isPowered ? "Convert to Trailer" : "Convert to Powered"}
          </button>
          <button class="c-btn btn-ghost btn-sm btn-change-role" data-idx="${idx}">
            Role Menu...
          </button>
        </div>
      `;

      row.querySelector(".btn-toggle-power").onclick = () => {
        car.isPowered = !car.isPowered;
        if (!car.isPowered && car.role.includes("motor")) car.role = "intermediate_trailer";
        if (car.isPowered && car.role.includes("trailer")) car.role = "intermediate_motor";
        car.name = ConsistView.getRoleName(car.role, idx + 1);
        ConsistView.openConsistModal(builderInstance);
      };

      row.querySelector(".btn-change-role").onclick = () => {
        ConsistView.openRoleMenu(builderInstance, idx);
      };

      carriageList.appendChild(row);
    });

    container.appendChild(carriageList);

    UI.showModal({
      title: "Multiple-Unit Consist Composition Architecture",
      contentNode: container,
      actions: [
        {
          label: "Apply Consist Configuration",
          className: "btn-primary",
          onClick: () => {
            BuilderView.render(document.getElementById("viewport-root"));
          }
        }
      ]
    });
  }

  static resizeConsist(builderInstance, newCount) {
    const list = builderInstance.consistConfig.carriages;
    if (newCount > list.length) {
      for (let i = list.length; i < newCount; i++) {
        const isPow = i % 2 === 0;
        const role = isPow ? "intermediate_motor" : "intermediate_trailer";
        list.push({
          index: i + 1,
          role,
          isPowered: isPow,
          name: ConsistView.getRoleName(role, i + 1)
        });
      }
    } else if (newCount < list.length) {
      list.length = newCount;
    }
    builderInstance.consistConfig.carriageCount = newCount;
  }

  static openRoleMenu(builderInstance, carIdx) {
    const car = builderInstance.consistConfig.carriages[carIdx];
    const roles = [
      { id: "driving_motor", name: "Driving Cab Motor Coach", powered: true, desc: "Front/rear driver cab equipped with TCMS master and high-voltage traction motor bogie." },
      { id: "driving_trailer", name: "Driving Cab Trailer Coach", powered: false, desc: "Front/rear driver cab with lightweight unpowered guide bogies." },
      { id: "intermediate_motor", name: "Intermediate Motor Coach", powered: true, desc: "Underfloor inverter and traction motor pack driving standard passenger carbody." },
      { id: "intermediate_trailer", name: "Intermediate Trailer Coach", powered: false, desc: "Unpowered passenger coach maximizing seating density and reducing consist tare mass." },
      { id: "bistro_trailer", name: "Bistro & First-Class Trailer Coach", powered: false, desc: "Dining galley and premium passenger lounge with reduced seat count." }
    ];

    const items = roles.map(r => ({
      id: r.id,
      name: r.name,
      specs: r.powered ? "Traction Motorized Coach" : "Unpowered Trailer Coach",
      desc: r.desc,
      disabled: false
    }));

    BuilderView.openSelectionModal({
      title: `Select Role for Carriage ${carIdx + 1}`,
      subtitle: "Choose operational designation and traction assignment for this carriage:",
      items,
      activeId: car.role,
      onSelect: (roleId) => {
        const selectedRole = roles.find(r => r.id === roleId);
        car.role = selectedRole.id;
        car.isPowered = selectedRole.powered;
        car.name = ConsistView.getRoleName(selectedRole.id, carIdx + 1);
        ConsistView.openConsistModal(builderInstance);
      }
    });
  }

  static getRoleName(roleId, carNum) {
    switch (roleId) {
      case "driving_motor": return `Car ${carNum}: Driving Motor Coach`;
      case "driving_trailer": return `Car ${carNum}: Driving Trailer Coach`;
      case "intermediate_motor": return `Car ${carNum}: Intermediate Motor Coach`;
      case "intermediate_trailer": return `Car ${carNum}: Intermediate Trailer Coach`;
      case "bistro_trailer": return `Car ${carNum}: Bistro Trailer Coach`;
      default: return `Car ${carNum}: Passenger Coach`;
    }
  }
}