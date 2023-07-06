# projectplant
 Get Coding Project
 neat.

        function setGameOver() {
            guessField.disabled = true;
            guessSubmit.disabled = true;        
            resetButton = document.createElement("button");
            resetButton.textContent = "Play again!";
            document.body.append(resetButton);
            resetButton.addEventListener("click", resetGame);
        }
       
       function resetGame() {
            
            const resetParas = document.querySelectorAll(".resultParas p");
            for (const resetPara of resetParas) {
                resetPara.textContent = "";
            }

            resetButton.parentNode.removeChild(resetButton);

            guessField.disabled = false;
            guessSubmit.disabled = false;
            guessField.value = "";
            guessField.focus();

            lastResult.style.backgroundColor = "white";
        }