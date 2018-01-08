module.exports.authenticationFailed = {
  "type": "error",
  "id": "211a6d3e-4f78-423d-9796-a7a38811a2dc",
  "code": "invalid_credentials",
  "description": "Basic authentication failed"
};

module.exports.paymentNotFound = {
  "type": "error",
  "id": "4066d5d4-c46f-45da-862d-c958c776d46a",
  "code": "not_found",
  "description": "Payment not found or forbidden",
  "parameter": "payment_id"
};

module.exports.emptyIdempotenceKey = {
  "type": "error",
  "id": "c70bafd7-43d9-48c0-975c-a9496f89ddc8",
  "code": "invalid_request",
  "description": "Idempotence key is empty",
  "parameter": "Idempotence-Key"
};

module.exports.duplicateIdempotenceKey = {
  "type": "error",
  "id": "3100322c-4a6e-46b0-ae37-7ea6db3a493f",
  "code": "invalid_request",
  "description": "Idempotence key duplicated",
  "parameter": "Idempotence-Key"
};

module.exports.missingConfirmType = {
  "type": "error",
  "id": "8345ddf6-e908-4333-8bac-b7b6f2bbbc27",
  "code": "invalid_request",
  "description": "Missing confirmation type for payment method type: bank_card",
  "parameter": "confirmation"
};

module.exports.refundNotFound = {
  "type": "error",
  "id": "d24d9b2e-bfb8-4de4-aa1e-1622de350afc",
  "code": "not_found",
  "description": "Refund not found or forbidden"
};
