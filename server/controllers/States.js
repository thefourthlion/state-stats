const States = require("../models/States");
exports.createStates = async (req, res) => {
  try {
    let newStates = new States({
      MedianHomePrice: req.body.MedianHomePrice,
      CapitalGainsTax: req.body.CapitalGainsTax,
      IncomeTax: req.body.IncomeTax,
      SalesTax: req.body.SalesTax,
      PropertyTaxes: req.body.PropertyTaxes,
      Abortion: req.body.Abortion,
      CostOfLiving: req.body.CostOfLiving,
      K12SchoolPerformance: req.body.K12SchoolPerformance,
      HigherEdSchoolPerformance: req.body.HigherEdSchoolPerformance,
      ForestedLand: req.body.ForestedLand,
      GunLaws: req.body.GunLaws,
      MinimumWage: req.body.MinimumWage,
      Population: req.body.Population,
      ViolentCrimes: req.body.ViolentCrimes,
      PoliticalLeaning: req.body.PoliticalLeaning,
      Name: req.body.Name,
    });
    await newStates.save();
    res.send(newStates);
  } catch (err) {
    console.log(err);
  }
};
exports.readStates = async (req, res) => {
  const page = req.query.page || 0;
  const limit = req.query.limit || 55;
  try {
    const result = await States.find({})
      .sort()
      .skip(page * limit)
      .limit(limit);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.json({ app: err });
  }
};
exports.readStatesFromID = async (req, res) => {
  try {
    const result = await States.findById(req.params.id);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.json({ app: err });
  }
};
exports.updateStates = async (req, res) => {
  try {
    const result = await States.findByIdAndUpdate(
      req.params.id,
      {
        MedianHomePrice: req.body.MedianHomePrice,
        CapitalGainsTax: req.body.CapitalGainsTax,
        IncomeTax: req.body.IncomeTax,
        SalesTax: req.body.SalesTax,
        PropertyTaxes: req.body.PropertyTaxes,
        Abortion: req.body.Abortion,
        CostOfLiving: req.body.CostOfLiving,
        K12SchoolPerformance: req.body.K12SchoolPerformance,
        HigherEdSchoolPerformance: req.body.HigherEdSchoolPerformance,
        ForestedLand: req.body.ForestedLand,
        GunLaws: req.body.GunLaws,
        MinimumWage: req.body.MinimumWage,
        Population: req.body.Population,
        ViolentCrimes: req.body.ViolentCrimes,
        PoliticalLeaning: req.body.PoliticalLeaning,
        Name: req.body.Name,
      },
      { new: true }
    );
    res.send(result);
  } catch (err) {
    console.log(err);
    res.json({ app: err });
  }
};
exports.deleteStates = async (req, res) => {
  try {
    const result = await States.findByIdAndRemove(req.params.id);
    if (!result) {
      res.json({ app: "post not found" });
    } else {
      res.json({ app: "post deleted" });
    }
  } catch (err) {
    console.log(err);
    res.json({ app: err });
  }
};
