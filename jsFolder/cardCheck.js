document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("pay").addEventListener("click", (event) => {
        event.preventDefault()
      // Clear Errors
      clearError();
  
      // Get input values
      const name = document.getElementById("name").value;
      const number = document.getElementById("cardNumber").value;
      const cvv = document.getElementById("cvv").value;
      const expDate = document.getElementById("expDate").value;
  
      // Validate input values
      const isValidName = validateName(name);
      const isValidNumber = validateCardNumber(number);
      const isValidCvv = validateCvv(cvv);
      const isValidExpDate = validateExpDate(expDate);
  
      // If all validations pass, process payment
      if (isValidName && isValidNumber && isValidCvv && isValidExpDate) {
        processPayment(number, expDate, cvv);
      }
    });

     // Function to validate name
    function validateName(name) {
        // Check if name is valid (contains only letters and removes whitespace)
      const validName = isNaN(whiteSpace(name)) && !Number.isInteger(whiteSpace(name));
  
      if (!validName) {
        document.getElementById("nameError").innerText = "Please make sure you have entered a name";
      }
  
      return validName;
    }
    //validate card number
    function validateCardNumber(number) {
    //card number is valid (must be a 16-digit MasterCard number)
      const mCard = /^(5[1-5]\d{14})$/.test(whiteSpace(number));
  
      if (!mCard) {
        document.getElementById("numberError").innerText = "Please enter a valid 16-digit MasterCard number";
      }
  
      return mCard;
    }
    //Validate cvv
    function validateCvv(cvv) {
        //removes white Space
        const trimmedCvv = whiteSpace(cvv);
        const trimCode = parseInt(trimmedCvv); // checks if int
        const cvvCode = trimmedCvv.length >= 3 && trimmedCvv.length <= 4 && Number.isInteger(trimCode); // if between 3 and 4, and int
      
        //if false output error
        if (!cvvCode) {
          document.getElementById("cvvError").innerText = "Please enter a valid 3 to 4-digit CVV code";
        }
       // returns cvvCode
        return cvvCode;
    }
      
    //validates date
    function validateExpDate(expDate) {
      const [year, month] = expDate.split("-").map((value) => parseInt(value));//splits to month and year
      const curDate = new Date();//creates current date
      const curMonth = curDate.getMonth() + 1;//corrects current date
      const curYear = curDate.getFullYear();//gets year
     //checks if year is less than current year, OR year is current year and month is less than current month
      const expired = year < curYear || (year === curYear && month <= curMonth) || isNaN(year) || isNaN(month);
     //IF expired
      if (expired) {
        //show error
        document.getElementById("dateError").innerText = "Please enter a valid expiration date";
      }
  
      return !expired;
    }
    //process payment
    //sets data
    function processPayment(number, expDate, cvv) {
      const [year, month] = expDate.split("-").map((value) => parseInt(value));
      const url = "http://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard";
      const data = {
        master_card: parseInt(whiteSpace(number)),
        exp_year: year,
        exp_month: month,
        cvv_code: cvv, 
    };
    
      //FETCH
    fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (response.status === 200) {
            return response.json();//Success
        } else if (response.status === 400) {//ERROR
            throw "Bad data was sent to the server";
        } else {
            throw "Something went wrong";
        }
    })
    .then((resJson) => {
        alert(resJson.message);// success message
        sessionStorage.setItem("cardNum", number.slice(-4));//stores in servers
        window.location.href = "success.html";//navigate to success page
    })
    .catch((error) => {
        if (error === "Bad data was sent to the server") {//error message: incorrect info entered
            alert("Please double-check the entered information and try again.");
        } else {
          alert("Something went wrong. Please try again later.");//server error
        }
        });
    }
          
    function whiteSpace(str) {//removes whiteSpace
        return str.replace(/\s+/g, "");
    }
          
    function clearError() {//clears Error messages
        document.getElementById("nameError").innerText = "";
        document.getElementById("numberError").innerText = "";
        document.getElementById("dateError").innerText = "";
        document.getElementById("cvvError").innerText = "";
    }
          
});