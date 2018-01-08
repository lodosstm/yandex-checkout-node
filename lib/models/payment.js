function Payment(instance, data) {
  Object.assign(this, data, { _instance: instance });
}

Payment.prototype = {
  /**
   * Retrieve payment info
   * @returns {Promise<bool>}
   */
  reload: function() {
    return this._instance._getPaymentInfo(this.id).then(function(data) {
      Object.assign(this, data);
      return true;
    });
  },

  /**
   * Capture payment
   * @param amount
   * @returns {*}
   */
  capture: function(amount) {
    return this._instance._capturePayment(this.id, amount || this.amount).then(function(data) {
      Object.assign(this, data);
      return true;
    });
  },

  /**
   * Cancel Payment
   * @returns {*}
   */
  cancel: function() {
    return this._instance._cancelPayment(this.id).then(function(data) {
      Object.assign(this, data);
      return true;
    });
  },

  /**
   * Create refund
   * @param amount
   * @returns {*|Promise.<Refund>}
   */
  refund: function(amount) {
    return this._instance.createRefund(this.id, amount || this.amount);
  }
};

module.exports = Payment;