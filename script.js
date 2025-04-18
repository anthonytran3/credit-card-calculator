document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const calculatorButtons = document.querySelectorAll('.calc-button');
    const calculateBtn = document.getElementById('calculateBtn');
    const transactionToggle = document.getElementById('transactionToggle');
    const transactionToggleContainer = document.getElementById('transactionToggleContainer');
    
    // Input sections
    const effectiveRateInputs = document.getElementById('effectiveRateInputs');
    const totalFeeInputs = document.getElementById('totalFeeInputs');
    
    // Result sections
    const effectiveRateResults = document.getElementById('effectiveRateResults');
    const totalFeeResults = document.getElementById('totalFeeResults');
    
    // Transaction-related elements
    const transactionInputs = document.querySelectorAll('.transaction-input');
    const transactionResults = document.querySelectorAll('.transaction-result');
    
    // Effective Rate Calculator inputs
    const monthlySales = document.getElementById('monthlySales');
    const monthlyTransactions = document.getElementById('monthlyTransactions');
    const processingFeeAmount = document.getElementById('processingFeeAmount');
    
    // Total Fee Calculator inputs
    const totalSales = document.getElementById('totalSales');
    const totalTransactions = document.getElementById('totalTransactions');
    const feePercentage = document.getElementById('feePercentage');
    const perTransactionFee = document.getElementById('perTransactionFee');
    
    // Result elements
    const effectiveRateValue = document.getElementById('effectiveRateValue');
    const effectiveProcessingFee = document.getElementById('effectiveProcessingFee');
    const effectivePerTransaction = document.getElementById('effectivePerTransaction');
    const effectiveNetAmount = document.getElementById('effectiveNetAmount');
    const effectiveCurrentFee = document.getElementById('effectiveCurrentFee');
    const effectiveNewFee = document.getElementById('effectiveNewFee');
    const effectiveEstimatedSavings = document.getElementById('effectiveEstimatedSavings');
    const percentageFee = document.getElementById('percentageFee');
    const transactionFee = document.getElementById('transactionFee');
    const totalProcessingFee = document.getElementById('totalProcessingFee');
    const netAmount = document.getElementById('netAmount');
    const totalCurrentFee = document.getElementById('totalCurrentFee');
    const totalNewFee = document.getElementById('totalNewFee');
    const totalEstimatedSavings = document.getElementById('totalEstimatedSavings');

    // Save Fee buttons
    const saveCurrentFeeBtn = document.getElementById('saveCurrentFeeBtn');
    const saveNewFeeBtn = document.getElementById('saveNewFeeBtn');
    
    // Default calculator type and state
    let currentCalculator = 'effective';
    let includeTransactions = false;

    // Set initial button text for Effective Rate calculator
    saveCurrentFeeBtn.textContent = 'Save as Current Rate';
    saveNewFeeBtn.textContent = 'Save as New Rate';
    
    // Hide transaction toggle initially since we start with Effective Rate calculator
    transactionToggleContainer.classList.add('hidden');

    // Transaction toggle handler
    transactionToggle.addEventListener('change', function() {
        includeTransactions = this.checked;
        toggleTransactionElements();
    });

    function toggleTransactionElements() {
        transactionInputs.forEach(input => {
            input.classList.toggle('hidden', !includeTransactions);
        });

        transactionResults.forEach(result => {
            result.classList.toggle('hidden', !includeTransactions);
        });
    }

    // Add click event listeners to calculator type buttons
    calculatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculatorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCalculator = button.dataset.type;
            switchCalculator();
        });
    });

    function switchCalculator() {
        if (currentCalculator === 'effective') {
            effectiveRateInputs.classList.remove('hidden');
            totalFeeInputs.classList.add('hidden');
            effectiveRateResults.classList.remove('hidden');
            totalFeeResults.classList.add('hidden');
            transactionToggleContainer.classList.add('hidden');
            saveCurrentFeeBtn.textContent = 'Save as Current Rate';
            saveNewFeeBtn.textContent = 'Save as New Rate';
        } else {
            effectiveRateInputs.classList.add('hidden');
            totalFeeInputs.classList.remove('hidden');
            effectiveRateResults.classList.add('hidden');
            totalFeeResults.classList.remove('hidden');
            transactionToggleContainer.classList.remove('hidden');
            saveCurrentFeeBtn.textContent = 'Save as Current Fee';
            saveNewFeeBtn.textContent = 'Save as New Fee';
        }
        clearInputs();
        clearResults();
    }

    function clearInputs() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => input.value = '');
        
        // Reset transaction toggle state
        transactionToggle.checked = false;
        includeTransactions = false;
        toggleTransactionElements();
        
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    function clearResults() {
        effectiveRateValue.textContent = '0.00%';
        effectiveProcessingFee.textContent = formatCurrency(0);
        effectivePerTransaction.textContent = formatCurrency(0);
        effectiveNetAmount.textContent = formatCurrency(0);
        effectiveCurrentFee.textContent = '0.00%';
        effectiveNewFee.textContent = '0.00%';
        effectiveEstimatedSavings.textContent = formatCurrency(0);
        percentageFee.textContent = formatCurrency(0);
        transactionFee.textContent = formatCurrency(0);
        totalProcessingFee.textContent = formatCurrency(0);
        netAmount.textContent = formatCurrency(0);
        totalCurrentFee.textContent = formatCurrency(0);
        totalNewFee.textContent = formatCurrency(0);
        totalEstimatedSavings.textContent = formatCurrency(0);
        
        // Reset button states
        saveCurrentFeeBtn.classList.remove('active');
        saveNewFeeBtn.classList.remove('active');
    }

    function validateEffectiveRateInputs() {
        let isValid = true;
        const sales = parseFloat(monthlySales.value);
        const fee = parseFloat(processingFeeAmount.value);

        if (!sales || sales <= 0) {
            addErrorMessage(monthlySales, 'Please enter a valid sales amount');
            isValid = false;
        }

        if (!fee || fee <= 0) {
            addErrorMessage(processingFeeAmount, 'Please enter a valid processing fee');
            isValid = false;
        }

        if (fee >= sales) {
            addErrorMessage(processingFeeAmount, 'Processing fee cannot be greater than or equal to sales amount');
            isValid = false;
        }

        if (includeTransactions) {
            const transactions = parseInt(monthlyTransactions.value);
            if (!transactions || transactions <= 0) {
                addErrorMessage(monthlyTransactions, 'Please enter a valid number of transactions');
                isValid = false;
            }
        }

        return isValid;
    }

    function validateTotalFeeInputs() {
        let isValid = true;
        const sales = parseFloat(totalSales.value);
        const rate = parseFloat(feePercentage.value);

        if (!sales || sales <= 0) {
            addErrorMessage(totalSales, 'Please enter a valid sales amount');
            isValid = false;
        }

        if (!rate || rate <= 0) {
            addErrorMessage(feePercentage, 'Please enter a valid percentage');
            isValid = false;
        }

        if (rate >= 100) {
            addErrorMessage(feePercentage, 'Percentage cannot be 100% or greater');
            isValid = false;
        }

        if (includeTransactions) {
            const transactions = parseInt(totalTransactions.value);
            const transactionFeeValue = parseFloat(perTransactionFee.value);
            
            if (!transactions || transactions <= 0) {
                addErrorMessage(totalTransactions, 'Please enter a valid number of transactions');
                isValid = false;
            }

            if (!transactionFeeValue && transactionFeeValue !== 0) {
                addErrorMessage(perTransactionFee, 'Please enter a valid transaction fee');
                isValid = false;
            }
        }

        return isValid;
    }

    function addErrorMessage(element, message) {
        element.classList.add('error');
        const existingError = element.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
    }

    function calculateEffectiveRate() {
        if (!validateEffectiveRateInputs()) {
            return;
        }

        const sales = parseFloat(monthlySales.value);
        const fee = parseFloat(processingFeeAmount.value);
        
        // Calculate effective rate
        const rate = (fee / sales) * 100;
        
        // Calculate net amount
        const net = sales - fee;
        
        // Display results
        effectiveRateValue.textContent = formatPercentage(rate);
        effectiveProcessingFee.textContent = formatCurrency(fee);
        effectiveNetAmount.textContent = formatCurrency(net);

        if (includeTransactions) {
            const transactions = parseInt(monthlyTransactions.value);
            const perTransaction = fee / transactions;
            effectivePerTransaction.textContent = formatCurrency(perTransaction);
        }
    }

    function calculateTotalFee() {
        if (!validateTotalFeeInputs()) {
            return;
        }

        const sales = parseFloat(totalSales.value);
        const rate = parseFloat(feePercentage.value);
        
        // Calculate percentage-based fee
        const percentageBasedFee = sales * (rate / 100);
        let totalFee = percentageBasedFee;
        
        // Calculate transaction-based fee if enabled
        let totalTransactionFee = 0;
        if (includeTransactions) {
            const transactions = parseInt(totalTransactions.value);
            const transactionFeeAmount = parseFloat(perTransactionFee.value);
            totalTransactionFee = transactions * transactionFeeAmount;
            totalFee += totalTransactionFee;
        }
        
        const net = sales - totalFee;
        
        // Display results
        percentageFee.textContent = formatCurrency(percentageBasedFee);
        if (includeTransactions) {
            transactionFee.textContent = formatCurrency(totalTransactionFee);
        }
        totalProcessingFee.textContent = formatCurrency(totalFee);
        netAmount.textContent = formatCurrency(net);
    }

    // Calculate button click handler
    calculateBtn.addEventListener('click', function() {
        if (currentCalculator === 'effective') {
            calculateEffectiveRate();
        } else {
            calculateTotalFee();
        }
    });

    // Helper function to format currency
    function formatCurrency(number) {
        return '$' + number.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Helper function to format percentage
    function formatPercentage(number) {
        return number.toFixed(2) + '%';
    }

    // Save Fee button handlers
    saveCurrentFeeBtn.addEventListener('click', function() {
        if (currentCalculator === 'effective') {
            const rate = parseFloat(effectiveRateValue.textContent);
            effectiveCurrentFee.textContent = formatPercentage(rate);
            updateEffectiveSavings();
        } else {
            const fee = parseFloat(totalProcessingFee.textContent.replace(/[^0-9.-]+/g, ''));
            totalCurrentFee.textContent = formatCurrency(fee);
            updateTotalSavings();
        }
        this.classList.add('active');
    });

    saveNewFeeBtn.addEventListener('click', function() {
        if (currentCalculator === 'effective') {
            const rate = parseFloat(effectiveRateValue.textContent);
            effectiveNewFee.textContent = formatPercentage(rate);
            updateEffectiveSavings();
        } else {
            const fee = parseFloat(totalProcessingFee.textContent.replace(/[^0-9.-]+/g, ''));
            totalNewFee.textContent = formatCurrency(fee);
            updateTotalSavings();
        }
        this.classList.add('active');
    });

    function updateEffectiveSavings() {
        const currentRate = parseFloat(effectiveCurrentFee.textContent);
        const newRate = parseFloat(effectiveNewFee.textContent);
        
        if (!isNaN(currentRate) && !isNaN(newRate)) {
            const sales = parseFloat(monthlySales.value);
            if (!isNaN(sales)) {
                const currentFee = sales * (currentRate / 100);
                const newFee = sales * (newRate / 100);
                const savings = currentFee - newFee;
                effectiveEstimatedSavings.textContent = formatCurrency(savings);
                effectiveEstimatedSavings.style.color = savings > 0 ? '#006AFF' : '#DC3545';
            }
        }
    }

    function updateTotalSavings() {
        const currentFee = parseFloat(totalCurrentFee.textContent.replace(/[^0-9.-]+/g, ''));
        const newFee = parseFloat(totalNewFee.textContent.replace(/[^0-9.-]+/g, ''));
        
        if (!isNaN(currentFee) && !isNaN(newFee)) {
            const savings = currentFee - newFee;
            totalEstimatedSavings.textContent = formatCurrency(savings);
            totalEstimatedSavings.style.color = savings > 0 ? '#006AFF' : '#DC3545';
        }
    }

    // Add input event listeners for real-time validation
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
});
