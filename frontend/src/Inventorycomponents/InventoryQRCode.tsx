import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMobileAlt, FaQrcode } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import './InventoryQRCode.css';

interface QRCodeModalProps {
  onClose: () => void;
}

const QRCodeModal = ({ onClose }: QRCodeModalProps) => {
  // Get the network URL for mobile access
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Use the current hostname and port (will be network IP if accessed via network)
  const mobileFormUrl = `http://${hostname}:${port}/add-product-mobile`;
  
  // Display friendly network info
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const networkInfo = isLocalhost 
    ? 'Access this page using your computer\'s IP address to get a network QR code'
    : `Network: ${hostname}:${port}`;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="qr-modal-content"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="qr-modal-header">
            <div className="qr-header-icon">
              <FaQrcode />
            </div>
            <h2>Scan QR Code to Add Product</h2>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="qr-modal-body">
            <div className="qr-code-container">
              <QRCodeSVG
                value={mobileFormUrl}
                size={280}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#667eea"
                imageSettings={{
                  src: "/dairy-licious-logo.png",
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            <div className="qr-instructions">
              <div className="instruction-item">
                <FaMobileAlt className="instruction-icon" />
                <div>
                  <h3>How to Use:</h3>
                  <ol>
                    <li>Open your phone's camera app</li>
                    <li>Point it at the QR code</li>
                    <li>Tap the notification to open the form</li>
                    <li>Fill in product details and submit</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="qr-info">
              {isLocalhost ? (
                <div className="qr-warning">
                  <strong>⚠️ Important:</strong> You're accessing via localhost. 
                  To use QR code on your phone, please:
                  <ol style={{ marginTop: '10px', paddingLeft: '20px', textAlign: 'left' }}>
                    <li>Open this page using: <strong>http://192.168.x.x:{port}</strong></li>
                    <li>Find your IP in the terminal under "Network"</li>
                    <li>Make sure both devices are on the same WiFi</li>
                  </ol>
                </div>
              ) : (
                <p>
                  <strong>✅ Ready!</strong> {networkInfo} - Scan with your phone camera
                </p>
              )}
              <div className="qr-url">
                <code>{mobileFormUrl}</code>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRCodeModal;
