// Pub-Sub Event Bus, Persistence Engine, and Simulation Tick Runner
class Events {
  static listeners = {};

  static on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  static emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

class SimulationRunner {
  static tickTimer = null;

  static start() {
    this.stop();
    this.tickTimer = setInterval(() => {
      if (state.simSpeed > 0) {
        for (let i = 0; i < state.simSpeed; i++) {
          this.stepDay();
        }
      }
    }, 1000);
  }

  static stop() {
    if (this.tickTimer) clearInterval(this.tickTimer);
  }

  static stepDay() {
    state.day += 1;

    // Daily Research Progress
    if (state.activeResearchId && state.dailyResearchBudget > 0 && state.funds >= state.dailyResearchBudget) {
      state.funds -= state.dailyResearchBudget;
      const scienceYield = Math.max(1, Math.round(state.dailyResearchBudget / 400));
      state.sciencePoints += scienceYield;
      state.researchProgress += scienceYield;

      const tech = TECH_DATA.find(t => t.id === state.activeResearchId);
      if (tech && state.researchProgress >= tech.costScience) {
        state.unlockedTechs.add(tech.id);
        UI.toast(`R&D COMPLETE: "${tech.name}" is now unlocked!`, "success");
        state.activeResearchId = null;
        state.researchProgress = 0;
        Events.emit("techUnlocked");
      }
    }

    // Process Supplier Deliveries
    state.pendingDeliveries.forEach(del => {
      del.daysLeft -= 1;
      if (del.daysLeft <= 0) {
        state.addToWarehouse(del.componentId, del.count);
        const comp = state.findComponentById(del.componentId);
        UI.toast(`DELIVERY ARRIVED: ${del.count}x ${comp ? comp.name : "components"} delivered to active warehouse.`, "normal");
        del.finished = true;
      }
    });
    state.pendingDeliveries = state.pendingDeliveries.filter(d => !d.finished);

    // Process Assembly Lines
    state.productionLines.forEach(line => {
      line.dailyProgress += line.laborRate;
      if (line.dailyProgress >= 100) {
        line.dailyProgress = 0;
        line.unitsCompleted += 1;

        // Fulfill government contract if linked
        const targetContract = state.activeContracts.find(c => c.variantId === line.variantId && c.totalDelivered < c.totalUnits);
        if (targetContract) {
          targetContract.totalDelivered += 1;
          targetContract.deliveredThisQuarter += 1;
          state.funds += targetContract.unitSalePrice;
          targetContract.totalRevenueEarned += targetContract.unitSalePrice;
          state.quarterlyRevenue += targetContract.unitSalePrice;
          Events.emit("contractUnitDelivered");
        }

        if (line.unitsCompleted >= line.batchSize) {
          line.done = true;
          UI.toast(`Assembly batch completed for ${line.variantName}!`, "success");
        }
      }
    });
    state.productionLines = state.productionLines.filter(l => !l.done);

    // Quarter Check (Every 90 days)
    if (state.day % 90 === 0) {
      state.quarter = (state.quarter % 4) + 1;
      if (state.quarter === 1) state.year += 1;

      // Reset quarter counts on active contracts
      state.activeContracts.forEach(c => {
        c.quarterStartDay = state.day;
        c.deliveredThisQuarter = 0;
      });

      OrderEngine.evaluateGovernmentBids();
    }

    Events.emit("dayTick");
  }
}