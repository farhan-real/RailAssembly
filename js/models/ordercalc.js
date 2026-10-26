// Government Contracts, Targeted Requirements Validator, and Contract Swapping
class OrderEngine {
  static evaluateGovernmentBids() {
    state.marketTenders.forEach(t => {
      if (state.day >= t.expiresDay) {
        t.expired = true;
        Events.emit("toast", {
          text: `Tender Notice Concluded: Ministry procurement window for "${t.title}" is now closed.`,
          type: "normal"
        });
      }
    });
    state.marketTenders = state.marketTenders.filter(t => !t.expired);

    if (state.marketTenders.length === 0) {
      state.nextTenderCountdown -= 1;
      if (state.nextTenderCountdown <= 0) {
        const waveCount = 2 + Math.floor(Math.random() * 2);
        const shuffled = [...TENDER_TEMPLATES].sort(() => 0.5 - Math.random());

        for (let i = 0; i < waveCount && i < shuffled.length; i++) {
          const template = shuffled[i];
          state.marketTenders.push({
            id: "tnd_" + Math.random().toString(36).substring(2, 8),
            ...template,
            issuedDay: state.day,
            expiresDay: state.day + 75 + Math.floor(Math.random() * 25),
            awarded: false
          });
        }
        state.nextTenderCountdown = 60 + Math.floor(Math.random() * 30);
        Events.emit("toast", {
          text: `National Procurement Gazette: Ministry published ${state.marketTenders.length} new rolling stock tenders.`,
          type: "success"
        });
        Events.emit("marketChanged");
      }
    } else if (state.marketTenders.length < 3) {
      state.nextTenderCountdown -= 1;
      if (state.nextTenderCountdown <= 0) {
        const unused = TENDER_TEMPLATES.filter(tpl => !state.marketTenders.some(t => t.type === tpl.type));
        if (unused.length > 0) {
          const template = unused[Math.floor(Math.random() * unused.length)];
          state.marketTenders.push({
            id: "tnd_" + Math.random().toString(36).substring(2, 8),
            ...template,
            issuedDay: state.day,
            expiresDay: state.day + 80,
            awarded: false
          });
          Events.emit("toast", {
            text: `Supplementary Tender Gazetted: "${template.title}" published by ${template.agency}.`,
            type: "success"
          });
          Events.emit("marketChanged");
        }
        state.nextTenderCountdown = 45 + Math.floor(Math.random() * 30);
      }
    }

    state.activeContracts.forEach(contract => {
      const daysIntoCurrentQuarter = (state.day - contract.quarterStartDay);
      const daysPerBatch = 90;

      if (daysIntoCurrentQuarter > daysPerBatch && contract.deliveredThisQuarter < contract.batchSizePerQuarter) {
        contract.delayDaysAccrued += 1;
        if (contract.delayDaysAccrued > contract.delayToleranceDays) {
          const forfeitedUnits = contract.totalUnits - contract.totalDelivered;
          state.reputation = Math.max(10, state.reputation - 20);
          Events.emit("toast", {
            text: `Contract Terminated: "${contract.title}" defaulted due to excessive delays. Remaining ${forfeitedUnits} units transferred to competitors.`,
            type: "danger"
          });
          contract.terminated = true;
        }
      }
    });

    state.activeContracts = state.activeContracts.filter(c => !c.terminated && c.totalDelivered < c.totalUnits);
  }

  static validateVariantRequirements(variant, tender) {
    if (!variant || !tender) return { valid: false, errors: ["Invalid configuration."] };
    if (!variant.certified) {
      return { valid: false, errors: ["The Ministry requires verified test track dynamic certification before proposal submission."] };
    }

    const errors = [];
    const complianceDetails = [];

    tender.requirements.forEach(req => {
      let candidateValue = 0;
      switch (req.key) {
        case "speed": candidateValue = variant.testedStats.exactTopSpeed; break;
        case "acceleration": candidateValue = variant.testedStats.certifiedAcceleration || variant.stats.acceleration; break;
        case "horsepower": candidateValue = variant.testedStats.certifiedHorsepower || variant.stats.horsepower; break;
        case "tractiveEffort": candidateValue = variant.testedStats.exactAdhesionKn || variant.stats.maxAdhesionKn; break;
        case "unitCost": candidateValue = variant.unitProductionCost; break;
        case "maxAxleLoad": candidateValue = variant.testedStats.certifiedAxleLoad || variant.stats.axleLoad; break;
        case "passengerCap": candidateValue = variant.stats.passengerCap; break;
      }

      if (req.compare === "min" && candidateValue < req.value) {
        errors.push(`Requirement Deficit: ${req.label} (${candidateValue} ${req.unit}) is below mandatory minimum of ${req.value} ${req.unit}.`);
      } else if (req.compare === "max" && candidateValue > req.value) {
        errors.push(`Ceiling Exceeded: ${req.label} (${candidateValue} ${req.unit}) exceeds allowable ceiling of ${req.value} ${req.unit}.`);
      } else {
        complianceDetails.push({ label: req.label, candidate: candidateValue, target: req.value, unit: req.unit, met: true });
      }
    });

    return { valid: errors.length === 0, errors, complianceDetails };
  }

  static evaluateVariantSwap(contract, newVariant) {
    const originalTemplate = TENDER_TEMPLATES.find(t => t.title === contract.title) || { requirements: [] };
    const check = this.validateVariantRequirements(newVariant, originalTemplate);
    if (!check.valid) return { eligible: false, reason: check.errors[0] };

    // Government willingness to pay premium for superior performance
    const budgetCeiling = contract.budgetPerUnit || (contract.unitSalePrice * 1.35);
    const costOffset = newVariant.salePrice - contract.unitSalePrice;

    // Willing to pay up to 10% premium over new variant's commercial markup if specs exceed targets
    let proposedPrice = Math.max(contract.unitSalePrice, newVariant.salePrice);
    if (newVariant.stats.theoreticalSpeed > (originalTemplate.requirements.find(r => r.key === "speed")?.value || 0)) {
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

  static submitTenderProposal(tenderId, variantId) {
    const tender = state.marketTenders.find(t => t.id === tenderId);
    const variant = state.variants.find(v => v.id === variantId);
    if (!tender || !variant) return { success: false, reason: "Invalid tender or rolling stock blueprint." };

    const check = this.validateVariantRequirements(variant, tender);
    if (!check.valid) return { success: false, reason: check.errors[0] };

    if (variant.salePrice > tender.budgetPerUnit) {
      return { success: false, reason: `Bid Price Exceeded: Model commercial price ($${variant.salePrice.toLocaleString()}) exceeds the tender budget ($${tender.budgetPerUnit.toLocaleString()}). Adjust markup margin.` };
    }

    const priceAdvantage = ((tender.budgetPerUnit - variant.salePrice) / tender.budgetPerUnit) * 30;
    const reputationScore = (state.reputation / 100) * 35;
    const strictnessBonus = tender.premiumMarkupFactor * 15;
    const totalProposalScore = 50 + priceAdvantage + reputationScore + strictnessBonus;

    if (totalProposalScore >= (65 + Math.random() * 22)) {
      const contract = {
        id: "cnt_" + Date.now().toString(36),
        tenderId: tender.id,
        title: tender.title,
        agency: tender.agency,
        variantId: variant.id,
        variantName: variant.name,
        strictnessTier: tender.strictnessTier,
        budgetPerUnit: tender.budgetPerUnit,
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
      state.reputation = Math.min(100, state.reputation + 6);
      state.marketTenders = state.marketTenders.filter(t => t.id !== tenderId);
      state.saveToStorage();

      return { success: true, contract };
    } else {
      state.reputation = Math.max(10, state.reputation - 2);
      return { success: false, reason: "Bid Rejected: Competitor evaluation scored higher. Increase performance margins or reduce commercial markup." };
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

    const netProfitEst = quarterlyProfitEst - (state.dailyResearchBudget * 90);
    return { revenueEst: quarterlyRevenueEst, grossProfitEst: quarterlyProfitEst, netProfitEst };
  }
}