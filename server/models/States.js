const mongoose = require("mongoose");
const StatesSchema = new mongoose.Schema(
  {
    MedianHomePrice: {
      type: String,
      required: [true, "Please provide MedianHomePrice"],
    },
    CapitalGainsTax: {
      type: String,
      required: [true, "Please provide CapitalGainsTax"],
    },
    IncomeTax: { type: String, required: [true, "Please provide IncomeTax"] },
    SalesTax: { type: String, required: [true, "Please provide SalesTax"] },
    PropertyTaxes: {
      type: String,
      required: [true, "Please provide PropertyTaxes"],
    },
    Abortion: { type: String, required: [true, "Please provide Abortion"] },
    CostOfLiving: {
      type: String,
      required: [true, "Please provide CostOfLiving"],
    },
    K12SchoolPerformance: {
      type: String,
      required: [true, "Please provide K12SchoolPerformance"],
    },
    HigherEdSchoolPerformance: {
      type: String,
      required: [true, "Please provide HigherEdSchoolPerformance"],
    },
    ForestedLand: {
      type: String,
      required: [true, "Please provide ForestedLand"],
    },
    GunLaws: { type: String, required: [true, "Please provide GunLaws"] },
    MinimumWage: {
      type: String,
      required: [true, "Please provide MinimumWage"],
    },
    Population: { type: String, required: [true, "Please provide Population"] },
    ViolentCrimes: {
      type: String,
      required: [true, "Please provide ViolentCrimes"],
    },
    PoliticalLeaning: {
      type: String,
      required: [true, "Please provide PoliticalLeaning"],
    },
    Name: { unique: true, type: String, required: [true, "Please provide Name"] },
  },
  { timestamps: true }
);
const States = mongoose.model("States", StatesSchema);
module.exports = States;
