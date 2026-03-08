class VinService {
    async decode(vin) {
        try {
            const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
            const data = await response.json();
            const results = data.Results;
            
            const getValue = (id) => {
                const val = results.find(r => r.VariableId === id)?.Value;
                return (val && val !== 'null' && val.toLowerCase() !== 'not applicable') ? val : null;
            };
            
            // 1. CORE BASICS
            const makeRaw = getValue(26);
            const model = getValue(28);
            const yearStr = getValue(29);
            
            // Smart Year Cap (Current Year + 1 is the highest a car usually goes)
            let year = yearStr ? parseInt(yearStr, 10) : null;
            const currentYear = new Date().getFullYear();
            if (year && year > currentYear + 1) year = currentYear + 1;

            const make = makeRaw ? makeRaw.trim() : null;

            // NEW: Trim extraction (Variable 38 is Trim, 34 is Series)
            const trimRaw = getValue(38);
            const seriesRaw = getValue(34);
            const trim = trimRaw || seriesRaw || null;

            // 2. THE SMART ENGINE BUILDER
            let displacementL = getValue(73); 
            
            if (!displacementL) {
                let displacementCC = getValue(75);
                if (displacementCC) {
                    displacementL = (parseFloat(displacementCC) / 1000).toFixed(1);
                } else {
                    let displacementCI = getValue(74);
                    if (displacementCI) {
                        displacementL = (parseFloat(displacementCI) * 0.0163871).toFixed(1);
                    }
                }
            } else {
                // Clean up NHTSA's messy decimals (e.g., 5.70000 -> 5.7)
                displacementL = parseFloat(displacementL).toFixed(1);
            }

            let cylinders = getValue(71);      
            if (cylinders && parseInt(cylinders, 10) > 16) {
                cylinders = null; 
            }

            const config = getValue(87);       
            const turbo = getValue(135);
            const hasTurbo = turbo && turbo.toLowerCase().includes('yes') ? 'Turbo' : '';

            let engineSize = '';
            if (displacementL && displacementL !== 'NaN') engineSize += `${displacementL}L `;
            if (config === 'V' && cylinders) engineSize += `V${cylinders} `;
            else if (cylinders) engineSize += `${cylinders}-Cyl `;
            if (hasTurbo) engineSize += `${hasTurbo} `;

            engineSize = engineSize.trim() || null;

            // 3. THE DRIVETRAIN TRANSLATOR
            let rawDrive = getValue(15);
            let drivetrain = null;
            if (rawDrive) {
                const d = rawDrive.toLowerCase();
                if (d.includes('awd') || d.includes('all wheel')) drivetrain = 'AWD';
                else if (d.includes('4x4') || d.includes('four wheel')) drivetrain = '4WD';
                else if (d.includes('fwd') || d.includes('front')) drivetrain = 'FWD';
                else if (d.includes('rwd') || d.includes('rear')) drivetrain = 'RWD';
                else if (d.includes('4x2')) drivetrain = '2WD'; 
                else drivetrain = rawDrive;
            }

            // 4. THE TRANSMISSION TRANSLATOR
            let rawTrans = getValue(37);
            let transmission = null;
            if (rawTrans) {
                const t = rawTrans.toLowerCase();
                if (t.includes('cvt') || t.includes('continuously')) transmission = 'CVT';
                else if (t.includes('auto')) transmission = 'Automatic';
                else if (t.includes('manual')) transmission = 'Manual';
                else transmission = rawTrans; 
            }

            // 5. THE BODY STYLE TRANSLATOR
            let rawBody = getValue(5);
            let bodyStyle = null;
            if (rawBody) {
                const b = rawBody.toLowerCase();
                if (b.includes('suv') || b.includes('sport utility')) bodyStyle = 'SUV';
                else if (b.includes('sedan') || b.includes('saloon')) bodyStyle = 'Sedan';
                else if (b.includes('pickup')) bodyStyle = 'Pickup';
                else if (b.includes('hatchback')) bodyStyle = 'Hatchback';
                else if (b.includes('coupe')) bodyStyle = 'Coupe';
                else if (b.includes('van') || b.includes('minivan')) bodyStyle = 'Van';
                else if (b.includes('wagon')) bodyStyle = 'Wagon';
                else bodyStyle = rawBody;
            }

            // 6. THE FUEL TYPE TRANSLATOR
            let rawFuel = getValue(24);
            let fuelType = null;
            if (rawFuel) {
                const f = rawFuel.toLowerCase();
                if (f.includes('gasoline')) fuelType = 'Gasoline';
                else if (f.includes('diesel')) fuelType = 'Diesel';
                else if (f.includes('electric') && f.includes('hybrid')) fuelType = 'Hybrid';
                else if (f.includes('electric')) fuelType = 'Electric';
                else fuelType = rawFuel;
            }

            // 7. THE WEIGHT CLASS CLEANUP
            let rawWeight = getValue(11); 
            let weightClass = null;
            if (rawWeight) {
                if (rawWeight.toLowerCase().includes('class')) {
                    weightClass = rawWeight.split(':')[0].trim(); 
                } else if (!isNaN(parseFloat(rawWeight))) {
                    weightClass = Math.round(parseFloat(rawWeight)) + ' LBS';
                } else {
                    weightClass = rawWeight;
                }
            }

            // Added `trim` to the return object
            return { 
                make, model, trim, year, engineSize, transmission, drivetrain, fuelType, bodyStyle, weightClass
            };
            
        } catch (error) {
            console.error('NHTSA API Decoding Error:', error);
            return null;
        }
    }
}

module.exports = new VinService();