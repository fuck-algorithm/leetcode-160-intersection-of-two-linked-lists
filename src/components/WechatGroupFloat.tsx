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
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
          <path d="M8.5 3C4.36 3 1 5.69 1 9c0 1.78 1.02 3.37 2.6 4.45l-.6 2.35 2.7-1.35c.87.25 1.8.4 2.8.4.33 0 .66-.02.98-.05C9.17 13.97 9 13.01 9 12c0-3.87 3.58-7 8-7 .34 0 .67.02 1 .05C17.13 3.2 13.16 1.5 8.5 3zM6 8a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
          <path d="M23 14c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.7 0 1.37-.1 2-.28l2.2 1.1-.5-1.9C22.22 16.77 23 15.45 23 14zm-8-1a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z"/>
        </svg>
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
