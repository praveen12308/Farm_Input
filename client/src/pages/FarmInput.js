import React, { useState } from "react";
import "../style/FarmInput.css";
import SelectField from "../component/SelectField";

export default function FarmerInputDashboard() {
  const initialState = {
    farmerId: "", farmerName: "", contactNumber: "", surveyNumber: "", landArea: "",
    soilType: "", irrigationSource: "", cropSeason: "", cropType: "", seedQuantity: "", sowingDate: "",
    harvestDate: "", produceQuantity: "", fertilizerUsed: "",
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberFields = ["contactNumber"];
    if (numberFields.includes(name) && !/^\d*\.?\d*$/.test(value)) {
      setErrors((prev) => ({ ...prev, [name]: "Only numbers are allowed" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateContactNumber = () => {
    const { contactNumber } = formData;
    if (!/^\d{10}$/.test(contactNumber)) {
      return "Enter a valid 10-digit number";
    }
    return "";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Data saved successfully ✅");
        setFormData(initialState);
        setCurrentStep(1);
      } else {
        alert(`Failed to save data ❌: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while saving data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const validateStep = () => {
    let newErrors = {};
    if (currentStep === 1) {
      if (!formData.farmerId.trim()) newErrors.farmerId = "Farmer ID is required";
      if (!formData.farmerName.trim()) newErrors.farmerName = "Farmer Name is required";
      const contactError = validateContactNumber();
      if (contactError) newErrors.contactNumber = contactError;
    }
    if (currentStep === 2) {
      if (!formData.surveyNumber.trim()) newErrors.surveyNumber = "Survey Number is required";
      if (!formData.landArea.trim()) newErrors.landArea = "Land Area is required";
      if (!formData.soilType) newErrors.soilType = "Select Soil Type";
      if (!formData.irrigationSource) newErrors.irrigationSource = "Select Irrigation Source";
      if (!formData.cropSeason) newErrors.cropSeason = "Select Crop Season";
    }
    if (currentStep === 3) {
      if (!formData.seedQuantity.trim()) newErrors.seedQuantity = "Seed Quantity is required";
      if (!formData.produceQuantity.trim()) newErrors.produceQuantity = "Produce Quantity is required";
      if (!formData.cropType) newErrors.cropType = "Select Crop Type";
      if (!formData.fertilizerUsed) newErrors.fertilizerUsed = "Select Fertilizer Used";

      const today = new Date().toISOString().split("T")[0];

      if (!formData.sowingDate) {
        newErrors.sowingDate = "Sowing Date is required";
      } else if (formData.sowingDate > today) {
        newErrors.sowingDate = "Sowing Date cannot be in the future";
      }

      if (!formData.harvestDate) {
        newErrors.harvestDate = "Harvest Date is required";
      } else if (formData.harvestDate > today) {
        newErrors.harvestDate = "Harvest Date cannot be in the future";
      }

      if (formData.sowingDate && formData.harvestDate) {
        const sowing = new Date(formData.sowingDate);
        const harvest = new Date(formData.harvestDate);

        if (harvest <= sowing) {
          newErrors.sowingDate = "Sowing Date must be before Harvest Date";
          newErrors.harvestDate = "Harvesting Date must be after Sowing Date";
        } else {
          const dayDiff = (harvest - sowing) / (1000 * 60 * 60 * 24);
          if (dayDiff < 20) {
            newErrors.harvestDate = "Minimum 20 days after sowing date";
          }
        }
      }

    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="container">
      {currentStep === 1 && (
        <div className="card step-1">
          <h1>Farmer Input Dashboard</h1>
          <div className="field">
            <label>Farmer ID</label>
            <div className="error-container">
              {errors.farmerId && <span className="error-message">{errors.farmerId}</span>}
              <input type="text" name="farmerId" value={formData.farmerId} onChange={handleChange}
                className={errors.farmerId ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <label>Farmer Name</label>
            <div className="error-container">
              {errors.farmerName && <span className="error-message">{errors.farmerName}</span>}
              <input name="farmerName" value={formData.farmerName} onChange={handleChange}
                className={errors.farmerName ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <label>Contact Number</label>
            <div className="error-container">
              {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
              <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} maxLength={10}
                className={errors.contactNumber ? "error" : ""} />
            </div>
          </div>
          <button className="button" onClick={handleNext}>Next</button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="card step-2">
          <h1>Field Input</h1>
          <div className="field">
            <label>Survey Number</label>
            <div className="error-container">
              {errors.surveyNumber && <span className="error-message">{errors.surveyNumber}</span>}
              <input name="surveyNumber" value={formData.surveyNumber} onChange={handleChange}
                className={errors.surveyNumber ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <label>Land Area</label>
            <div className="error-container">
              {errors.landArea && <span className="error-message">{errors.landArea}</span>}
              <input name="landArea" value={formData.landArea} onChange={handleChange}
                className={errors.landArea ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <div className="error-container">
              {errors.soilType && <span className="error-message">{errors.soilType}</span>}
              <SelectField
                label="Soil Type" name="soilType"
                options={["Sand", "Clay", "Silt", "Peat", "Chalk", "Loam"]}
                value={formData.soilType} onChange={handleChange}
                className={errors.soilType ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <div className="error-container">
              {errors.irrigationSource && <span className="error-message">{errors.irrigationSource}</span>}
              <SelectField
                label="Irrigation Source" name="irrigationSource"
                options={[
                  "Surface Water", "Groundwater", "Rainwater Harvesting", "Drip Irrigation",
                  "Sprinkler Irrigation", "Flood Irrigation", "Subsurface Irrigation",
                  "River Water", "Lake Water", "Canal Water", "Wells", "Reservoirs",
                  "Reclaimed Water", "Municipal Water Supply", "Stormwater Runoff"
                ]}
                value={formData.irrigationSource} onChange={handleChange}
                className={errors.irrigationSource ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <div className="error-container">
              {errors.cropSeason && <span className="error-message">{errors.cropSeason}</span>}
              <SelectField label="Crop Season" name="cropSeason"
                options={["Spring Crop Season", "Summer Crop Season", "Autumn (Fall) Crop Season", "Winter Crop Season"]}
                value={formData.cropSeason} onChange={handleChange}
                className={errors.cropSeason ? "error" : ""} />
            </div>
          </div>
          <div className="button-container">
            <button className="button" onClick={handleBack} >Back</button>
            <button className="button" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="card step-3">
          <h1>Crop Details</h1>
          <div className="field">
            <label>Seed Quantity</label>
            <div className="error-container">
              {errors.seedQuantity && <span className="error-message">{errors.seedQuantity}</span>}
              <input name="seedQuantity" value={formData.seedQuantity} onChange={handleChange}
                className={errors.seedQuantity ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <label>Produce Quantity</label>
            <div className="error-container">
              {errors.produceQuantity && <span className="error-message">{errors.produceQuantity}</span>}
              <input name="produceQuantity" value={formData.produceQuantity} onChange={handleChange}
                className={errors.produceQuantity ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <div className="error-container">
              {errors.cropType && <span className="error-message">{errors.cropType}</span>}
              <SelectField label="Crop Type" name="cropType"
                options={["Food Crops", "Feed Crops", "Fiber Crops", "Oilseed Crops", "Ornamental Crops", "Industrial Crops"]}
                value={formData.cropType} onChange={handleChange}
                className={errors.cropType ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <div className="error-container">
              {errors.fertilizerUsed && <span className="error-message">{errors.fertilizerUsed}</span>}
              <SelectField label="Fertilizer Used" name="fertilizerUsed"
                options={[
                  "Compost", "Animal Manure", "Green Manure", "Plant-Based Fertilizers",
                  "Bone Meal", "Fish Fertilizers", "Mineral Fertilizers",
                  "Organic Liquid Fertilizers", "Ash and Residues"
                ]}
                value={formData.fertilizerUsed} onChange={handleChange}
                className={errors.fertilizerUsed ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <label>Sowing Date</label>
            <div className="error-container">
              {errors.sowingDate && <span className="error-message">{errors.sowingDate}</span>}
              <input type="date" name="sowingDate" value={formData.sowingDate} onChange={handleChange}
                className={errors.sowingDate ? "error" : ""} />
            </div>
          </div>
          <div className="field">
            <label>Harvest Date</label>
            <div className="error-container">
              {errors.harvestDate && <span className="error-message">{errors.harvestDate}</span>}
              <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange}
                className={errors.harvestDate ? "error" : ""} />
            </div>
          </div>
          <div className="button-container">
            <button className="button" onClick={handleBack} >Back</button>
            <button className="button submit" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
