const createSummonEntry = async (req, res) => {
    try {
      const {
        entryType,
        firOrGdNumber,
        policeStation,
        vehicleOwner,
        fatherName,
        address,
        vehicleRegistrationNumber,
        place,
        lastDays,
        releaseDays,
        actType,
        date,
        time,
      } = req.body;
  
      const newEntry = new SummonEntry({
        entryType,
        firOrGdNumber,
        policeStation,
        vehicleOwner,
        fatherName,
        address,
        vehicleRegistrationNumber,
        place,
        lastDays,
        releaseDays,
        actType,
        date,
        time,
      });
      await newEntry.save();
      return res
        .status(201)
        .json({ message: "Summon Entry created successfully", data: newEntry });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server Error", error: error.message });
    }
  };
  