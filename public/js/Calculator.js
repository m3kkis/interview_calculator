$(()=>{

    /**
     * Initialise class
     */
    const _CalculatorHandler = new CalculatorHandler($(".calc-input"));

    
    /**
     * Set constant focus on input
     */
    $(".calc-input").focus();

    $(".calc-input").blur(()=>{
        $(".calc-input").focus();
    });


    /**
     * Handle mouse click the button
     */
    $(".calc-keypad > .key-row > .key").on("click", (ev)=>{
        let keyName = $(ev.currentTarget).attr("name");
        _CalculatorHandler.evaluateKey(keyName);
    });


    /**
     * Handle clicks with keyboard
     * block all letters
     * except characters suchs as -,+,/,* and Enter
     */
    $(".calc-input").on("keypress", (ev)=>{

        ev.preventDefault();
        ev.stopPropagation();

        var rgx = new RegExp("^[0-9-\/*+.()]");
        var key = String.fromCharCode(ev.charCode ? ev.which : ev.charCode);
        

        if(ev.charCode == 13)
        {
            _CalculatorHandler.solveEquation();
        }
        else if(ev.charCode == 8)
        {
            _CalculatorHandler.keyList.length = 0;
            _CalculatorHandler.display();
        }
        
        if (!rgx.test(key)) {
            return false;
        }

        _CalculatorHandler.evaluateKey(key.toString());
        
    });

});