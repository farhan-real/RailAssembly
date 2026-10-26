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

    // Daily Real-Time Research Progression
    if (state.activeResearchId && state.researchDaysLeft > 0) {
      state.researchDaysLeft -= 1;

      if (state.researchDaysLeft <= 0) {
        const tech = TECH_DATA.find(t => t.id === state.activeResearchId);
        if (tech) {
          state.unlockedTechs.add(tech.id);
          UI.toast(`Research Tree Complete: "${tech.name}" is now fully developed and unlocked.`, "success");
          SoundSystem.playSuccess();
        }
        state.activeResearchId = null;
        state.researchDaysLeft = 0;
        state.researchTotalDays = 0;
        state.saveToStorage();
        Events.emit("techUnlocked");
      }
    }

    // Process External Supplier Deliveries
    state.pendingDeliveries.forEach(del => {
      del.daysLeft -= 1;
      if (del.daysLeft <= 0) {
        state.addToWarehouse(del.componentId, del.count);
        const comp = state.findComponentById(del.componentId);
        UI.toast(`Supplier Delivery Arrived: ${del.count} units of ${comp ? comp.name : "components"} received into active warehouse.`, "normal");
        del.finished = true;
      }
    });
    state.pendingDeliveries = state.pendingDeliveries.filter(d => !d.finished);

    // Process In-House Manufacturing Production Jobs
    state.inHouseQueue.forEach(job => {
      job.daysRemaining -= 1;
      if (job.daysRemaining <= 0) {
        state.addToWarehouse(job.componentId, job.quantity);
        const comp = state.findComponentById(job.componentId);
        UI.toast(`In-House Fabrication Complete: ${job.quantity} units of ${comp ? comp.name : "components"} manufactured and stored.`, "success");
        job.finished = true;
      }
    });
    state.inHouseQueue = state.inHouseQueue.filter(j => !j.finished);

    // Process Train Assembly Lines
    state.productionLines.forEach(line => {
      line.dailyProgress += line.laborRate;
      if (line.dailyProgress >= 100) {
        line.dailyProgress = 0;
        line.unitsCompleted += 1;

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
          UI.toast(`Assembly Complete: 1 unit of ${line.variantName} ready for service.`, "success");
        }
      }
    });
    state.productionLines = state.productionLines.filter(l => !l.done);

    // Daily Ministry Contract Evaluation, Countdown & Mobilization
    OrderEngine.evaluateGovernmentBids();

    // Quarter Check (Every 90 days)
    if (state.day % 90 === 0) {
      state.quarter = (state.quarter % 4) + 1;
      if (state.quarter === 1) state.year += 1;

      state.activeContracts.forEach(c => {
        if (!c.isMobilizing) {
          c.quarterStartDay = state.day;
          c.deliveredThisQuarter = 0;
        }
      });
    }

    // Periodic simulation persistence every 3 days
    if (state.day % 3 === 0) {
      state.saveToStorage();
    }

    Events.emit("dayTick");
  }
}