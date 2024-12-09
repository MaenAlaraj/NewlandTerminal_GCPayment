import React from "react";
import { setMessage } from "../utils"; // Import setMessage from utils.js
import { useGlobalContext } from "../GlobalContext"; // Adjust the path to your GlobalContext
import useSetBalance from '../useSetBalance'; // Correct the import path
import useRemoveItemsFromList  from "../UtilitiesFunctions/removeItemsFromList"; // Adjust the path to removeItemsFromList


const PaymentButton = ({ totalAmount }) => {
  const { errorsSubstring, prefix, userBeforePrefix, gcMall_code, terminalid, header_prefix, setTotal, getValueFromCatList } = useGlobalContext(); // Access necessary variables
  const removeItemsFromList = useRemoveItemsFromList (); // Call the custom hook
   // Call the hook inside the component
   const setBalance = useSetBalance(); // Ensure it's a function
 



  const handlePaymentClick = async () => { // Mark the function as async
    console.log("Payment initiated.");
    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("transitContainer").style.display = "block";
    console.log("totalAmount:", totalAmount);



        if (totalAmount === 0) {
          document.getElementById("mainContainer").style.display = "block";
          document.getElementById("transitContainer").style.display = "none";
          setMessage("商品が読み込まれていません。商品を読み込んでください。", "show_message");
        } else {
          let isFirstIteration = true;
          const listItems = document.querySelectorAll("#productList li");
          const user1 = `${prefix}${userBeforePrefix}`;
          console.log("user1:", user1);
          const user2 = `${prefix}${gcMall_code}`;
          console.log("user2:", user2);
          const message2 = "MALL用";


          for (const listItem of listItems) { // Use for...of instead of forEach
            if (isFirstIteration) {
              isFirstIteration = false;
              continue;
            }

            const spans = listItem.querySelectorAll("span");
            console.log("spans:", spans);
            const sellerCode = spans[0].textContent.trim();
            console.log("sellerCode:", sellerCode);
            const productName = spans[1].textContent.trim();
            console.log("productName:", productName);
            const productPrice = spans[2].textContent.trim();
            console.log("productPrice:", productPrice);
            const category = spans[3].textContent.trim();
            console.log("category:", category);
            const date = spans[4].textContent.trim();
            console.log("date:", date);
            const catValue = getValueFromCatList(category);
            console.log("catValue:", catValue);
            const sellerCodeE = `${prefix}${sellerCode}`;
            console.log("sellerCodeE:", sellerCodeE);
            const sellerNameRet = await window.CCWalletInterface.Name(sellerCodeE, terminalid);
            console.log("sellerNameRet:", sellerNameRet);
            const sellerNameTokens = sellerNameRet.split(":");
            console.log("sellerNameTokens:", sellerNameTokens);
            const sellerName = sellerNameTokens[1];
            console.log("sellerName:", sellerName);
            const amount = parseInt(productPrice, 10);
            console.log("amount:", amount);
            const formattedDate = date.replace(/\//g, ".");
            const message1 = `${header_prefix}${sellerCode} ${productName} ${catValue} ${category} ${formattedDate} ${sellerName}`;
            console.log("message1:", message1);

            const result = await window.CCWalletInterface.doPointPayment(user1, amount, user2, message1, message2, "");
            console.log("result:", result);
            if (result.includes(errorsSubstring)) {
              const errorMessage = `支払いエラー：${result}`;
              console.log("支払いエラー:", errorMessage);
              document.getElementById("mainContainer").style.display = "block";
              document.getElementById("transitContainer").style.display = "none";
              setMessage(errorMessage, "show_message");
            }
          }

          document.getElementById("loadProduct").disabled = false;
          // Call removeItemsFromList after successful authentication
          removeItemsFromList(); // Call the custom hook to remove items and reset totals

          //startTimer();
          document.getElementById("mainContainer").style.display = "block";
          document.getElementById("transitContainer").style.display = "none";
          setMessage("ご購入ありがとうございます！", "show_message");

          console.log("userBeforePrefix:", userBeforePrefix);
          setBalance(userBeforePrefix);
          setTotal(0)
        }
      
    









  };

  return (
    <button id="payment" onClick={handlePaymentClick}>
      支払い
    </button>
  );
};

export default PaymentButton;
