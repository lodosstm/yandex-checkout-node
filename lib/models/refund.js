function Refund(instance, data) {
  Object.assign(this, data, { _instance: instance });
}

Refund.prototype.reload = function() {
  return this._instance._getRefundInfo(this.id).then(function(data) {
    Object.assign(this, data);
    return true;
  });
};


module.exports = Refund;