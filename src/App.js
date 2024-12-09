import React, { useState } from "react";
import "./style.css";
import "./App.css";
import { useGlobalContext } from "./GlobalContext";

import RegisterFaceButton from "./components/RegisterFaceButton";
import FaceButton from "./components/FaceButton";
import QRButton from "./components/QrButton";
import LoadProductButton from "./components/LoadProductButton";
import Payment from "./components/PaymentButton";
import LogoutButton from "./components/LogoutButton";
import WiFiStatus from "./components/WiFiStatus";

const App = () => {
  const { balanceMessage } = useGlobalContext();
  const [showLoadProductButton, setShowLoadProductButton] = useState(false);
  const [productList, setProductList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoadButtonDisabled, setIsLoadButtonDisabled] = useState(false); // State to disable button

  const handleLoadProductButtonClick = () => {
    // Disable the button and show LoadProductButton
    setIsLoadButtonDisabled(true); // Disable the button
    setShowLoadProductButton(true); // Show the LoadProductButton
  };

  return (
    <div className="App">
      {/* Authentication Container */}
      <div className="auth-container" id="authContainer">
        <p>GC Mall</p>
        <p>顔またはGCのQRを読み込ませてください</p>
        <div className="button-container">
          <FaceButton />
          <QRButton />
        </div>
        <div id="bottomLeftText">
          <span className="text-content"></span>
        </div>
        <RegisterFaceButton />
      </div>

      {/* Transit Container */}
      <div className="auth-container" id="transitContainer" style={{ display: "none" }}>
        <p>処理中...</p>
      </div>

      {/* Main Content After Successful Authentication */}
      <div id="mainContainer" style={{ display: "none" }}>
        <div id="user-container">
          <p id="user"></p> {/* User information */}
          <div className="user-details-container">
            <WiFiStatus />
            <LogoutButton id="logoutButton" />
          </div>
        </div>
        <p id="message">{balanceMessage}</p> {/* Balance message below LogoutButton */}
        <div className="button-container">
          <LoadProductButton />
        </div>
        

        <div className="scroll-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>コード</th>
                <th>商品名</th>
                <th>ポイント</th>
                <th>CAT.</th>
                <th>日付</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((item) => (
                <tr key={item.index}>
                  <td>{item.seller}</td> {/* Seller under "コード" */}
                  <td>{item.product}</td> {/* Product under "商品名" */}
                  <td>{item.price} pt</td> {/* Price under "ポイント" */}
                  <td>{item.category}</td> {/* Category under "CAT." */}
                  <td>{item.date}</td> {/* Date under "日付" */}
                  <td>
                    <div
                      className="remove-item"
                      onClick={() => {
                        const updatedList = productList.filter((i) => i.index !== item.index);
                        setProductList(updatedList);
                        setTotalAmount((prevTotal) => prevTotal - item.price);
                      }}
                    >
                      ❌
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p id="Balance"></p>
        <div id="totalAmount">トータル: {totalAmount} pt</div>
        <div className=".vertical">
          <Payment />
        </div>
      </div>
    </div>
  );
};

export default App;
