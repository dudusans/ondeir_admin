import * as xml from 'jstoxml';
import * as req from 'request';

export class PagSeguroIntegration
{
  public email = '';
  public token = '';
  public mode = '';
  public obj;
  public xml = '';

  public constructor(configObj) {
    if (arguments.length > 1) {
      this.email = arguments[0];
      this.token = arguments[1];
      this.mode = "payment";
      console.warn("This constructor is deprecated. Please use a single object with the config options as attributes");
    } else {
      this.email = configObj.email;
      this.token = configObj.token;
      this.mode = configObj.mode || "payment";
    }
    this.obj = {};
    this.xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

    this.obj.mode = 'default';
    this.obj.method = 'creditCard';

    return this;
  }

  public currency(cur) {
    this.obj.currency = cur;
  };

  public reference(ref) {
    this.obj.reference = ref;
    return this;
  };

  public addItem(item) {
      if (this.mode === 'subscription') {
        throw new Error("This function is for payment mode only!");
      }
      if (this.obj.items == null) {
        this.obj.items = [];
      }
      this.obj.items.push({
        item: item
      });
      return this;
    };

    public buyer(buyer) {
      this.obj.sender = {
        name: buyer.name,
        email: buyer.email,
        phone: {
          areaCode: buyer.phoneAreaCode,
          number: buyer.phoneNumber
        }        
      };

      if (this.obj.sender.documents == null) {
        this.obj.sender.documents = [];
      }
      this.obj.sender.documents.push({
        document: {type: 'CPF', value: buyer.document}
      });

      if (this.mode === 'subscription') {
        this.obj.sender.address = {};
        if (buyer.street != null) {
          this.obj.sender.address.street = buyer.street;
        }
        if (buyer.number != null) {
          this.obj.sender.address.number = buyer.number;
        }
        if (buyer.postalCode != null) {
          this.obj.sender.address.postalCode = buyer.postalCode;
        }
        if (buyer.city != null) {
          this.obj.sender.address.city = buyer.city;
        }
        if (buyer.state != null) {
          this.obj.sender.address.state = buyer.state;
        }
        if (buyer.country != null) {
          this.obj.sender.address.country = buyer.country;
        }
        if (buyer.complement != null) {
          this.obj.sender.address.complement = buyer.complement;
        }
        if (buyer.district != null) {
          this.obj.sender.address.district = buyer.district;
        }
      }
      return this;
    };

    public creditCard(cardInfo, total, buyer) {
      this.obj.creditCard = {
        token: "",
        installment: {
          quantity: 1,
          value: total
        },
        holder: {
          name: cardInfo.cardName,
          birthDate: cardInfo.birthDate,
          phone: {
            areaCode: buyer.phoneAreaCode,
            number: buyer.phoneNumber
          } 
        },
        billingAddress: {
          street: buyer.address,
          number: buyer.number,
          complement: '',
          postalCode: buyer.zipCode,
          city: buyer.city,
          state: buyer.state,
          district: buyer.district,
          country: 'BRA'
        }
      };

      if (this.obj.creditCard.holder.documents == null) {
        this.obj.creditCard.holder.documents = [];
      }
      this.obj.creditCard.holder.documents.push({
        document: {type: 'CPF', value: buyer.document}
      });
    }

    public shipping(shippingInfo) {
      switch (this.mode) {
        case 'payment':
        case 'sandbox':
          this.obj.shipping = {
            type: shippingInfo.type,
            address: {
              street: shippingInfo.street,
              number: shippingInfo.number,
              postalCode: shippingInfo.postalCode,
              city: shippingInfo.city,
              state: shippingInfo.state,
              district: shippingInfo.district,              
              country: shippingInfo.country
            }
          };
          if (shippingInfo.complement != null) {
            this.obj.shipping.complement = shippingInfo.complement;
          }
          if (shippingInfo.district != null) {
            this.obj.shipping.district = shippingInfo.district;
          }
          break;
        case 'subscription':
          if (this.obj.sender == null) {
            this.obj.sender = {};
          }
          this.obj.sender.address = {
            street: shippingInfo.street,
            number: shippingInfo.number,
            postalCode: shippingInfo.postalCode,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country
          };
          if (shippingInfo.complement != null) {
            this.obj.sender.address.complement = shippingInfo.complement;
          }
          if (shippingInfo.district != null) {
            this.obj.sender.address.district = shippingInfo.district;
          }
        default: 
          this.obj.shipping = {
            type: shippingInfo.type,
            address: {
              street: shippingInfo.street,
              number: shippingInfo.number,
              postalCode: shippingInfo.postalCode,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country              
            }
          };
          if (shippingInfo.complement != null) {
            this.obj.shipping.complement = shippingInfo.complement;
          }
          if (shippingInfo.district != null) {
            this.obj.shipping.address.district = shippingInfo.district;
          }
          break;
      }
      return this;
    };

    public preApproval(preApprovalInfo) {
      let maxTotalAmount, twoYearsFromNow;
      if (this.mode === 'subscription') {
        twoYearsFromNow = new Date();
        twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
        maxTotalAmount = preApprovalInfo.maxTotalAmount * 1 || preApprovalInfo.amountPerPayment * 24 || preApprovalInfo.maxAmountPerPayment * 24;
        this.obj.preApproval = {
          charge: preApprovalInfo.charge || 'manual',
          finalDate: preApprovalInfo.finalDate || twoYearsFromNow.toJSON(),
          maxTotalAmount: maxTotalAmount.toFixed(2)
        };
        if (preApprovalInfo.name != null) {
          this.obj.preApproval.name = preApprovalInfo.name;
        }
        if (preApprovalInfo.details != null) {
          this.obj.preApproval.details = preApprovalInfo.details;
        }
        if (preApprovalInfo.period != null) {
          this.obj.preApproval.period = preApprovalInfo.period;
        }
        if (preApprovalInfo.amountPerPayment != null) {
          this.obj.preApproval.amountPerPayment = preApprovalInfo.amountPerPayment;
        }
        if (preApprovalInfo.maxAmountPerPayment != null) {
          this.obj.preApproval.maxAmountPerPayment = preApprovalInfo.maxAmountPerPayment;
        }
        if (preApprovalInfo.maxPaymentsPerPeriod != null) {
          this.obj.preApproval.maxPaymentsPerPeriod = preApprovalInfo.maxPaymentsPerPeriod;
        }
        if (preApprovalInfo.maxAmountPerPeriod != null) {
          this.obj.preApproval.maxAmountPerPeriod = preApprovalInfo.maxAmountPerPeriod;
        }
        if (preApprovalInfo.initialDate != null) {
          this.obj.preApproval.initialDate = preApprovalInfo.initialDate;
        }
      } else {
        throw new Error("This function is for subscription mode only!");
      }
      return this;
    };


    /*
    Configura as URLs de retorno e de notificação por pagamento
     */

    public setRedirectURL(url) {
      this.obj.redirectURL = url;
      return this;
    };

    public setNotificationURL(url) {
      this.obj.notificationURL = url;
      return this;
    };

    public setReviewURL(url) {
      if (this.mode === "subscription") {
        this.obj.reviewURL = url;
      } else {
        throw new Error("This function is for subscription mode only!");
      }
      return this;
    };

    public send(callback) {
      let options;
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml; charset=UTF-8'
        }
      };
      switch (this.mode) {
        case 'payment':
          options.uri = "https://ws.pagseguro.uol.com.br/v2/checkout?email=" + this.email + "&token=" + this.token;
          options.body = this.xml + xml.toXML({
            checkout: this.obj
          });
          break;
        case 'direct':
          options.uri = "https://ws.pagseguro.uol.com.br/v2/transactions?email=" + this.email + "&token=" + this.token;
          options.body = this.xml + xml.toXML({
            payment: this.obj
          });
          break;
        case 'subscription':
          options.uri = "https://ws.pagseguro.uol.com.br/v2/pre-approvals/request?email=" + this.email + "&token=" + this.token;
          options.body = this.xml + xml.toXML({
            preApprovalRequest: this.obj
          });
          break;
        case 'sandbox':
          options.uri = "https://ws.sandbox.pagseguro.uol.com.br/v2/checkout?email=" + this.email + "&token=" + this.token;
          options.body = this.xml + xml.toXML({
            checkout: this.obj
          });
          break;
        case 'direct-sandbox':
          options.uri = "https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?email=" + this.email + "&token=" + this.token;
          options.body = this.xml + xml.toXML({
            payment: this.obj
          });
          break;
      }
      return req(options, function(err, res, body) {
        if (err) {
          return callback(err);
        } else {
          return callback(null, body);
        }
      });
    };

}