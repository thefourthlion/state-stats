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
  const page = parseInt(req.query.page || 0);
  const limit = parseInt(req.query.limit || 55);
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "Name";
  const sortOrder = req.query.sortOrder || "asc";
  
  try {
    // Build search query
    let query = {};
    
    if (search) {
      query.Name = { $regex: search, $options: "i" };
    }
    
    // Add filters for specific fields
    const filterFields = [
      "Abortion",
      "GunLaws",
      "PoliticalLeaning",
    ];
    
    filterFields.forEach((field) => {
      if (req.query[field]) {
        query[field] = req.query[field];
      }
    });
    
    // Add range filters for numerical fields
    const numericFields = [
      "MedianHomePrice",
      "CapitalGainsTax",
      "IncomeTax",
      "SalesTax",
      "PropertyTaxes",
      "CostOfLiving",
      "K12SchoolPerformance",
      "HigherEdSchoolPerformance",
      "ForestedLand",
      "MinimumWage",
      "Population",
      "ViolentCrimes",
    ];
    
    numericFields.forEach((field) => {
      const min = req.query[`${field}Min`];
      const max = req.query[`${field}Max`];
      
      if (min || max) {
        query[field] = {};
        if (min) query[field].$gte = parseFloat(min);
        if (max) query[field].$lte = parseFloat(max);
      }
    });
    
    let result;
    
    if (sortBy === "Affordability") {
      // Fetch all matching records without pagination first
      result = await States.find(query);
      
      // Calculate scores and sort in memory
      result = result.map(state => {
        const stateObj = state.toObject();
        
        const homePrice = parseFloat(stateObj.MedianHomePrice) || 0;
        const costOfLiving = parseFloat(stateObj.CostOfLiving) || 0;
        const incomeTax = parseFloat(stateObj.IncomeTax) || 0;
        const propertyTax = parseFloat(stateObj.PropertyTaxes) || 0;
        const salesTax = parseFloat(stateObj.SalesTax) || 0;
        
        // Composite Score (Higher = More Expensive)
        // Weightings optimized to balance factors
        // Adjusted to balance Income Tax vs Property Tax better
        const taxScore = (incomeTax + (propertyTax * 6) + salesTax);
        const homeScore = homePrice / 1000;
        
        stateObj.affordabilityScore = 
          (costOfLiving * 2) + 
          (homeScore * 0.5) + 
          (taxScore * 3);
          
        return stateObj;
      });
      
      // Sort
      result.sort((a, b) => {
        return sortOrder === "asc" 
          ? a.affordabilityScore - b.affordabilityScore // Least expensive first
          : b.affordabilityScore - a.affordabilityScore; // Most expensive first
      });
      
      // Apply pagination
      const startIndex = page * limit;
      result = result.slice(startIndex, startIndex + limit);
      
    } else {
      // Standard database sort and pagination
      const sortObject = {};
      sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;
      
      result = await States.find(query)
        .sort(sortObject)
        .skip(page * limit)
        .limit(limit);
    }
      
    const total = await States.countDocuments(query);
    
    res.json({
      data: result,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
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
