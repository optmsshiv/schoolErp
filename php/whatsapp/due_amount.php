{
    "messaging_product": "whatsapp",
    "to": "917282071620",  // Replace with the recipient's phone number
    "type": "template",
    "template": {
        "name": "due_amount",  // Template name
        "language": {
            "code": "en_US"
        },
        "components": [
            {
                "type": "body",
                "parameters": [
                    { "type": "text", "text": "John Doe" },  // {{1}}: Student's name
                    { "type": "text", "text": "$500" },      // {{2}}: Amount
                    { "type": "text", "text": "January Tuition Fee" },  // {{3}}: Fee type
                    { "type": "text", "text": "31st January 2025" },  // {{4}}: Due date
                    { "type": "text", "text": "UPI / QR Code" },  // {{5}}: Payment method
                    { "type": "text", "text": "+1 123-456-7890" },  // {{6}}: Contact number
                    { "type": "text", "text": "XYZ School" }   // {{7}}: School name
                ]
            },
            {
                "type": "button",
                "sub_type": "flow",
                "index": 0,
                "parameters": [
                    { "type": "text", "text": "Proceed with Payment" }  // Button label
                ]
            }
        ]
    }
}
