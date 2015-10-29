# awesome-angular-swipe

This library uses interact.js and exposes a directive which allows mobile swipe feature on everything in the DOM.

It works only for mobile device. It will do nothing on desktop (except using the dev tool to mock a mobile behavior).

# Usage

You might want to take a look at the index.html file inside the *example* folder.
The directive *swipe* can be used as a class or as an attribute. Then inject callbacks on right and left swipe, and customization like so:

    <div class="parent">
      <div class="swipe" swipe-left="doSomething" swipe-right="doAnotherSomething" icon-left="mdi-calendar" icon-right="mdi-plus">
        Swipe me!
      </div>
    </div>

Note that *swipe-left* and *swipe-right* are functions, *icon-right* and *icon-left* are whatever icons you want. We are recommending mdi icons for a much better effect.

Note also that the directive will append two *div* to the parent element (using its height and width). It is better than the child (with the *swipe directive*) have the same dimension than the parent.

# Licence

MIT

Coded with love by Linagora folks (www.linagora.com, @AwesomePaas)
