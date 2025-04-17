document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const calculatorButtons = document.querySelectorAll('.calc-button');
    const calculateBtn = document.getElementById('calculateBtn');
    const transactionToggle = document.getElementById('transactionToggle');
    
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
    const percentageFee = document.getElementById('percentageFee');
    const transactionFee = document.getElementById('transactionFee');
    const totalProcessingFee = document.getElementById('totalProcessingFee');
    const netAmount = document.getElementById('netAmount');
    
    // Default calculator type
    let currentCalculator = 'effective';
    let includeTransactions = false;

    // Transaction toggle handler
    transactionToggle.addEventListener('change', function() {
        includeTransactions = this.checked;
        toggleTransactionElements();
    });

    function toggleTransactionElements() {
        transactionInputs.forEach(input => {
            if (includeTransactions) {
                input.classList.remove('hidden');
            } else {
                input.classList.add('hidden');
            }
        });

        transactionResults.forEach(result => {
            if (includeTransactions) {
                result.classList.remove('hidden');
            } else {
                result.classList.add('hidden');
            }
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
        } else {
            effectiveRateInputs.classList.add('hidden');
            totalFeeInputs.classList.remove('hidden');
            effectiveRateResults.classList.add('hidden');
            totalFeeResults.classList.remove('hidden');
        }
        clearInputs();
        clearResults();
    }

    function clearInputs() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => input.value = '');
        
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    }

    function clearResults() {
        effectiveRateValue.textContent = '0.00%';
        effectiveProcessingFee.textContent = '$0.00';
        effectivePerTransaction.textContent = '$0.00';
        percentageFee.textContent = '$0.00';
        transactionFee.textContent = '$0.00';
        totalProcessingFee.textContent = '$0.00';
        netAmount.textContent = '$0.00';
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
        
        // Display results
        effectiveRateValue.textContent = `${rate.toFixed(2)}%`;
        effectiveProcessingFee.textContent = `$${fee.toFixed(2)}`;

        if (includeTransactions) {
            const transactions = parseInt(monthlyTransactions.value);
            const perTransaction = fee / transactions;
            effectivePerTransaction.textContent = `$${perTransaction.toFixed(2)}`;
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
        percentageFee.textContent = `$${percentageBasedFee.toFixed(2)}`;
        if (includeTransactions) {
            transactionFee.textContent = `$${totalTransactionFee.toFixed(2)}`;
        }
        totalProcessingFee.textContent = `$${totalFee.toFixed(2)}`;
        netAmount.textContent = `$${net.toFixed(2)}`;
    }

    // Calculate button click handler
    calculateBtn.addEventListener('click', function() {
        if (currentCalculator === 'effective') {
            calculateEffectiveRate();
        } else {
            calculateTotalFee();
        }
    });

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