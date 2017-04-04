var PlaceOrder = Extend(MasterClass,{


	init:function(){
		mfw.__init();

		var o = this;

		o.detectApplePayBtn();
	},

	ready:function() {
		var o = this;
		mfw.__ready();
		mfw.mailcheck();
	},

	detectApplePayBtn: function() {
		// use a mutation observer to detect the insertion of the apple pay button
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
			observer,
			o = this;

		observer = new MutationObserver(function() {
			var apLink = $('#apLink'),
				_this = this;

			if (apLink.length) {
				o.displayApplePayBtn(apLink);

				// turn off the observer
				_this.disconnect();
			}
		});

		// watch for element insertions in the body
		observer.observe(document.body, {
            childList: true,
            subtree: true
        });
	},

	displayApplePayBtn: function(apLink) {
		// insert apple pay css
		$('head').append(
			'<style>' +
				'.apple-pay-button-with-text { --apple-pay-scale: 1.40625; /* (height / 32) */ display: inline-flex; justify-content: center; font-size: 12px; border-radius: 5px; padding: 0px; box-sizing: border-box; width: 100%; min-width: 130px; height: 45px; min-height: 32px; max-height: 64px;}.apple-pay-button-black-with-text { background-color: black; color: white;}.apple-pay-button-white-with-text { background-color: white; color: black;}.apple-pay-button-white-with-line-with-text { background-color: white; color: black; border: .5px solid black;}.apple-pay-button-with-text.apple-pay-button-black-with-text > .logo { background-image: -webkit-named-image(apple-pay-logo-white); background-color: black;}.apple-pay-button-with-text.apple-pay-button-white-with-text > .logo { background-image: -webkit-named-image(apple-pay-logo-black); background-color: white;}.apple-pay-button-with-text.apple-pay-button-white-with-line-with-text > .logo { background-image: -webkit-named-image(apple-pay-logo-black); background-color: white;}.apple-pay-button-with-text > .text { font-family: -apple-system; font-size: calc(1em * var(--apple-pay-scale)); font-weight: 300; align-self: center; margin-right: calc(2px * var(--apple-pay-scale));}.apple-pay-button-with-text > .logo { width: calc(35px * var(--apple-pay-scale)); height: 100%; background-size: 100% 60%; background-repeat: no-repeat; background-position: 0 50%; margin-left: calc(2px * var(--apple-pay-scale)); border: none;}' +
				'.apple-pay-button { display: inline-block; background-size: 100% 60%; background-repeat: no-repeat; background-position: 50% 50%; border-radius: 5px; padding: 0px; box-sizing: border-box; min-width: 80px; min-height: 32px; max-height: 64px;}.apple-pay-button-black { background-image: -webkit-named-image(apple-pay-logo-white); background-color: black;}.apple-pay-button-white { background-image: -webkit-named-image(apple-pay-logo-black); background-color: white;}.apple-pay-button-white-with-line { background-image: -webkit-named-image(apple-pay-logo-black); background-color: white; border: .5px solid black;}' +
				'.payment_radios .apple-pay-button { position: relative; top: 9px; margin-left: 5px; }' +
			'</style>'
		);

		// MOVE CODE BELOW TO apple_pay.js when apple pay is taken out of the signal container
		var mainContent = $('#_main_content');
		// get elements that will be hidden/unhidden
		var billingHdr = mainContent.find('h1:contains("Billing Details")');
		var billingForm = mainContent.find('form[data-id="BillingAddressForm"]');
		var billingInputs = billingForm.find('> div:nth-last-child(n+4)').filter(function(el) {
  			return $(this).attr('id') != 'confirmEmail' && $(this).attr('id') != 'passportConfirm'
		});
		var emailPromoChkBox = billingForm.find('div:contains("promotions and special offers")');
		var addressChkBox = billingForm.find('div[data-visibility="billingaddress_change"]:visible');
		var externalPayInfo = mainContent.find(
			'div[data-visibility="VISACheckoutLogo"],div[data-visibility="VISACheckoutCustomerInfo"],' +
			'div[data-visibility="BMLLogo"],div[data-visibility="googleWalletLogo"],div[data-visibility="whatisthis"]'
		);
		var checkoutBtns = mainContent.find('#checkout_buttons');
		checkoutBtns = checkoutBtns.length > 0 ? checkoutBtns : mainContent.find('#_order_summary');
		var amexBtn = mainContent.find('#divPlaceOrderBtnAmex');
		var orderCCBtn = checkoutBtns.find('#_placeOderWithCreditCard');
		var orderVisaBtn = checkoutBtns.find('#_placeOderWithVisa');
		var visaInfo = mainContent.find('div[data-visibility="VISACheckoutLogo"]');
		var orderChaseBtn = checkoutBtns.find('#divPlaceOrderBtnChase');
		var orderPayPalBtn = checkoutBtns.find('#_placeOderWithPayPal');
		var payPalInfo = mainContent.find('div[data-visibility="whatisthis"]');

		// insert mobile apple pay buttons
		var applePayBtn = checkoutBtns.prepend(
				'<div id="_apple_pay_btn" class="row full_margin_top hide">' +
					'<div class="apple-pay-button-with-text apple-pay-button-black-with-text">' +
					  '<span class="text">Buy With</span>' +
					  '<span class="logo"></span>' +
					'</div>' +
				'</div>'
			).find('#_apple_pay_btn div.apple-pay-button-with-text')
			.click(function() {
				// link mobile apple pay button with desktop apple pay button
				apLink.click();
				mfw.cookies.writeCookie("NLC", 'moovweb');
			}).parent();

		// on ipad, move apple pay button below total price
		checkoutBtns.find('#_total_price').after(applePayBtn);

		var paymentForm = mainContent.find('#_payment_form');
		var ccForm = paymentForm.find('div[data-visibility="FDCreditCardDisplay"]');
		var applePayCookie = 'applePayRadioStatus';
		var applePayStatus = mfw.cookies.get_cookie(applePayCookie);
		// insert apple pay radio button
		var applePayRadio = paymentForm.prepend(
				'<div class="row no_margin payment_radios">' +
					'<div class="input_holder">' +
						'<label>' +
							'<input type="radio" id="_apple_pay_radio" class="custom check_val"/>' +
							'<span></span>' +
							'<span class="apple-pay-button apple-pay-button-white-with-line"></span>' +
						'</label>' +
					'</div>' +
				'</div>'
			).find('#_apple_pay_radio')
			.change(function() {
				if ($(this).is(':checked')) {
					// hide un-needed elements
					billingHdr.addClass('hide');
					billingInputs.addClass('hide force_hide');
					ccForm.addClass('hide force_hide');
					externalPayInfo.addClass('hide');
					amexBtn.css('display', 'none');
					addressChkBox.addClass('hide');
					$('#_placeOderWithCreditCard').addClass('hide');
					// show needed elements
					emailPromoChkBox.removeClass('hide');
					// uncheck previously checked radio button
					paymentForm.find('input[id!="_apple_pay_radio"]:checked').prop('checked', false).change();
					billingForm.removeClass('force_hide');
					checkoutBtns.children('div[data-visibility]:visible,div[data-visibility-class]:visible').addClass('hide force_hide');
					applePayBtn.removeClass('hide');
					// set cookie to E
					mfw.cookies.writeCookie(applePayCookie, 'E');
				} else {
					// unhide elements when apple pay radio is unchecked
					billingHdr.removeClass('hide');
					billingInputs.removeClass('hide force_hide');
					addressChkBox.removeClass('hide');
					$('#_placeOderWithCreditCard').removeClass('hide');
					// hide the mobile apple pay button
					applePayBtn.addClass('hide');
					// set cookie to D
					mfw.cookies.writeCookie(applePayCookie, 'D');
				}
			});

		// if page is from apple pay or apple pay had been previously selected then select apple pay as default
		if (applePayStatus === null ||	applePayStatus === 'E') {
			applePayRadio.prop('checked', true).change();
		}

		// when clicked, mark the apple pay radio button as checked
		applePayRadio.parent()
			.click(function() {
				if (!applePayRadio.is(':checked')) {
					applePayRadio.prop('checked', true).change();
				}
			});
		// when other radio buttons are marked as checked, then uncheck the apple pay radio button
		paymentForm.find('input[id!="_apple_pay_radio"]').parent()
			.click(function() {
				if (applePayRadio.is(':checked')) {
					applePayRadio.prop('checked', false).change();
				}

				// unhide buttons based on value
				var inputVal = $(this).find('input').attr('value');
				switch (inputVal) {
					case 'creditcard':
						ccForm.removeClass('hide force_hide');
						orderCCBtn.removeClass('hide force_hide');
						break;
					case 'VISACheckout':
						orderVisaBtn.removeClass('hide force_hide');
						visaInfo.removeClass('hide');
						break;
					case 'CHASECheckout':
						orderChaseBtn.removeClass('hide force_hide');
						break;
					case 'PayPal':
						orderPayPalBtn.removeClass('hide force_hide');
						payPalInfo.removeClass('hide');
						break;
					default:
						break;
				}
			});
	}
});
