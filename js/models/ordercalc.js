// Government Contracts Engine, Multi-Parameter Validation & Scaled Performance Pricing
class OrderEngine {
  static evaluateGovernmentBids() {
    state.marketTenders.forEach(t => {
      if (state.day >= t.expiresDay) {
        t.expired = true;
        Events.emit("toast", {
          text: `Contract Closed: Bidding window for "${t.title}" has concluded.`,
          type: "normal"
        });
      }
    });

    const hadExpired = state.marketTenders.some(t => t.expired);
    state.marketTenders = state.marketTenders.filter(t => !t.expired);

    state.nextTenderCountdown -= 1;
    const targetConcurrentContracts = 5;

    // If completely empty, open opportunities immediately with zero delay
    if (state.marketTenders.length === 0) {
      state.nextTenderCountdown = 0;
    }

    // Generate new contract opportunities frequently and without delay
    if (state.marketTenders.length < targetConcurrentContracts && state.nextTenderCountdown <= 0) {
      const needed = state.marketTenders.length === 0
        ? 4
        : Math.min(2, targetConcurrentContracts - state.marketTenders.length);

      const activeTypes = new Set(state.marketTenders.map(t => t.type));
      const availableTemplates = CONTRACT_TEMPLATES.filter(tpl => !activeTypes.has(tpl.type));
      const pool = availableTemplates.length >= needed ? availableTemplates : CONTRACT_TEMPLATES;
      const shuffled = [...pool].sort(() => 0.5 - Math.random());

      for (let i = 0; i < needed && i < shuffled.length; i++) {
        const template = shuffled[i];
        state.marketTenders.push({
          id: "cnt_" + Math.random().toString(36).substring(2, 8),
          ...template,
          issuedDay: state.day,
          expiresDay: state.day + 60 + Math.floor(Math.random() * 30),
          awarded: false
        });
      }
      state.nextTenderCountdown = 10 + Math.floor(Math.random() * 6);
      state.saveToStorage();
      Events.emit("toast", {
        text: `New Ministry Contracts: Directorate published fresh rolling stock procurement opportunities.`,
        type: "success"
      });
      Events.emit("marketChanged");
    } else if (hadExpired) {
      state.saveToStorage();
      Events.emit("marketChanged");
    }

    // Process Active Contract Mobilization & Quotas
    state.activeContracts.forEach(contract => {
      if (contract.isMobilizing) {
        contract.mobilizationDaysLeft -= 1;
        if (contract.mobilizationDaysLeft <= 0) {
          contract.isMobilizing = false;
          contract.mobilizationDaysLeft = 0;
          contract.quarterStartDay = state.day;
          Events.emit("toast", {
            text: `Procurement Grace Ended: "${contract.title}" has entered active quarterly delivery quota schedule.`,
            type: "normal"
          });
        }
        return;
      }

      const daysIntoCurrentQuarter = (state.day - contract.quarterStartDay);
      const daysPerBatch = 90;

      if (daysIntoCurrentQuarter > daysPerBatch && contract.deliveredThisQuarter < contract.batchSizePerQuarter) {
        contract.delayDaysAccrued += 1;
        if (contract.delayDaysAccrued > contract.delayToleranceDays) {
          const forfeitedUnits = contract.totalUnits - contract.totalDelivered;
          state.reputation = Math.max(10, state.reputation - 20);
          Events.emit("toast", {
            text: `Contract Default: "${contract.title}" terminated due to delivery delays. Remaining ${forfeitedUnits} units transferred to competitors.`,
            type: "danger"
          });
          contract.terminated = true;
        }
      }
    });

    state.activeContracts = state.activeContracts.filter(c => !c.terminated && c.totalDelivered < c.totalUnits);
  }

  static validateVariantRequirements(variant, contract) {
    if (!variant || !contract) return { valid: false, errors: ["Invalid configuration."] };
    if (!variant.certified) {
      return { valid: false, errors: ["Test Track Certification Required: Ministry regulations mandate dynamic test track certification before contract submission."] };
    }

    const errors = [];
    const complianceDetails = [];

    (contract.requirements || []).forEach(req => {
      let candidateValue = 0;
      let isBooleanMatch = null;

      switch (req.key) {
        case "speed":
          candidateValue = variant.testedStats?.exactTopSpeed || variant.stats.theoreticalSpeed;
          break;
        case "acceleration":
          candidateValue = variant.testedStats?.certifiedAcceleration || variant.stats.acceleration;
          break;
        case "horsepower":
          candidateValue = variant.testedStats?.certifiedHorsepower || variant.stats.horsepower;
          break;
        case "tractiveEffort":
          candidateValue = variant.testedStats?.exactAdhesionKn || variant.stats.maxAdhesionKn;
          break;
        case "maxAxleLoad":
          candidateValue = variant.testedStats?.certifiedAxleLoad || variant.stats.axleLoad;
          break;
        case "passengerCap":
          candidateValue = variant.stats.passengerCap || 0;
          break;
        case "unitCost":
          candidateValue = variant.unitProductionCost;
          break;
        case "efficiency":
          candidateValue = Math.round((variant.testedStats?.exactEfficiency || (variant.stats.totalEfficiency * 100)));
          break;
        case "safetyScore":
          candidateValue = variant.stats.safetyScore || 0;
          break;
        case "batteryRange":
          candidateValue = variant.stats.batteryRangeKm || 0;
          break;
        case "carriageCount":
          candidateValue = variant.stats.carriageCount || 1;
          break;
        case "aerodynamics":
          candidateValue = variant.stats.components?.carbody?.dragCd || 0.40;
          break;
        case "multiSystem": {
          const pVolt = variant.stats.components?.pantograph?.voltage || "";
          const tVolt = variant.stats.components?.transformer?.supportedVoltage || "";
          isBooleanMatch = pVolt.includes("Multi") || tVolt.includes("Multi");
          break;
        }
      }

      if (isBooleanMatch !== null) {
        if (!isBooleanMatch) {
          errors.push(`${req.label}: Model does not satisfy specification (${req.value}).`);
        } else {
          complianceDetails.push({ label: req.label, candidate: "Compliant", target: req.value, unit: "", met: true });
        }
      } else if (req.compare === "min" && candidateValue < req.value) {
        errors.push(`${req.label} Deficit: Certified ${candidateValue} ${req.unit} is below mandatory ${req.value} ${req.unit}.`);
      } else if (req.compare === "max" && candidateValue > req.value) {
        errors.push(`${req.label} Exceeded: ${candidateValue} ${req.unit} exceeds allowable limit of ${req.value} ${req.unit}.`);
      } else {
        complianceDetails.push({ label: req.label, candidate: candidateValue, target: req.value, unit: req.unit, met: true });
      }
    });

    return { valid: errors.length === 0, errors, complianceDetails };
  }

  static evaluateVariantSwap(contract, newVariant) {
    const originalTemplate = CONTRACT_TEMPLATES.find(t => t.title === contract.title) || { requirements: [] };
    const check = this.validateVariantRequirements(newVariant, originalTemplate);
    if (!check.valid) return { eligible: false, reason: check.errors[0] };

    const budgetCeiling = contract.budgetPerUnit || (contract.unitSalePrice * 1.35);
    let proposedPrice = Math.max(contract.unitSalePrice, newVariant.salePrice);
    if (newVariant.stats.theoreticalSpeed > (originalTemplate.requirements?.find(r => r.key === "speed")?.value || 0)) {
      proposedPrice = Math.round(proposedPrice * 1.06);
    }
    const approvedPrice = Math.min(budgetCeiling, proposedPrice);
    const approvedProfit = approvedPrice - newVariant.unitProductionCost;

    return {
      eligible: true,
      newPrice: approvedPrice,
      newProfit: approvedProfit,
      priceDelta: approvedPrice - contract.unitSalePrice,
      isHigherPrice: approvedPrice > contract.unitSalePrice
    };
  }

  static swapContractVariant(contractId, newVariantId) {
    const contract = state.activeContracts.find(c => c.id === contractId);
    const newVariant = state.variants.find(v => v.id === newVariantId);
    if (!contract || !newVariant) return { success: false, reason: "Contract or variant not found." };

    const evalResult = this.evaluateVariantSwap(contract, newVariant);
    if (!evalResult.eligible) return { success: false, reason: evalResult.reason };

    contract.variantId = newVariant.id;
    contract.variantName = newVariant.name;
    contract.unitSalePrice = evalResult.newPrice;
    contract.unitProfit = evalResult.newProfit;
    state.saveToStorage();

    return { success: true, newPrice: evalResult.newPrice, delta: evalResult.priceDelta };
  }

  static submitTenderProposal(contractId, variantId) {
    const contract = state.marketTenders.find(t => t.id === contractId);
    const variant = state.variants.find(v => v.id === variantId);
    if (!contract || !variant) return { success: false, reason: "Invalid contract or rolling stock model." };

    const check = this.validateVariantRequirements(variant, contract);
    if (!check.valid) return { success: false, reason: check.errors[0] };

    if (variant.salePrice > contract.budgetPerUnit) {
      return { success: false, reason: `Proposal Budget Exceeded: Commercial price ($${variant.salePrice.toLocaleString()}) exceeds maximum contract budget ($${contract.budgetPerUnit.toLocaleString()}). Adjust markup margin.` };
    }

    const priceAdvantage = ((contract.budgetPerUnit - variant.salePrice) / contract.budgetPerUnit) * 30;
    const reputationScore = (state.reputation / 100) * 35;
    const strictnessBonus = contract.premiumMarkupFactor * 15;
    const totalProposalScore = 50 + priceAdvantage + reputationScore + strictnessBonus;

    if (totalProposalScore >= (65 + Math.random() * 22)) {
      const mobDays = contract.mobilizationDays || 45;
      const activeContract = {
        id: "cnt_" + Date.now().toString(36),
        contractId: contract.id,
        title: contract.title,
        agency: contract.agency,
        variantId: variant.id,
        variantName: variant.name,
        strictnessTier: contract.strictnessTier,
        budgetPerUnit: contract.budgetPerUnit,
        unitSalePrice: variant.salePrice,
        unitProfit: variant.profitPerUnit,
        totalUnits: contract.unitsRequired,
        batchSizePerQuarter: contract.batchSizePerQuarter,
        delayToleranceDays: contract.delayToleranceDays,
        delayDaysAccrued: 0,
        quarterStartDay: state.day,
        deliveredThisQuarter: 0,
        totalDelivered: 0,
        totalRevenueEarned: 0,
        mobilizationDaysTotal: mobDays,
        mobilizationDaysLeft: mobDays,
        isMobilizing: true
      };

      state.activeContracts.push(activeContract);
      state.reputation = Math.min(100, state.reputation + 6);
      state.marketTenders = state.marketTenders.filter(t => t.id !== contractId);
      state.saveToStorage();

      return { success: true, contract: activeContract };
    } else {
      state.reputation = Math.max(10, state.reputation - 2);
      return { success: false, reason: "Proposal Rejected: Competitor evaluation scored higher. Improve physical metrics or reduce commercial margin." };
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

    return { revenueEst: quarterlyRevenueEst, grossProfitEst: quarterlyProfitEst, netProfitEst: quarterlyProfitEst };
  }
}