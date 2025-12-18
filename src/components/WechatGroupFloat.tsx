import React, { useState } from 'react';

const WechatGroupFloat: React.FC = () => {
  const [showQR, setShowQR] = useState(false);

  return (
    <div 
      className="wechat-float"
      onMouseEnter={() => setShowQR(true)}
      onMouseLeave={() => setShowQR(false)}
    >
      <div className="float-btn">
        <span>💬</span>
        <span className="float-text">交流群</span>
      </div>
      
      {showQR && (
        <div className="qr-popup">
          <img src={`${process.env.PUBLIC_URL}/wechat-group.png`} alt="微信群二维码" />
          <p>扫码发送 <strong>leetcode</strong> 加入算法交流群</p>
        </div>
      )}
    </div>
  );
};

export default WechatGroupFloat;
