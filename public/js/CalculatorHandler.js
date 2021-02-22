class CalculatorHandler
{
    constructor(inputBox){
        this.inputBox = inputBox;
        this.keyList = [];
        this.operatorList = [
            {
                name: "*",
                operation: (x, y) => {
                    return x * y;
                }
              },
              {
                name: "/",
                operation: (x, y) => {
                    return x / y;
                }
              },
              {
                name: "+",
                operation: (x, y) => {
                    return x + y;
                }
              },
              {
                name: "-",
                operation: (x, y) => {
                    return x - y;
                }
            }
        ];
    }

    /**
     * 
     * This function will allocate the key inputs
     * 
     */
    evaluateKey(keyName){
        switch(keyName) 
        {
            case "solve":
                this.solveEquation();
                break;
            case "clear":
                this.keyList.length = 0;
                this.display();
                break;
            case ".":
                if(isNaN(this.keyList[this.keyList.length - 1])) {
                    this.addKey("0.");
                } 
                else 
                {
                    if(this.keyList[this.keyList.length - 1].indexOf(".") == -1) 
                    {
                        this.keyList[this.keyList.length - 1] += ".";
                    }
                }
                this.display();
                break;
            default:
                this.addKey(keyName);
        }
    }

    /**
     * Here we add the keys to the array
     */
    addKey(keyName) {
        if(isNaN(keyName)) {
            if(keyName == "("  && !isNaN(this.keyList[this.keyList.length - 1])) 
            {
                this.keyList.push("*");
            }

            this.keyList.push(keyName);
        } 
        else 
        {
            if( !isNaN(this.keyList[this.keyList.length - 1]) ) {
                this.keyList[this.keyList.length - 1] = this.keyList[this.keyList.length - 1] + keyName;
            } 
            else 
            {
                if(!isNaN(keyName) && this.keyList[this.keyList.length - 1] == ")") {
                    this.keyList.push("*");
                }

                this.keyList.push(keyName);
            }
        }
        this.display();
    }


    /**
     * General theory was taken from https://brilliant.org/wiki/shunting-yard-algorithm/
     * This helped build the logic behind the priorities of operation with the paranthesis
     */
    solveEquation() {
        var arrValues = [];
        var arrOperators = [];
        var count = 0;
        var result;

        for(var i = 0; i < this.keyList.length; i++) {
            if(this.keyList[i] == "(") 
            {
                count++;
            } 
            else if(this.keyList[i] === ")")
            {
                count--;
            }
        }

        if(count != 0) {
            alert("There are extra paranthesis.");
            return;
        }
        
        for(var i = 0; i < this.keyList.length; i++) 
        {
            if(!isNaN(this.keyList[i])) 
            {
                arrValues.push(this.keyList[i]);
            } 
            else if(this.keyList[i] == "(") 
            {
                arrOperators.push(this.keyList[i]);
            } 
            else if(this.keyList[i] == ")") 
            {
                while(arrOperators[arrOperators.length - 1] != "(") 
                {
                    let op = this.getOperatorByName(arrOperators.pop());
                    arrValues.push(this.implementOperator(op, [arrValues.pop(), arrValues.pop()]));
                }
                arrOperators.pop();
            } 
            else 
            {
                while(arrOperators.length > 0 && this.hasPriority(arrOperators[arrOperators.length - 1], this.keyList[i])) 
                {
                    let op = this.getOperatorByName(arrOperators.pop());
                    arrValues.push(this.implementOperator(op, [arrValues.pop(), arrValues.pop()]));
                }
                arrOperators.push(this.keyList[i]);
            }
        }
        
        while(arrOperators.length > 0) 
        {
            
            let op = this.getOperatorByName(arrOperators.pop());
            arrValues.push(this.implementOperator(op, [arrValues.pop(), arrValues.pop()]));
        }

        
        
        result = +arrValues[0].toFixed(6);
        this.keyList.length = 0;
        this.inputBox.val( result.toString() );
      }


    /**
     * Straightforward display on the input box
     */
    display() 
    {
        var sHtml = "";
        for(var i = 0; i < this.keyList.length; i++) 
        {
            sHtml += this.keyList[i];
        }
        this.inputBox.val(sHtml);
    }


    /**
     * Retrieves the operator json from the operatorList by its name
     */
    getOperatorByName(operatorName) {
        for(var i = 0; i < this.operatorList.length; i++) 
        {
            if(this.operatorList[i].name == operatorName) 
            {
                return this.operatorList[i];
            }
        }
        return undefined;
    }

    /**
     * Performs the operator action
     */
    implementOperator(op, values) {
        return op.operation(parseFloat(values[1]), parseFloat(values[0]));
    }

    
    /**
     * Detects the priority of operator, the operatorList sequence is important
     */
    hasPriority(op1, op2) {
        if(this.getOperatorByName(op1) != undefined) 
        {
            return this.getOperatorPriority(op1) <= this.getOperatorPriority(op2);
        }
    }

    /**
     * This will grab the idx of the operator if low then make sure its 
     */
    getOperatorPriority(operatorName) {
        for(var i = 0; i < this.operatorList.length; i++) 
        {
            if(this.operatorList[i].name == operatorName) 
            {
                return i;
            }
        }
        return 999;
    }
}