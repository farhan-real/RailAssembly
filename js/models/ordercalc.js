// Government Megaproject Contracts, Scarcity Pacing, and Delay Tolerances
class OrderEngine {
  static evaluateGovernmentBids() {
    // Check expiration on open market tenders
    state.marketTenders.forEach(t => {
      if (state.day >= t.expiresDay) {
        t.expired = true;
        Events.emit("toast", {
          text: `TENDER CLOSED: Ministry tender "${t.title}" bidding period has concluded.`,
          type: "normal"
        });
      }
    });
    state.marketTenders = state.marketTenders.filter(t => !t.expired);

    // Scarce Government Tenders: strictly at most 1 tender active at any time
    if (state.marketTenders.length === 0) {
      state.nextTenderCountdown -= 1;

      // When countdown elapses, government publishes exactly ONE scarce tender
      if (state.nextTenderCountdown <= 0) {
        const template = TENDER_TEMPLATES[Math.floor(Math.random() * TENDER_TEMPLATES.length)];
        const tender = {
          id: "tnd_" + Math.random().toString(36).substring(2, 8),
          ...template,
          issuedDay: state.day,
          expiresDay: state.day + 75, // Open for 75 days
          awarded: false
        };
        state.marketTenders.push(tender);

        // Substantial cooldown: next tender won't open for 90 to 140 days after this one
        state.nextTenderCountdown = 100 + Math.floor(Math.random() * 45);

        Events.emit("toast", {
          text: `NATIONAL TENDER GAZETTED: "${tender.title}" (${tender.unitsRequired} Units) published by ${tender.agency}!`,
          type: "success"
        });
        Events.emit("marketChanged");
      }
    }

    // Process delays and tolerance thresholds on active contracts
    state.activeContracts.forEach(contract => {
      const daysIntoCurrentQuarter = (state.day - contract.quarterStartDay);
      const daysPerBatch = 90;

      // If scheduled quarter elapsed without meeting batch delivery quota
      if (daysIntoCurrentQuarter > daysPerBatch && contract.deliveredThisQuarter < contract.batchSizePerQuarter) {
        contract.delayDaysAccrued += 1;

        // Tolerance breached: Government board cancels remaining order & shifts to competitors
        if (contract.delayDaysAccrued > contract.delayToleranceDays) {
          const forfeitedUnits = contract.totalUnits - contract.totalDelivered;
          state.reputation = Math.max(10, state.reputation - 18);
          Events.emit("toast", {
            text: `GOVERNMENT BREACH: Contract "${contract.title}" terminated due to excessive delays! ${forfeitedUnits} units redirected to competitors.`,
            type: "danger"
          });
          contract.terminated = true;
        }
      }
    });

    // Purge terminated or fully fulfilled contracts
    state.activeContracts = state.activeContracts.filter(c => !c.terminated && c.totalDelivered < c.totalUnits);
  }

  static submitTenderProposal(tenderId, variantId) {
    const tender = state.marketTenders.find(t => t.id === tenderId);
    const variant = state.variants.find(v => v.id === variantId);
    if (!tender || !variant) return { success: false, reason: "Invalid tender or train variant." };

    if (!variant.certified) {
      return { success: false, reason: "Ministry rules strictly require verified dynamic test track certification before bid submission." };
    }

    // Check technical prerequisites
    if (variant.testedStats.exactTopSpeed < tender.minSpeed) {
      return { success: false, reason: `Speed deficit: Model top speed (${variant.testedStats.exactTopSpeed} km/h) fails minimum tender specification (${tender.minSpeed} km/h).` };
    }

    if (tender.minPassengerCap > 0 && variant.stats.passengerCap < tender.minPassengerCap) {
      return { success: false, reason: `Capacity deficit: Train passenger seating (${variant.stats.passengerCap}) is below the required ${tender.minPassengerCap} seats.` };
    }

    // Proposal Scoring vs Competitor Syndicate
    const speedScore = Math.min(40, (variant.testedStats.exactTopSpeed / tender.minSpeed) * 35);
    const priceScore = Math.min(40, (tender.budgetPerUnit / variant.salePrice) * 35);
    const repScore = (state.reputation / 100) * 25;
    const totalProposalScore = speedScore + priceScore + repScore;

    // Competitor best score
    const competitorRivalScore = 68 + Math.random() * 18;

    if (totalProposalScore >= competitorRivalScore) {
      // Awarded sole government procurement contract
      const contract = {
        id: "cnt_" + Date.now().toString(36),
        tenderId: tender.id,
        title: tender.title,
        agency: tender.agency,
        variantId: variant.id,
        variantName: variant.name,
        unitSalePrice: variant.salePrice,
        unitProfit: variant.profitPerUnit,
        totalUnits: tender.unitsRequired,
        batchSizePerQuarter: tender.batchSizePerQuarter,
        delayToleranceDays: tender.delayToleranceDays,
        delayDaysAccrued: 0,
        quarterStartDay: state.day,
        deliveredThisQuarter: 0,
        totalDelivered: 0,
        totalRevenueEarned: 0
      };

      state.activeContracts.push(contract);
      state.reputation = Math.min(100, state.reputation + 5);

      // Remove the awarded tender from the open market
      state.marketTenders = state.marketTenders.filter(t => t.id !== tenderId);

      return { success: true, contract };
    } else {
      state.reputation = Math.max(10, state.reputation - 2);
      return {
        success: false,
        reason: `Bid rejected by evaluation committee (Our Score: ${Math.round(totalProposalScore)} vs Rival: ${Math.round(competitorRivalScore)}). Adjust profit margin or upgrade traction performance.`
      };
    }
  }

  static calculateQuarterlyEstimate() {
    let quarterlyProfitEst = 0;
    let quarterlyRevenueEst = 0;

    state.activeContracts.forEach(c => {
      const scheduledUnits = Math.min(c.batchSizePerQuarter, c.totalUnits - c.totalDelivered);
      quarterlyProfitEst += scheduledUnits * c.unitProfit;
      quarterlyRevenueEst += scheduledUnits * c.unitSalePrice;
    });

    const researchQuarterExpense = state.dailyResearchBudget * 90;
    const netProfitEst = quarterlyProfitEst - researchQuarterExpense;

    return {
      revenueEst: quarterlyRevenueEst,
      grossProfitEst: quarterlyProfitEst,
      netProfitEst: netProfitEst
    };
  }
}