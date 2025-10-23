from flask import Flask, request, jsonify

# Note: Using port 5001 to avoid conflict with your Node.js server on 5000
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_watering_mock():
    """
    MOCK ML PREDICTOR: Simulates a prediction based on simple rules.
    This allows the Node.js and ESP32 code to run without a trained model.
    """
    try:
        input_data = request.json
        current_moisture = input_data.get('moisture', 0)
        
        # --- Mock Prediction Logic ---
        
        predicted_moisture_tomorrow = current_moisture * 0.9  # Assume 10% moisture loss per day
        
        if current_moisture < 25:
            suggestion = "🚨 URGENT: Critical dryness detected. Initiate immediate watering."
        elif current_moisture < 45:
            suggestion = "⚠️ WARNING: Predicted drop below optimal level (40%) tomorrow. Water soon."
        elif current_moisture < 65:
            suggestion = "🟢 OK: Moisture levels are stable. No action needed."
        else:
            suggestion = "💧 HIGH: Moisture is high. Recommend holding watering."

        # --- End Mock Prediction Logic ---

        return jsonify({
            "status": "success",
            "predicted_moisture_tomorrow": float(predicted_moisture_tomorrow),
            "suggestion": suggestion,
            "source": "Mock ML Service" # Indicate that this is a simulated result
        })

    except Exception as e:
        return jsonify({"status": "error", "message": f"Mock service failed: {str(e)}", "source": "Mock ML Service"}), 500

if __name__ == '__main__':
    print("Mock ML Service is running. Use Node.js to connect to http://localhost:5001/predict")
    app.run(host='0.0.0.0', port=5001, debug=True)